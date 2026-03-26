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
    """Find which letter the original correct answer maps to in this permutation.
    Returns 'X' for sanity checks (no correct answer exists)."""
    if original_correct == "X":
        return "X"
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


# Global temperature — set via --temperature flag
TEMPERATURE = 0.0


def set_temperature(t):
    global TEMPERATURE
    TEMPERATURE = t


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
        temperature=TEMPERATURE,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text, model


def call_claude_cli(prompt, model="claude-cli"):
    """Send prompt to Claude Sonnet via claude -p CLI.
    Note: temperature cannot be controlled via CLI."""
    import subprocess
    result = subprocess.run(
        ["claude", "-p", prompt],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode != 0:
        return f"ERROR: {result.stderr.strip()}", model
    return result.stdout.strip(), model


def call_claude_haiku(prompt, model="claude-haiku"):
    """Send prompt to Claude Haiku via claude -p CLI.
    Note: temperature cannot be controlled via CLI."""
    import subprocess
    result = subprocess.run(
        ["claude", "-p", prompt, "--model", "haiku"],
        capture_output=True, text=True, timeout=60,
    )
    if result.returncode != 0:
        return f"ERROR: {result.stderr.strip()}", model
    return result.stdout.strip(), model


def make_openai_caller(openai_model):
    """Create an OpenAI caller for a specific model."""
    def call_openai(prompt, model=openai_model):
        try:
            import openai
        except ImportError:
            print("openai package required: pip install openai")
            sys.exit(1)

        client = openai.OpenAI()
        # GPT-5+ and reasoning models require different parameters
        is_new_api = any(x in model for x in ("gpt-5", "o3", "o4"))
        kwargs = {"model": model, "messages": [{"role": "user", "content": prompt}]}
        if is_new_api:
            kwargs["max_completion_tokens"] = 2048
            # GPT-5 only supports temperature=1
        else:
            kwargs["max_tokens"] = 10
            kwargs["temperature"] = TEMPERATURE
        response = client.chat.completions.create(**kwargs)
        return response.choices[0].message.content.strip(), model
    return call_openai


def make_mistral_caller(mistral_model):
    """Create a Mistral caller via OpenAI-compatible API."""
    def call_mistral(prompt, model=mistral_model):
        try:
            import openai
        except ImportError:
            print("openai package required: pip install openai")
            sys.exit(1)

        client = openai.OpenAI(
            base_url="https://api.mistral.ai/v1",
            api_key=os.environ.get("MISTRAL_API_KEY", ""),
        )
        response = client.chat.completions.create(
            model=model,
            max_tokens=10,
            temperature=TEMPERATURE,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content.strip(), model
    return call_mistral


def make_deepseek_caller(deepseek_model):
    """Create a DeepSeek caller via OpenAI-compatible API."""
    def call_deepseek(prompt, model=deepseek_model):
        try:
            import openai
        except ImportError:
            print("openai package required: pip install openai")
            sys.exit(1)

        client = openai.OpenAI(
            base_url="https://api.deepseek.com",
            api_key=os.environ.get("DEEPSEEK_API_KEY", ""),
        )
        response = client.chat.completions.create(
            model=model,
            max_tokens=10,
            temperature=TEMPERATURE,
            messages=[{"role": "user", "content": prompt}],
        )
        return response.choices[0].message.content.strip(), model
    return call_deepseek


def make_ollama_caller(ollama_model, no_think=False, base_url="http://localhost:11434"):
    """Create an Ollama caller for a specific model."""
    def call_ollama(prompt, model=ollama_model):
        import urllib.request

        body = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
            "options": {"temperature": TEMPERATURE},
        }
        if no_think:
            body["think"] = False

        data = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(
            f"{base_url}/api/chat",
            data=data,
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=300) as resp:
            result = json.loads(resp.read())

        content = result.get("message", {}).get("content", "")
        return content, f"ollama/{model}"
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

        try:
            response_text, model_id = call_fn(prompt)
        except Exception as e:
            response_text = f"ERROR: {e}"
            if verbose:
                print(f"\n    [ERROR] {e}")

        answer = parse_response(response_text)
        correct = answer == expected

        if verbose and i == 0:  # show first permutation only
            print(f"\n    [RAW] expected={expected} parsed={answer} response={repr(response_text[:200])}")

        results.append({
            "permutation": [LETTERS[p] for p in perm],
            "expected": expected,
            "answer": answer,
            "correct": correct,
            "raw_response": response_text.strip()[:500],
        })
        time.sleep(0.5)  # rate limiting

    score = sum(1 for r in results if r["correct"]) / len(results)
    return {
        "label": label,
        "score": score,
        "results": results,
    }


def save_results(all_results, out_file):
    """Save results incrementally after each question."""
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as fh:
        json.dump(all_results, fh, indent=2, ensure_ascii=False)


def run_pilot(models, dry_run=False, verbose=False, ollama_model="qwen3:4b", no_think=False,
              ollama_url="http://localhost:11434", openai_model="gpt-4o-mini",
              mistral_model="mistral-large-latest", deepseek_model="deepseek-chat"):
    start_time = time.time()
    specs = load_specs()
    print(f"Loaded {len(specs)} anchor specs")
    print(f"Models: {', '.join(models)}")
    print(f"Temperature: {TEMPERATURE}")
    if "openai" in models:
        print(f"OpenAI model: {openai_model}")
    if "mistral" in models:
        print(f"Mistral model: {mistral_model}")
    if "deepseek" in models:
        print(f"DeepSeek model: {deepseek_model}")
    if "ollama" in models:
        print(f"Ollama model: {ollama_model}")
        print(f"Ollama URL: {ollama_url}")
        print(f"No-think: {no_think}")
    print(f"Dry run: {dry_run}")
    print()

    ts = datetime.now().strftime("%Y%m%d-%H%M%S")
    # Include exact model IDs in filename to prevent race conditions
    model_ids = []
    for m in models:
        if m == "openai": model_ids.append(openai_model)
        elif m == "mistral": model_ids.append(mistral_model)
        elif m == "deepseek": model_ids.append(deepseek_model)
        elif m == "ollama": model_ids.append(f"ollama-{ollama_model}")
        else: model_ids.append(m)
    model_suffix = "_".join(model_ids).replace(":", "-").replace("/", "-")
    out_file = RESULTS_DIR / f"pilot-{ts}_{model_suffix}.json"

    all_results = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "config": {
            "models": models,
            "openai_model": openai_model if "openai" in models else None,
            "mistral_model": mistral_model if "mistral" in models else None,
            "deepseek_model": deepseek_model if "deepseek" in models else None,
            "ollama_model": ollama_model if "ollama" in models else None,
            "ollama_url": ollama_url if "ollama" in models else None,
            "no_think": no_think if "ollama" in models else None,
            "temperature": TEMPERATURE,
        },
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
            call_fn = make_openai_caller(openai_model)
        elif model_name == "mistral":
            call_fn = make_mistral_caller(mistral_model)
        elif model_name == "deepseek":
            call_fn = make_deepseek_caller(deepseek_model)
        elif model_name == "ollama":
            call_fn = make_ollama_caller(ollama_model, no_think=no_think, base_url=ollama_url)
        else:
            print(f"Unknown model: {model_name}")
            continue

        # Count total questions for progress display
        total_q = 0
        for spec in specs:
            questions = spec.get("questions", {})
            if "recognition" in questions: total_q += 1
            if "application" in questions: total_q += 2  # anchor + paraphrase
            if "consistency" in questions:
                cons = questions["consistency"]
                total_q += len(cons.get("variants", []))
                if cons.get("language_variant"): total_q += 1

        print(f"=== {model_name.upper()} ({total_q} questions) ===")
        model_results = []
        all_results["models"][model_name] = model_results
        current_q = [0]

        def append_and_save(r):
            model_results.append(r)
            current_q[0] += 1
            if not dry_run:
                save_results(all_results, out_file)

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
                    print(f"  [{current_q[0]+1}/{total_q}] {anchor} / recognition...", end=" ", flush=True)
                    result = run_question(q, call_fn, f"{anchor}/recognition", verbose=verbose)
                    print(f"{result['score']:.0%}")
                    append_and_save(result)

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
                    print(f"  [{current_q[0]+1}/{total_q}] {anchor} / application (anchor)...", end=" ", flush=True)
                    result_a = run_question(anchor_q, call_fn, f"{anchor}/application-anchor", verbose=verbose)
                    print(f"{result_a['score']:.0%}")
                    append_and_save(result_a)

                    print(f"  [{current_q[0]+1}/{total_q}] {anchor} / application (paraphrase)...", end=" ", flush=True)
                    result_p = run_question(para_q, call_fn, f"{anchor}/application-paraphrase", verbose=verbose)
                    print(f"{result_p['score']:.0%}")
                    append_and_save(result_p)

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
                        print(f"  [{current_q[0]+1}/{total_q}] {anchor} / consistency ({variant_label})...", end=" ", flush=True)
                        result = run_question(variant_q, call_fn, f"{anchor}/consistency-{variant_label}", verbose=verbose)
                        print(f"{result['score']:.0%}")
                        append_and_save(result)

        all_results["models"][model_name] = model_results

    elapsed = time.time() - start_time
    all_results["duration_seconds"] = round(elapsed, 1)

    if not dry_run:
        save_results(all_results, out_file)
        print(f"\nResults saved to {out_file}")

        # Also save a stripped summary (scores only, no raw responses)
        summary_dir = RESULTS_DIR.parent / "summaries"
        summary_dir.mkdir(parents=True, exist_ok=True)
        summary = json.loads(json.dumps(all_results))  # deep copy
        for m_results in summary.get("models", {}).values():
            for r in m_results:
                r.pop("results", None)
        summary_file = summary_dir / out_file.name
        with open(summary_file, "w", encoding="utf-8") as fh:
            json.dump(summary, fh, indent=2, ensure_ascii=False)
        print(f"Summary saved to {summary_file}")

        # Summary
        print("\n=== SUMMARY ===")
        print(f"Models: {', '.join(models)}")
        print(f"Temperature: {TEMPERATURE}")
        if "openai" in models:
            print(f"OpenAI: {openai_model}")
        if "mistral" in models:
            print(f"Mistral: {mistral_model}")
        if "deepseek" in models:
            print(f"DeepSeek: {deepseek_model}")
        if "ollama" in models:
            print(f"Ollama: {ollama_model} @ {ollama_url} (no-think={no_think})")
        minutes, seconds = divmod(int(elapsed), 60)
        print(f"Duration: {minutes}m {seconds}s")
        print()
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
                        choices=["claude", "claude-cli", "claude-haiku", "openai", "mistral", "deepseek", "ollama"],
                        help="Models to evaluate (default: claude-cli)")
    parser.add_argument("--openai-model", default="gpt-4o-mini",
                        help="OpenAI model name (default: gpt-4o-mini). Try: gpt-5, gpt-5-mini, gpt-4o")
    parser.add_argument("--mistral-model", default="mistral-large-latest",
                        help="Mistral model name (default: mistral-large-latest)")
    parser.add_argument("--deepseek-model", default="deepseek-chat",
                        help="DeepSeek model name (default: deepseek-chat)")
    parser.add_argument("--ollama-model", default="qwen3:4b",
                        help="Ollama model name (default: qwen3:4b)")
    parser.add_argument("--ollama-url", default="http://localhost:11434",
                        help="Ollama API base URL (default: http://localhost:11434)")
    parser.add_argument("--temperature", type=float, default=0.0,
                        help="Sampling temperature (default: 0.0). Note: claude-cli/claude-haiku ignore this.")
    parser.add_argument("--no-think", action="store_true",
                        help="Disable reasoning/thinking for Ollama models (faster, fewer tokens)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show prompts without sending")
    parser.add_argument("--verbose", action="store_true",
                        help="Print raw responses for debugging")
    args = parser.parse_args()
    set_temperature(args.temperature)
    run_pilot(args.model, args.dry_run, args.verbose, args.ollama_model, args.no_think,
              args.ollama_url, args.openai_model, args.mistral_model, args.deepseek_model)
