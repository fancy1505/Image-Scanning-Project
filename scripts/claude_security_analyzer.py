"""
ScanGuard AI - Claude Security Analyzer
Sprint 3: Generative AI security analysis

Input:
    reports/ai-analysis.json

Output:
    reports/ai-llm-analysis.json

The deterministic Sprint 2 engine remains the source of truth.
Claude adds:
- Executive narrative
- Release decision explanation
- Prioritized remediation plan
- Management summary
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from anthropic import Anthropic, APIConnectionError, APIStatusError


PROJECT_ROOT = Path(__file__).resolve().parent.parent
INPUT_FILE = PROJECT_ROOT / "reports" / "ai-analysis.json"
OUTPUT_FILE = PROJECT_ROOT / "reports" / "ai-llm-analysis.json"

DEFAULT_MODEL = os.getenv(
    "ANTHROPIC_MODEL",
    "claude-sonnet-4-5",
)


def load_json(path: Path) -> dict[str, Any]:
    """Load a JSON file and validate its structure."""

    if not path.exists():
        raise FileNotFoundError(
            f"Required input file was not found: {path}"
        )

    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    if not isinstance(data, dict):
        raise ValueError(
            f"Expected a JSON object in {path.name}."
        )

    return data


def build_security_context(
    analysis: dict[str, Any],
) -> dict[str, Any]:
    """
    Build a compact context object.

    This avoids sending unnecessarily large raw Trivy reports
    to the model and helps control token usage.
    """

    return {
        "security_score": analysis.get("security_score"),
        "risk_level": analysis.get("risk_level"),
        "release_readiness": analysis.get(
            "release_readiness"
        ),
        "release_reasons": analysis.get(
            "release_reasons",
            [],
        ),
        "executive_summary": analysis.get(
            "executive_summary"
        ),
        "business_impact": analysis.get(
            "business_impact"
        ),
        "security_trend": analysis.get(
            "security_trend",
            {},
        ),
        "vulnerability_summary": analysis.get(
            "vulnerability_summary",
            {},
        ),
        "component_analysis": analysis.get(
            "component_analysis",
            [],
        ),
        "recommendations": analysis.get(
            "recommendations",
            [],
        ),
        "top_findings": analysis.get(
            "top_findings",
            [],
        )[:10],
        "reports": analysis.get(
            "reports",
            {},
        ),
    }


def build_prompt(
    security_context: dict[str, Any],
) -> str:
    """Create the security analysis prompt."""

    context_json = json.dumps(
        security_context,
        indent=2,
        ensure_ascii=False,
    )

    return f"""
You are ScanGuard AI, a senior DevSecOps security advisor.

Analyze the supplied deterministic security assessment.

Important rules:
1. Treat the supplied JSON as the source of truth.
2. Do not invent CVEs, packages, versions, findings, or scan results.
3. Do not change the deterministic release decision.
4. Explain risk in plain professional language.
5. Prioritize actions that have an available fixed version.
6. Clearly distinguish facts from recommendations.
7. Return valid JSON only, without markdown fences.

Return exactly this JSON structure:

{{
  "executive_summary": "Three to five sentences for technical and management readers.",
  "release_explanation": "Explain why the deterministic release decision was reached.",
  "management_summary": "Two to three sentences focused on business risk.",
  "remediation_plan": [
    {{
      "priority": 1,
      "severity": "CRITICAL, HIGH, MEDIUM, LOW, or INFO",
      "action": "Specific recommended action.",
      "reason": "Why the action matters.",
      "affected_components": ["component names"],
      "related_findings": ["CVE identifiers where available"]
    }}
  ],
  "positive_observations": [
    "Verified positive observations from the supplied data."
  ],
  "questions_for_security_review": [
    "Questions requiring human review or risk acceptance."
  ]
}}

Deterministic security assessment:

