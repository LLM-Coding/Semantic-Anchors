#!/usr/bin/env python3
"""
Generate an HTML report from evaluation results.

Reads all result JSON files and produces an interactive HTML report with:
- Summary table (model × average score)
- Heatmap (anchor × model)
- Detail sections per anchor with raw responses
- Controls (sanity check, negative control) shown separately

Usage:
  python3 evaluations/generate-report.py
  python3 evaluations/generate-report.py --output evaluations/report.html
"""

import argparse
from html import escape as h
import json
from collections import defaultdict
from pathlib import Path

RESULTS_DIR = Path(__file__).parent / "summaries"
SPECS_DIR = Path(__file__).parent / "specs"

# Fallback display names (used when config doesn't have exact model ID)
MODEL_DISPLAY_FALLBACK = {
    "claude": "Claude Sonnet",
    "claude-cli": "Claude Sonnet (CLI)",
    "claude-haiku": "Claude Haiku",
    "openai": "GPT-4o",
    "mistral": "Mistral",
    "ollama": "Ollama (local)",
}


def get_model_display(backend, config):
    """Get exact model display name from config."""
    if backend == "openai" and config.get("openai_model"):
        return config["openai_model"]
    if backend == "mistral" and config.get("mistral_model"):
        return config["mistral_model"]
    if backend == "deepseek" and config.get("deepseek_model"):
        return config["deepseek_model"]
    if backend == "ollama" and config.get("ollama_model"):
        return f"ollama/{config['ollama_model']}"
    if backend == "claude":
        return "claude-sonnet-4-20250514"
    if backend == "claude-cli":
        return "claude-sonnet-4 (CLI)"
    if backend == "claude-haiku":
        return "claude-haiku-4-5"
    return MODEL_DISPLAY_FALLBACK.get(backend, backend)

CONTROL_ANCHORS = {"sanity-check", "negative-control"}


def load_best_results():
    """Load the latest result per unique model identifier."""
    results = {}
    for f in sorted(RESULTS_DIR.glob("pilot-*.json")):
        d = json.load(open(f, encoding="utf-8"))
        config = d.get("config", {})
        for m, r in d["models"].items():
            # Use exact model ID as key instead of backend alias
            exact_id = get_model_display(m, config)
            if exact_id not in results or len(r) >= len(results[exact_id]["data"]):
                results[exact_id] = {
                    "data": r,
                    "file": f.name,
                    "config": config,
                    "duration": d.get("duration_seconds", 0),
                    "timestamp": d.get("timestamp", ""),
                    "backend": m,
                }
    return results


def score_color(score):
    if score >= 0.8:
        return "#22c55e"  # green
    elif score >= 0.5:
        return "#eab308"  # yellow
    else:
        return "#ef4444"  # red


def score_bg(score):
    if score >= 0.8:
        return "#dcfce7"
    elif score >= 0.5:
        return "#fef9c3"
    else:
        return "#fee2e2"


