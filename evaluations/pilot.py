#!/usr/bin/env python3
"""
Pilot evaluation runner for semantic anchor multiple-choice tests.
Reads YAML specs, sends questions to LLMs, scores responses.

Usage:
  python3 pilot.py --model claude      # Claude Sonnet via Anthropic API
  python3 pilot.py --model ollama      # Local model via Ollama (OpenAI-compatible)
  python3 pilot.py --model claude ollama  # Both
  python3 pilot.py --dry-run           # Show prompts without sending
"""

import argparse
import json
import os
import random
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML required: pip install pyyaml")
    sys.exit(1)

SPECS_DIR = Path(__file__).parent / "specs"
RESULTS_DIR = Path(__file__).parent / "results"
POSITION_PERMUTATIONS = [
    [0, 1, 2, 3],  # A B C D (original)
    [1, 2, 3, 0],  # B C D A
    [2, 3, 0, 1],  # C D A B
    [3, 0, 1, 2],  # D A B C
]
LETTERS = ["A", "B", "C", "D"]


def load_specs():
    specs = []
    for f in sorted(SPECS_DIR.glob("*.yaml")):
        with open(f, encoding="utf-8") as fh:
            specs.append(yaml.safe_load(fh))
    return specs


def build_prompt(question_text, options, permutation):
    """Build a prompt with options in the given permutation order."""
    lines = [question_text.strip(), ""]
    for i, perm_idx in enumerate(permutation):
        letter = LETTERS[i]
        option_text = options[LETTERS[perm_idx]]
        lines.append(f"{letter}) {option_text}")
    lines.append("")
    lines.append("Answer with the letter only.")
    return "\n".join(lines)


def correct_letter_for_permutation(original_correct, permutation):
    """Find which letter the original correct answer maps to in this permutation."""
    original_idx = LETTERS.index(original_correct)
    for i, perm_idx in enumerate(permutation):
        if perm_idx == original_idx:
            return LETTERS[i]
    return None


def parse_response(text):
    """Extract the first capital letter A-D from the response.
    Strips <think>...</think> blocks (used by reasoning models like qwen3)."""
    import re
    # Remove thinking blocks (qwen3, DeepSeek R1, etc.)
    cleaned = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()
    # If nothing left after stripping, fall back to original
    if not cleaned:
        cleaned = text.strip()
    # Try to find a standalone answer letter (e.g., "B", "B)", "**B**", "b")
    # First: look for a line that is just a letter (strongest signal)
    for line in cleaned.split('\n'):
        line = line.strip().strip('*').strip('.').strip(')').strip()
        if line.upper() in ("A", "B", "C", "D"):
            return line.upper()
    # Fallback: first capital A-D in the text
    for char in cleaned:
        if char in "ABCD":
            return char
    return None