{context_json}
""".strip()


def parse_model_json(text: str) -> dict[str, Any]:
    """Parse and validate the model response."""

    cleaned = text.strip()

    if cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```json")
        cleaned = cleaned.removeprefix("```")
        cleaned = cleaned.removesuffix("```")
        cleaned = cleaned.strip()

    result = json.loads(cleaned)

    if not isinstance(result, dict):
        raise ValueError(
            "Claude returned JSON that was not an object."
        )

    required_fields = {
        "executive_summary",
        "release_explanation",
        "management_summary",
        "remediation_plan",
        "positive_observations",
        "questions_for_security_review",
    }

    missing_fields = required_fields.difference(
        result.keys()
    )

    if missing_fields:
        raise ValueError(
            "Claude response is missing required fields: "
            + ", ".join(sorted(missing_fields))
        )

    return result


def create_fallback_output(
    deterministic_analysis: dict[str, Any],
    error_message: str,
) -> dict[str, Any]:
    """Create a safe fallback when Claude is unavailable."""

    recommendations = deterministic_analysis.get(
        "recommendations",
        [],
    )

    fallback_plan = []

    for index, recommendation in enumerate(
        recommendations[:8],
        start=1,
    ):
        fallback_plan.append({
            "priority": index,
            "severity": recommendation.get(
                "priority",
                "INFO",
            ),
            "action": recommendation.get(
                "action",
                "Review the security finding.",
            ),
            "reason": recommendation.get(
                "reason",
                "Generated by the deterministic fallback engine.",
            ),
            "affected_components": recommendation.get(
                "affected_items",
                [],
            ),
            "related_findings": recommendation.get(
                "affected_items",
                [],
            ),
        })

    return {
        "analysis_version": "3.0.0",
        "provider": "deterministic-fallback",
        "model": None,
        "generated_at": datetime.now(
            timezone.utc
        ).isoformat(),
        "llm_enabled": False,
        "llm_error": error_message,
        "deterministic_security_score": (
            deterministic_analysis.get("security_score")
        ),
        "deterministic_risk_level": (
            deterministic_analysis.get("risk_level")
        ),
        "deterministic_release_readiness": (
            deterministic_analysis.get(
                "release_readiness"
            )
        ),
        "executive_summary": (
            deterministic_analysis.get(
                "executive_summary",
                "Security analysis is available from the "
                "deterministic engine.",
            )
        ),
        "release_explanation": " ".join(
            deterministic_analysis.get(
                "release_reasons",
                [],
            )
        ),
        "management_summary": (
            deterministic_analysis.get(
                "business_impact",
                "Business impact requires security review.",
            )
        ),
        "remediation_plan": fallback_plan,
        "positive_observations": [
            "The deterministic security engine completed successfully."
        ],
        "questions_for_security_review": [
            "Review unresolved findings and confirm formal risk acceptance."
        ],
    }


def call_claude(
    deterministic_analysis: dict[str, Any],
) -> dict[str, Any]:
    """Send the deterministic analysis to Claude."""

    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        raise RuntimeError(
            "ANTHROPIC_API_KEY is not configured."
        )

    client = Anthropic(
        api_key=api_key,
        max_retries=2,
        timeout=60.0,
    )

    security_context = build_security_context(
        deterministic_analysis
    )

    prompt = build_prompt(security_context)

    response = client.messages.create(
        model=DEFAULT_MODEL,
        max_tokens=2200,
        temperature=0.1,
        system=(
            "You are a precise DevSecOps security advisor. "
            "Use only the supplied security evidence. "
            "Return valid JSON only."
        ),
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    text_blocks = [
        block.text
        for block in response.content
        if getattr(block, "type", None) == "text"
    ]

    if not text_blocks:
        raise ValueError(
            "Claude returned no text content."
        )

    model_analysis = parse_model_json(
        "\n".join(text_blocks)
    )

    return {
        "analysis_version": "3.0.0",
        "provider": "anthropic",
        "model": response.model,
        "generated_at": datetime.now(
            timezone.utc
        ).isoformat(),
        "llm_enabled": True,
        "usage": {
            "input_tokens": response.usage.input_tokens,
            "output_tokens": response.usage.output_tokens,
        },
        "deterministic_security_score": (
            deterministic_analysis.get("security_score")
        ),
        "deterministic_risk_level": (
            deterministic_analysis.get("risk_level")
        ),
        "deterministic_release_readiness": (
            deterministic_analysis.get(
                "release_readiness"
            )
        ),
        **model_analysis,
    }


def main() -> int:
    """Run the Sprint 3 Claude analysis."""

    print("")
    print("ScanGuard AI - Sprint 3 Claude Analyzer")
    print("========================================")

    try:
        deterministic_analysis = load_json(
            INPUT_FILE
        )

    except (
        FileNotFoundError,
        ValueError,
        json.JSONDecodeError,
        OSError,
    ) as error:
        print(f"[ERROR] {error}")
        return 1

    try:
        output = call_claude(
            deterministic_analysis
        )

        print("[OK] Claude analysis completed.")
        print(
            f"[OK] Model: {output['model']}"
        )

    except (
        RuntimeError,
        APIConnectionError,
        APIStatusError,
        ValueError,
        json.JSONDecodeError,
    ) as error:
        print(
            f"[WARNING] Claude analysis unavailable: {error}"
        )
        print(
            "[INFO] Using deterministic fallback output."
        )

        output = create_fallback_output(
            deterministic_analysis,
            str(error),
        )

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    try:
        with OUTPUT_FILE.open(
            "w",
            encoding="utf-8",
        ) as output_file:
            json.dump(
                output,
                output_file,
                indent=2,
                ensure_ascii=False,
            )

    except OSError as error:
        print(
            f"[ERROR] Could not write output: {error}"
        )
        return 1

    print(
        f"[OK] Output created: {OUTPUT_FILE}"
    )
    print(
        f"[OK] LLM enabled: {output['llm_enabled']}"
    )
    print("")

    return 0


if __name__ == "__main__":
    sys.exit(main())