def generate_html(results, output_path):
    # Keys are already exact model IDs (e.g. "mistral-large-2512")
    display_names = {m: m for m in results}

    # Collect all anchors and questions
    all_questions = defaultdict(dict)  # anchor/label -> {model: score}

    # Sort models: most questions first, then alphabetically
    model_names = sorted(results.keys(),
                         key=lambda m: (-len(results[m]["data"]), m))

    for m in model_names:
        for q in results[m]["data"]:
            label = q["label"]
            all_questions[label][m] = q["score"]

    # Separate controls from anchors
    anchor_questions = {k: v for k, v in all_questions.items()
                        if not any(k.startswith(c) for c in CONTROL_ANCHORS)}
    control_questions = {k: v for k, v in all_questions.items()
                         if any(k.startswith(c) for c in CONTROL_ANCHORS)}

    # Group by anchor
    anchor_groups = defaultdict(list)
    for label in sorted(anchor_questions.keys()):
        anchor_id = label.split("/")[0]
        anchor_groups[anchor_id].append(label)

    # Model averages (excluding controls)
    model_avgs = {}
    for m in model_names:
        scores = [anchor_questions[label].get(m) for label in anchor_questions
                  if anchor_questions[label].get(m) is not None]
        model_avgs[m] = sum(scores) / len(scores) if scores else 0

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Semantic Anchor Evaluation Report</title>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #1e293b; padding: 2rem; }}
  h1 {{ font-size: 1.75rem; margin-bottom: 0.5rem; }}
  h2 {{ font-size: 1.25rem; margin: 2rem 0 1rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }}
  h3 {{ font-size: 1rem; margin: 1.5rem 0 0.5rem; color: #475569; }}
  .subtitle {{ color: #64748b; margin-bottom: 2rem; }}
  .summary-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }}
  .summary-card {{ background: white; border-radius: 0.5rem; padding: 1.25rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }}
  .summary-card .model-name {{ font-weight: 600; font-size: 0.875rem; color: #475569; }}
  .summary-card .score {{ font-size: 2rem; font-weight: 700; margin: 0.5rem 0; }}
  .summary-card .detail {{ font-size: 0.75rem; color: #94a3b8; }}
  table {{ width: 100%; border-collapse: collapse; background: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 1.5rem; }}
  th {{ background: #f1f5f9; padding: 0.625rem 0.75rem; text-align: left; font-weight: 600; font-size: 0.8125rem; color: #475569; border-bottom: 2px solid #e2e8f0; }}
  td {{ padding: 0.5rem 0.75rem; border-bottom: 1px solid #f1f5f9; font-size: 0.8125rem; }}
  tr:hover {{ background: #f8fafc; }}
  .score-cell {{ text-align: center; font-weight: 600; border-radius: 0.25rem; }}
  .anchor-group {{ font-weight: 600; background: #f8fafc; }}
  .question-label {{ padding-left: 1.5rem; color: #64748b; }}
  .check {{ color: #22c55e; }}
  .controls {{ opacity: 0.7; }}
  .legend {{ display: flex; gap: 1.5rem; margin: 1rem 0; font-size: 0.8125rem; }}
  .legend-item {{ display: flex; align-items: center; gap: 0.375rem; }}
  .legend-dot {{ width: 12px; height: 12px; border-radius: 2px; }}
  .meta {{ background: #f1f5f9; border-radius: 0.5rem; padding: 1rem; font-size: 0.75rem; color: #64748b; margin-top: 2rem; }}
  .meta dt {{ font-weight: 600; display: inline; }}
  .meta dd {{ display: inline; margin-right: 1.5rem; }}
  .fail-list {{ margin-top: 1rem; }}
  .fail-item {{ display: flex; justify-content: space-between; padding: 0.25rem 0; font-size: 0.8125rem; border-bottom: 1px solid #f1f5f9; }}
</style>
</head>
<body>
<h1>Semantic Anchor Evaluation Report</h1>
<p class="subtitle">Multiple-choice recognition test across {len(model_names)} LLMs — {len(anchor_questions)} questions, {len(anchor_groups)} anchors</p>

<div class="legend">
  <div class="legend-item"><div class="legend-dot" style="background:#dcfce7"></div> &ge;80%</div>
  <div class="legend-item"><div class="legend-dot" style="background:#fef9c3"></div> 50–79%</div>
  <div class="legend-item"><div class="legend-dot" style="background:#fee2e2"></div> &lt;50%</div>
</div>

<h2>Model Summary</h2>
<div class="summary-grid">
"""

    for m in model_names:
        avg = model_avgs.get(m, 0)
        display = display_names.get(m, m)
        n = len([1 for l in anchor_questions if anchor_questions[l].get(m) is not None])
        info = results[m]
        html += f"""  <div class="summary-card">
    <div class="model-name">{display}</div>
    <div class="score" style="color: {score_color(avg)}">{avg:.0%}</div>
    <div class="detail">{n} questions · {info['file']}</div>
  </div>
"""

    html += """</div>

<h2>Heatmap: Anchor × Model</h2>
<table>
<thead><tr>
  <th>Anchor / Question</th>
"""

    for m in model_names:
        html += f"  <th style='text-align:center'>{display_names.get(m, m)}</th>\n"
    html += "</tr></thead>\n<tbody>\n"

    for anchor_id in sorted(anchor_groups.keys()):
        labels = anchor_groups[anchor_id]
        # Anchor group row with average
        anchor_scores = {}
        for m in model_names:
            scores = [anchor_questions[l].get(m) for l in labels if anchor_questions[l].get(m) is not None]
            anchor_scores[m] = sum(scores) / len(scores) if scores else None

        html += f'<tr class="anchor-group"><td>{h(anchor_id)}</td>'
        for m in model_names:
            s = anchor_scores.get(m)
            if s is not None:
                bg = score_bg(s)
                text = "✓" if s == 1.0 else f"{s:.0%}"
                html += f'<td class="score-cell" style="background:{bg}">{text}</td>'
            else:
                html += '<td class="score-cell" style="color:#cbd5e1">—</td>'
        html += "</tr>\n"

        # Individual question rows (only show if there are multiple or if score < 100%)
        if len(labels) > 1:
            for label in labels:
                short = label.split("/", 1)[1] if "/" in label else label
                html += f'<tr><td class="question-label">{h(short)}</td>'
                for m in model_names:
                    s = anchor_questions[label].get(m)
                    if s is not None:
                        bg = score_bg(s)
                        text = "✓" if s == 1.0 else f"{s:.0%}"
                        html += f'<td class="score-cell" style="background:{bg}">{text}</td>'
                    else:
                        html += '<td class="score-cell" style="color:#cbd5e1">—</td>'
                html += "</tr>\n"

    html += "</tbody></table>\n"

    # Controls section
    if control_questions:
        html += '<h2>Control Questions</h2>\n<table class="controls">\n<thead><tr><th>Control</th>'
        for m in model_names:
            html += f"<th style='text-align:center'>{display_names.get(m, m)}</th>"
        html += "</tr></thead>\n<tbody>\n"
        for label in sorted(control_questions.keys()):
            short = label.replace("/recognition", "")
            html += f"<tr><td>{short}</td>"
            for m in model_names:
                s = control_questions[label].get(m)
                if s is not None:
                    bg = score_bg(s) if "sanity" not in label else ("#dcfce7" if s == 0 else "#fee2e2")
                    text = f"{s:.0%}"
                    html += f'<td class="score-cell" style="background:{bg}">{text}</td>'
                else:
                    html += '<td class="score-cell" style="color:#cbd5e1">—</td>'
            html += "</tr>\n"
        html += "</tbody></table>\n"

    # Failures detail
    html += "<h2>Failures Detail</h2>\n"
    for m in model_names:
        fails = [(q["label"], q["score"]) for q in results[m]["data"]
                 if q["score"] < 1.0 and not any(q["label"].startswith(c) for c in CONTROL_ANCHORS)]
        if not fails:
            html += f"<h3>{display_names.get(m, m)}: no failures</h3>\n"
        else:
            html += f'<h3>{display_names.get(m, m)}: {len(fails)} failures</h3>\n<div class="fail-list">\n'
            for label, score in sorted(fails):
                html += f'<div class="fail-item"><span>{h(label)}</span><span style="color:{score_color(score)};font-weight:600">{score:.0%}</span></div>\n'
            html += "</div>\n"

    # Metadata
    html += """
<div class="meta">
<h3>Run Metadata</h3>
<dl>
"""
    for m in model_names:
        info = results[m]
        dur = info["duration"]
        html += f"<dt>{display_names.get(m, m)}:</dt><dd>{info['file']} · {int(dur//60)}m {int(dur%60)}s · {info['timestamp'][:19]}</dd><br>"

    html += """
</dl>
<p style="margin-top:0.75rem">Generated by <code>evaluations/generate-report.py</code> · Position bias mitigation: 4 permutations per question · Scoring: deterministic MC (no LLM judge)</p>
</div>

</body>
</html>"""

    output_path.write_text(html, encoding="utf-8")
    print(f"Report written to {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate HTML evaluation report")
    parser.add_argument("--output", default="evaluations/report.html",
                        help="Output HTML file (default: evaluations/report.html)")
    args = parser.parse_args()

    results = load_best_results()
    print(f"Loaded results for {len(results)} models")
    for m, info in results.items():
        print(f"  {m}: {len(info['data'])} questions from {info['file']}")

    generate_html(results, Path(args.output))


if __name__ == "__main__":
    main()