def call_claude_api(prompt, model="claude-sonnet-4-20250514"):
    """Send prompt to Claude via Anthropic API."""
    try:
        import anthropic
    except ImportError:
        print("anthropic package required: pip install anthropic")
        sys.exit(1)

    client = anthropic.Anthropic()
    response = client.messages.create(
        model=model,
        max_tokens=10,
        temperature=0,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text, model


def call_claude_cli(prompt, model="claude-cli"):
    """Send prompt to Claude Sonnet via claude -p CLI."""
    import subprocess
    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode != 0:
        return f"ERROR: {result.stderr.strip()}", model
    return result.stdout.strip(), model


def call_claude_haiku(prompt, model="claude-haiku"):
    """Send prompt to Claude Haiku via claude -p CLI."""
    import subprocess
    result = subprocess.run(
        ["claude", "-p", prompt, "--model", "haiku"],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode != 0:
        return f"ERROR: {result.stderr.strip()}", model
    return result.stdout.strip(), model


def call_openai(prompt, model="gpt-4o-mini"):
    """Send prompt to OpenAI API."""
    try:
        import openai
    except ImportError:
        print("openai package required: pip install openai")
        sys.exit(1)

    client = openai.OpenAI()
    response = client.chat.completions.create(
        model=model,
        max_tokens=10,
        temperature=0,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content.strip(), model


def make_ollama_caller(ollama_model, no_think=False):
    """Create an Ollama caller for a specific model."""
    def call_ollama(prompt, model=ollama_model):
        try:
            import openai
        except ImportError:
            print("openai package required: pip install openai")
            sys.exit(1)

        actual_prompt = prompt
        if no_think:
            actual_prompt = "/no_think\n" + prompt

        client = openai.OpenAI(
            base_url="http://localhost:11434/v1",
            api_key="ollama",
        )
        # With thinking: need 2048 tokens for <think> block.
        # Without: 10 tokens is enough for a single letter.
        max_tok = 50 if no_think else 2048
        response = client.chat.completions.create(
            model=model,
            max_tokens=max_tok,
            temperature=0,
            messages=[{"role": "user", "content": actual_prompt}],
        )
        return response.choices[0].message.content or "", f"ollama/{model}"
    return call_ollama


def run_question(question_data, call_fn, label, context="", verbose=False):
    """Run a single question 4x with randomized positions. Returns results."""
    question_text = question_data["question"]
    if context:
        question_text = f"{context}\n{question_text}"
    options = question_data["options"]
    original_correct = question_data["correct"]

    results = []
    for i, perm in enumerate(POSITION_PERMUTATIONS):
        prompt = build_prompt(question_text, options, perm)
        expected = correct_letter_for_permutation(original_correct, perm)

        response_text, model_id = call_fn(prompt)
        answer = parse_response(response_text)
        correct = answer == expected

        if verbose and i == 0:  # show first permutation only
            print(f"\n    [RAW] expected={expected} parsed={answer} response={repr(response_text[:200])}")

        results.append({
            "permutation": [LETTERS[p] for p in perm],
            "expected": expected,
            "answer": answer,
            "correct": correct,
            "raw_response": response_text.strip(),
        })
        time.sleep(0.5)  # rate limiting

    score = sum(1 for r in results if r["correct"]) / len(results)
    return {
        "label": label,
        "score": score,
        "results": results,
    }


def run_pilot(models, dry_run=False, verbose=False):
    specs = load_specs()
    print(f"Loaded {len(specs)} anchor specs")
    print(f"Models: {', '.join(models)}")
    print(f"Dry run: {dry_run}")
    print()

    all_results = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "models": {},
    }

    for model_name in models:
        if model_name == "claude":
            call_fn = call_claude_api
        elif model_name == "claude-cli":
            call_fn = call_claude_cli
        elif model_name == "claude-haiku":
            call_fn = call_claude_haiku
        elif model_name == "openai":
            call_fn = call_openai
        elif model_name == "ollama":
            call_fn = make_ollama_caller(args.ollama_model, no_think=args.no_think)
        else:
            print(f"Unknown model: {model_name}")
            continue

        print(f"=== {model_name.upper()} ===")
        model_results = []

        for spec in specs:
            anchor = spec["anchor"]
            questions = spec.get("questions", {})

            # Level 1: Recognition
            if "recognition" in questions:
                q = questions["recognition"]
                if dry_run:
                    prompt = build_prompt(q["question"], q["options"], POSITION_PERMUTATIONS[0])
                    print(f"\n[DRY RUN] {anchor} / recognition:")
                    print(prompt)
                else:
                    print(f"  {anchor} / recognition...", end=" ", flush=True)
                    result = run_question(q, call_fn, f"{anchor}/recognition", verbose=verbose)
                    print(f"{result['score']:.0%}")
                    model_results.append(result)

            # Level 2: Application (anchor variant)
            if "application" in questions:
                app = questions["application"]
                anchor_q = {
                    "question": f"{app['scenario'].strip()}\n{app['anchor_prompt']}",
                    "options": app["options"],
                    "correct": app["correct"],
                }
                para_q = {
                    "question": f"{app['scenario'].strip()}\n{app['paraphrase_prompt']}",
                    "options": app["options"],
                    "correct": app["correct"],
                }
                if dry_run:
                    prompt = build_prompt(anchor_q["question"], anchor_q["options"], POSITION_PERMUTATIONS[0])
                    print(f"\n[DRY RUN] {anchor} / application (anchor):")
                    print(prompt)
                else:
                    print(f"  {anchor} / application (anchor)...", end=" ", flush=True)
                    result_a = run_question(anchor_q, call_fn, f"{anchor}/application-anchor", verbose=verbose)
                    print(f"{result_a['score']:.0%}")
                    model_results.append(result_a)

                    print(f"  {anchor} / application (paraphrase)...", end=" ", flush=True)
                    result_p = run_question(para_q, call_fn, f"{anchor}/application-paraphrase", verbose=verbose)
                    print(f"{result_p['score']:.0%}")
                    model_results.append(result_p)

            # Level 4: Consistency
            if "consistency" in questions:
                cons = questions["consistency"]
                variants = cons.get("variants", [])
                lang = cons.get("language_variant")
                if lang:
                    variants = variants + [lang]

                for i, variant in enumerate(variants):
                    variant_q = {
                        "question": variant,
                        "options": cons["options"],
                        "correct": cons["correct"],
                    }
                    variant_label = f"variant-{i+1}" if i < len(cons.get("variants", [])) else "language"
                    if dry_run:
                        prompt = build_prompt(variant_q["question"], variant_q["options"], POSITION_PERMUTATIONS[0])
                        print(f"\n[DRY RUN] {anchor} / consistency ({variant_label}):")
                        print(prompt)
                    else:
                        print(f"  {anchor} / consistency ({variant_label})...", end=" ", flush=True)
                        result = run_question(variant_q, call_fn, f"{anchor}/consistency-{variant_label}", verbose=verbose)
                        print(f"{result['score']:.0%}")
                        model_results.append(result)

        all_results["models"][model_name] = model_results

    if not dry_run:
        RESULTS_DIR.mkdir(parents=True, exist_ok=True)
        ts = datetime.now().strftime("%Y%m%d-%H%M%S")
        out_file = RESULTS_DIR / f"pilot-{ts}.json"
        with open(out_file, "w", encoding="utf-8") as fh:
            json.dump(all_results, fh, indent=2, ensure_ascii=False)
        print(f"\nResults saved to {out_file}")

        # Summary
        print("\n=== SUMMARY ===")
        for model_name, results in all_results["models"].items():
            scores = [r["score"] for r in results]
            avg = sum(scores) / len(scores) if scores else 0
            print(f"{model_name}: {avg:.0%} average ({len(scores)} questions)")
            for r in results:
                status = "✓" if r["score"] == 1.0 else f"{r['score']:.0%}"
                print(f"  {r['label']}: {status}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Pilot evaluation runner")
    parser.add_argument("--model", nargs="+", default=["claude-cli"],
                        choices=["claude", "claude-cli", "claude-haiku", "openai", "ollama"],
                        help="Models to evaluate (default: claude)")
    parser.add_argument("--ollama-model", default="qwen3:4b",
                        help="Ollama model name (default: qwen3:4b)")
    parser.add_argument("--no-think", action="store_true",
                        help="Disable reasoning/thinking for Ollama models (faster, fewer tokens)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show prompts without sending")
    parser.add_argument("--verbose", action="store_true",
                        help="Print raw responses for debugging")
    args = parser.parse_args()
    run_pilot(args.model, args.dry_run, args.verbose)
