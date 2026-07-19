"""
ScanGuard AI - Security Analyzer
Sprint 2: Security Decision and Recommendation Engine

This script reads Trivy JSON reports and generates:

- Vulnerability counts by severity
- Security score
- Risk level
- Release readiness decision
- Executive security summary
- Business impact explanation
- Prioritized remediation recommendations
- Component risk summary
- Top security findings
- Security trend
- JSON output for the ScanGuard React dashboard

Output:
    reports/ai-analysis.json
"""

from __future__ import annotations

import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


# ============================================================
# Project configuration
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parent.parent
REPORTS_DIRECTORY = PROJECT_ROOT / "reports"
OUTPUT_FILE = REPORTS_DIRECTORY / "ai-analysis.json"

SEVERITIES = (
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "LOW",
    "UNKNOWN",
)

SEVERITY_ORDER = {
    "CRITICAL": 0,
    "HIGH": 1,
    "MEDIUM": 2,
    "LOW": 3,
    "UNKNOWN": 4,
}

EXPECTED_REPORTS = {
    "backend": [
        PROJECT_ROOT / "backend-report.json",
        REPORTS_DIRECTORY / "shopnow-backend_v1.json",
    ],
    "frontend": [
        PROJECT_ROOT / "frontend-report.json",
        REPORTS_DIRECTORY / "shopnow-frontend_v1.json",
    ],
    "admin": [
        PROJECT_ROOT / "admin-report.json",
        REPORTS_DIRECTORY / "shopnow-admin_v1.json",
    ],
    "filesystem": [
        PROJECT_ROOT / "trivy-fs-report.json",
        REPORTS_DIRECTORY / "trivy-fs-report.json",
    ],
}


# ============================================================
# Basic helpers
# ============================================================

def empty_severity_counts() -> dict[str, int]:
    """Return a new empty severity counter."""

    return {
        severity: 0
        for severity in SEVERITIES
    }


def find_report_file(candidate_paths: list[Path]) -> Path | None:
    """
    Return the first existing report path.

    This supports both:
    - GitHub Actions reports generated in the project root
    - Existing local reports stored inside reports/
    """

    for path in candidate_paths:
        if path.exists() and path.is_file():
            return path

    return None


def load_json_file(file_path: Path) -> dict[str, Any] | None:
    """Load a JSON file safely."""

    try:
        with file_path.open("r", encoding="utf-8") as report_file:
            data = json.load(report_file)

        if not isinstance(data, dict):
            print(
                f"[WARNING] Invalid JSON structure in "
                f"{file_path.name}"
            )
            return None

        print(f"[OK] Loaded report: {file_path}")
        return data

    except json.JSONDecodeError as error:
        print(
            f"[WARNING] Invalid JSON in {file_path.name}: "
            f"{error}"
        )
        return None

    except OSError as error:
        print(
            f"[WARNING] Could not read {file_path.name}: "
            f"{error}"
        )
        return None


# ============================================================
# Trivy report processing
# ============================================================

def extract_vulnerabilities(
    report: dict[str, Any] | None,
    component_name: str,
) -> list[dict[str, Any]]:
    """Extract vulnerability objects from a Trivy report."""

    vulnerabilities: list[dict[str, Any]] = []

    if report is None:
        return vulnerabilities

    results = report.get("Results", [])

    if not isinstance(results, list):
        return vulnerabilities

    for result in results:
        if not isinstance(result, dict):
            continue

        result_target = str(
            result.get("Target", component_name)
        )

        result_type = str(
            result.get("Type", "unknown")
        )

        report_vulnerabilities = result.get(
            "Vulnerabilities",
            [],
        )

        if not isinstance(report_vulnerabilities, list):
            continue

        for vulnerability in report_vulnerabilities:
            if not isinstance(vulnerability, dict):
                continue

            enriched_vulnerability = dict(vulnerability)
            enriched_vulnerability["_component"] = component_name
            enriched_vulnerability["_target"] = result_target
            enriched_vulnerability["_type"] = result_type

            vulnerabilities.append(enriched_vulnerability)

    return vulnerabilities


def count_vulnerabilities(
    vulnerabilities: list[dict[str, Any]],
) -> dict[str, int]:
    """Count vulnerability findings by severity."""

    counts = empty_severity_counts()

    for vulnerability in vulnerabilities:
        severity = str(
            vulnerability.get("Severity", "UNKNOWN")
        ).upper()

        if severity not in counts:
            severity = "UNKNOWN"

        counts[severity] += 1

    return counts


def aggregate_counts(
    component_counts: dict[str, dict[str, int]],
) -> dict[str, int]:
    """Combine all component severity counts."""

    totals = empty_severity_counts()

    for counts in component_counts.values():
        for severity in SEVERITIES:
            totals[severity] += counts.get(severity, 0)

    return totals


# ============================================================
# Security score
# ============================================================

def calculate_security_score(
    counts: dict[str, int],
    loaded_report_count: int,
    expected_report_count: int,
) -> tuple[int, list[dict[str, Any]]]:
    """
    Calculate an explainable security score between 0 and 100.

    The penalties are capped to avoid one severity category
    making the score calculation impossible to interpret.
    """

    score = 100
    breakdown: list[dict[str, Any]] = []

    critical_penalty = min(
        counts["CRITICAL"] * 15,
        60,
    )

    high_penalty = min(
        counts["HIGH"] * 5,
        35,
    )

    medium_penalty = min(
        counts["MEDIUM"] * 2,
        20,
    )

    low_penalty = min(
        counts["LOW"],
        10,
    )

    if counts["CRITICAL"] > 0:
        score -= critical_penalty
        breakdown.append({
            "category": "Critical vulnerabilities",
            "finding_count": counts["CRITICAL"],
            "score_change": -critical_penalty,
            "explanation": (
                "Critical vulnerabilities represent an immediate "
                "risk and require remediation before release."
            ),
        })
    else:
        breakdown.append({
            "category": "Critical vulnerabilities",
            "finding_count": 0,
            "score_change": 0,
            "explanation": (
                "No Critical vulnerabilities were detected."
            ),
        })

    if counts["HIGH"] > 0:
        score -= high_penalty
        breakdown.append({
            "category": "High vulnerabilities",
            "finding_count": counts["HIGH"],
            "score_change": -high_penalty,
            "explanation": (
                "High-severity vulnerabilities increase the risk "
                "of exploitation in production."
            ),
        })
    else:
        breakdown.append({
            "category": "High vulnerabilities",
            "finding_count": 0,
            "score_change": 0,
            "explanation": (
                "No High vulnerabilities were detected."
            ),
        })

    if counts["MEDIUM"] > 0:
        score -= medium_penalty
        breakdown.append({
            "category": "Medium vulnerabilities",
            "finding_count": counts["MEDIUM"],
            "score_change": -medium_penalty,
            "explanation": (
                "Medium vulnerabilities should be included in the "
                "current remediation backlog."
            ),
        })

    if counts["LOW"] > 0:
        score -= low_penalty
        breakdown.append({
            "category": "Low vulnerabilities",
            "finding_count": counts["LOW"],
            "score_change": -low_penalty,
            "explanation": (
                "Low vulnerabilities should be reviewed during "
                "normal maintenance cycles."
            ),
        })

    if loaded_report_count == expected_report_count:
        score += 5
        breakdown.append({
            "category": "Security scan coverage",
            "finding_count": loaded_report_count,
            "score_change": 5,
            "explanation": (
                "All expected security reports were available."
            ),
        })
    else:
        missing_count = (
            expected_report_count - loaded_report_count
        )

        coverage_penalty = missing_count * 5
        score -= coverage_penalty

        breakdown.append({
            "category": "Security scan coverage",
            "finding_count": loaded_report_count,
            "score_change": -coverage_penalty,
            "explanation": (
                f"{missing_count} expected security report(s) "
                "were missing."
            ),
        })

    score = max(0, min(100, score))

    return score, breakdown


# ============================================================
# Risk and release decisions
# ============================================================

def determine_risk_level(
    score: int,
    counts: dict[str, int],
) -> str:
    """Determine the overall security risk level."""

    if counts["CRITICAL"] > 0:
        return "CRITICAL"

    if counts["HIGH"] >= 10:
        return "HIGH"

    if score < 40:
        return "HIGH"

    if counts["HIGH"] > 0:
        return "MEDIUM"

    if score < 70:
        return "MEDIUM"

    return "LOW"


def determine_release_readiness(
    counts: dict[str, int],
    missing_report_count: int,
) -> tuple[str, list[str]]:
    """Determine whether the release should proceed."""

    reasons: list[str] = []

    if missing_report_count > 0:
        reasons.append(
            f"{missing_report_count} expected security report(s) "
            "are missing."
        )

    if counts["CRITICAL"] > 0:
        reasons.append(
            f"{counts['CRITICAL']} Critical vulnerability "
            "finding(s) were detected."
        )

    if counts["HIGH"] >= 5:
        reasons.append(
            f"{counts['HIGH']} High vulnerability findings "
            "remain unresolved."
        )

    if (
        counts["CRITICAL"] > 0
        or counts["HIGH"] >= 5
        or missing_report_count > 0
    ):
        return "BLOCK RELEASE", reasons

    if counts["HIGH"] > 0:
        reasons.append(
            "High-severity vulnerabilities require security "
            "review and formal approval."
        )
        return "NEEDS REVIEW", reasons

    if counts["MEDIUM"] > 0:
        reasons.append(
            "Medium-severity vulnerabilities should be reviewed "
            "before production deployment."
        )
        return "NEEDS REVIEW", reasons

    reasons.append(
        "No Critical, High, or Medium vulnerabilities were found."
    )

    return "READY", reasons


# ============================================================
# Executive explanation
# ============================================================

def build_executive_summary(
    counts: dict[str, int],
    score: int,
    risk_level: str,
    release_readiness: str,
    loaded_report_count: int,
) -> str:
    """Generate an executive-level security summary."""

    total_findings = sum(counts.values())

    if total_findings == 0:
        return (
            f"ScanGuard analyzed {loaded_report_count} available "
            "security report(s) and detected no vulnerability "
            f"findings. The security score is {score}/100, the "
            f"overall risk level is {risk_level}, and the release "
            f"decision is {release_readiness}."
        )

    highest_risk_message = ""

    if counts["CRITICAL"] > 0:
        highest_risk_message = (
            "Critical vulnerabilities represent an immediate "
            "production risk. "
        )
    elif counts["HIGH"] > 0:
        highest_risk_message = (
            "High-severity vulnerabilities require prioritized "
            "remediation. "
        )
    elif counts["MEDIUM"] > 0:
        highest_risk_message = (
            "The environment contains Medium-severity findings "
            "that require review. "
        )

    return (
        f"ScanGuard analyzed {loaded_report_count} security "
        f"report(s) and identified {total_findings} vulnerability "
        f"findings: {counts['CRITICAL']} Critical, "
        f"{counts['HIGH']} High, {counts['MEDIUM']} Medium, "
        f"and {counts['LOW']} Low. "
        f"{highest_risk_message}"
        f"The calculated security score is {score}/100, the "
        f"overall risk level is {risk_level}, and the current "
        f"release decision is {release_readiness}."
    )


def determine_business_impact(
    counts: dict[str, int],
    release_readiness: str,
) -> str:
    """Explain the potential business impact."""

    if counts["CRITICAL"] > 0:
        return (
            "Critical vulnerabilities may allow attackers to "
            "compromise application services, access sensitive "
            "information, disrupt operations, or gain unauthorized "
            "control. Production deployment should remain blocked "
            "until the Critical findings are remediated."
        )

    if counts["HIGH"] > 0:
        return (
            "High-severity vulnerabilities increase the likelihood "
            "of successful attacks, service disruption, data "
            "exposure, or supply-chain compromise. The affected "
            "packages should be upgraded before production release."
        )

    if counts["MEDIUM"] > 0:
        return (
            "Medium-severity vulnerabilities create cumulative "
            "security risk and may become exploitable when combined "
            "with other weaknesses. They should be included in the "
            "current remediation plan."
        )

    if counts["LOW"] > 0:
        return (
            "Only Low-severity findings were detected. These findings "
            "have limited immediate business impact but should still "
            "be reviewed during scheduled maintenance."
        )

    if release_readiness == "READY":
        return (
            "No significant vulnerability-related business impact "
            "was identified in the available security reports."
        )

    return (
        "Security impact could not be fully determined because the "
        "required security reports were incomplete."
    )


# ============================================================
# Recommendation engine
# ============================================================

def get_fixable_findings(
    vulnerabilities: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Return vulnerabilities that have an available fixed version."""

    return [
        vulnerability
        for vulnerability in vulnerabilities
        if str(
            vulnerability.get("FixedVersion", "")
        ).strip()
    ]


def group_fixable_packages(
    vulnerabilities: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Group fixable vulnerabilities by package."""

    package_map: dict[str, dict[str, Any]] = {}

    for vulnerability in vulnerabilities:
        fixed_version = str(
            vulnerability.get("FixedVersion", "")
        ).strip()

        if not fixed_version:
            continue

        package_name = str(
            vulnerability.get("PkgName", "unknown")
        )

        severity = str(
            vulnerability.get("Severity", "UNKNOWN")
        ).upper()

        vulnerability_id = str(
            vulnerability.get(
                "VulnerabilityID",
                "UNKNOWN",
            )
        )

        component = str(
            vulnerability.get("_component", "unknown")
        )

        if package_name not in package_map:
            package_map[package_name] = {
                "package": package_name,
                "fixed_versions": set(),
                "vulnerability_ids": set(),
                "components": set(),
                "highest_severity": severity,
                "finding_count": 0,
            }

        package_data = package_map[package_name]
        package_data["fixed_versions"].add(fixed_version)
        package_data["vulnerability_ids"].add(
            vulnerability_id
        )
        package_data["components"].add(component)
        package_data["finding_count"] += 1

        current_severity = package_data[
            "highest_severity"
        ]

        if (
            SEVERITY_ORDER.get(severity, 5)
            < SEVERITY_ORDER.get(current_severity, 5)
        ):
            package_data["highest_severity"] = severity

    grouped_packages: list[dict[str, Any]] = []

    for package_data in package_map.values():
        grouped_packages.append({
            "package": package_data["package"],
            "highest_severity": package_data[
                "highest_severity"
            ],
            "finding_count": package_data[
                "finding_count"
            ],
            "fixed_versions": sorted(
                package_data["fixed_versions"]
            ),
            "vulnerability_ids": sorted(
                package_data["vulnerability_ids"]
            ),
            "components": sorted(
                package_data["components"]
            ),
        })

    grouped_packages.sort(
        key=lambda item: (
            SEVERITY_ORDER.get(
                item["highest_severity"],
                5,
            ),
            -item["finding_count"],
            item["package"],
        )
    )

    return grouped_packages


def generate_recommendations(
    counts: dict[str, int],
    vulnerabilities: list[dict[str, Any]],
    missing_reports: list[str],
    limit: int = 8,
) -> list[dict[str, Any]]:
    """Generate prioritized remediation recommendations."""

    recommendations: list[dict[str, Any]] = []

    if missing_reports:
        recommendations.append({
            "priority": "CRITICAL",
            "category": "Scan coverage",
            "action": (
                "Restore the missing security scans before making "
                "a production release decision."
            ),
            "reason": (
                "The security assessment is incomplete because "
                f"{len(missing_reports)} expected report(s) "
                "were unavailable."
            ),
            "affected_items": missing_reports,
        })

    if counts["CRITICAL"] > 0:
        recommendations.append({
            "priority": "CRITICAL",
            "category": "Critical remediation",
            "action": (
                "Remediate all Critical vulnerabilities and rebuild "
                "the affected container images."
            ),
            "reason": (
                f"{counts['CRITICAL']} Critical finding(s) can "
                "represent an immediate production security risk."
            ),
            "affected_items": [],
        })

    grouped_packages = group_fixable_packages(
        vulnerabilities
    )

    for package_data in grouped_packages:
        if len(recommendations) >= limit:
            break

        severity = package_data["highest_severity"]

        if severity not in {
            "CRITICAL",
            "HIGH",
            "MEDIUM",
        }:
            continue

        fixed_versions = ", ".join(
            package_data["fixed_versions"][:3]
        )

        components = ", ".join(
            package_data["components"]
        )

        recommendations.append({
            "priority": severity,
            "category": "Dependency upgrade",
            "action": (
                f"Upgrade package '{package_data['package']}' "
                f"to a fixed version such as {fixed_versions}."
            ),
            "reason": (
                f"The package is associated with "
                f"{package_data['finding_count']} vulnerability "
                f"finding(s) across: {components}."
            ),
            "affected_items": package_data[
                "vulnerability_ids"
            ][:10],
        })

    if (
        counts["MEDIUM"] > 0
        and len(recommendations) < limit
    ):
        recommendations.append({
            "priority": "MEDIUM",
            "category": "Remediation backlog",
            "action": (
                "Create remediation tickets for the remaining "
                "Medium-severity findings."
            ),
            "reason": (
                f"{counts['MEDIUM']} Medium findings remain in "
                "the scanned application."
            ),
            "affected_items": [],
        })

    if (
        counts["LOW"] > 0
        and len(recommendations) < limit
    ):
        recommendations.append({
            "priority": "LOW",
            "category": "Maintenance",
            "action": (
                "Review Low-severity findings during the next "
                "dependency maintenance cycle."
            ),
            "reason": (
                f"{counts['LOW']} Low findings were detected."
            ),
            "affected_items": [],
        })

    if not recommendations:
        recommendations.append({
            "priority": "INFO",
            "category": "Monitoring",
            "action": (
                "Continue scheduled vulnerability scanning and "
                "dependency monitoring."
            ),
            "reason": (
                "No immediate vulnerability remediation is required."
            ),
            "affected_items": [],
        })

    return recommendations[:limit]


# ============================================================
# Findings and component analysis
# ============================================================

def create_top_findings(
    vulnerabilities: list[dict[str, Any]],
    limit: int = 12,
) -> list[dict[str, Any]]:
    """Return the most important unique findings."""

    unique_findings: dict[
        tuple[str, str, str],
        dict[str, Any],
    ] = {}

    for vulnerability in vulnerabilities:
        vulnerability_id = str(
            vulnerability.get(
                "VulnerabilityID",
                "UNKNOWN",
            )
        )

        package_name = str(
            vulnerability.get(
                "PkgName",
                "unknown",
            )
        )

        component = str(
            vulnerability.get(
                "_component",
                "unknown",
            )
        )

        severity = str(
            vulnerability.get(
                "Severity",
                "UNKNOWN",
            )
        ).upper()

        installed_version = str(
            vulnerability.get(
                "InstalledVersion",
                "unknown",
            )
        )

        fixed_version = str(
            vulnerability.get(
                "FixedVersion",
                "",
            )
        ).strip()

        title = str(
            vulnerability.get(
                "Title",
                "",
            )
        ).strip()

        finding_key = (
            vulnerability_id,
            package_name,
            component,
        )

        if finding_key in unique_findings:
            continue

        unique_findings[finding_key] = {
            "vulnerability_id": vulnerability_id,
            "severity": severity,
            "component": component,
            "package": package_name,
            "installed_version": installed_version,
            "fixed_version": (
                fixed_version
                if fixed_version
                else "No fix listed"
            ),
            "title": (
                title
                if title
                else "No title available"
            ),
            "fix_available": bool(fixed_version),
        }

    sorted_findings = sorted(
        unique_findings.values(),
        key=lambda item: (
            SEVERITY_ORDER.get(
                item["severity"],
                5,
            ),
            0 if item["fix_available"] else 1,
            item["vulnerability_id"],
        ),
    )

    return sorted_findings[:limit]


def calculate_component_score(
    counts: dict[str, int],
) -> int:
    """Calculate a simple component-level score."""

    score = 100

    score -= min(counts["CRITICAL"] * 20, 70)
    score -= min(counts["HIGH"] * 7, 45)
    score -= min(counts["MEDIUM"] * 2, 20)
    score -= min(counts["LOW"], 10)

    return max(0, min(100, score))


def determine_component_risk(
    counts: dict[str, int],
    score: int,
) -> str:
    """Determine risk for an individual component."""

    if counts["CRITICAL"] > 0:
        return "CRITICAL"

    if counts["HIGH"] >= 5 or score < 40:
        return "HIGH"

    if counts["HIGH"] > 0 or score < 70:
        return "MEDIUM"

    return "LOW"


def build_component_analysis(
    component_counts: dict[str, dict[str, int]],
) -> list[dict[str, Any]]:
    """Generate component-level risk information."""

    component_analysis: list[dict[str, Any]] = []

    for component, counts in component_counts.items():
        component_score = calculate_component_score(
            counts
        )

        component_risk = determine_component_risk(
            counts,
            component_score,
        )

        component_analysis.append({
            "component": component,
            "security_score": component_score,
            "risk_level": component_risk,
            "total_findings": sum(counts.values()),
            "severity_counts": counts,
        })

    component_analysis.sort(
        key=lambda item: (
            item["security_score"],
            item["component"],
        )
    )

    return component_analysis


# ============================================================
# Trend analysis
# ============================================================

def load_previous_analysis() -> dict[str, Any] | None:
    """
    Load the existing ai-analysis.json before overwriting it.

    This allows Sprint 2 to compare the current result with the
    previous analyzer run.
    """

    if not OUTPUT_FILE.exists():
        return None

    return load_json_file(OUTPUT_FILE)


def calculate_security_trend(
    current_score: int,
    current_findings: int,
    previous_analysis: dict[str, Any] | None,
) -> dict[str, Any]:
    """Compare the current run with the previous analysis."""

    if previous_analysis is None:
        return {
            "status": "BASELINE",
            "score_change": 0,
            "finding_change": 0,
            "message": (
                "This is the first available ScanGuard analysis. "
                "Future runs will calculate the security trend."
            ),
        }

    previous_score = int(
        previous_analysis.get(
            "security_score",
            current_score,
        )
    )

    previous_summary = previous_analysis.get(
        "vulnerability_summary",
        {},
    )

    previous_findings = int(
        previous_summary.get(
            "total",
            current_findings,
        )
    )

    score_change = current_score - previous_score
    finding_change = (
        current_findings - previous_findings
    )

    if score_change > 0 and finding_change <= 0:
        status = "IMPROVING"
        message = (
            "The security posture improved compared with the "
            "previous analysis."
        )
    elif score_change < 0 or finding_change > 0:
        status = "DECLINING"
        message = (
            "The security posture declined compared with the "
            "previous analysis."
        )
    else:
        status = "STABLE"
        message = (
            "The security posture remained stable compared with "
            "the previous analysis."
        )

    return {
        "status": status,
        "score_change": score_change,
        "finding_change": finding_change,
        "previous_score": previous_score,
        "current_score": current_score,
        "previous_findings": previous_findings,
        "current_findings": current_findings,
        "message": message,
    }


# ============================================================
# Main analysis
# ============================================================

def main() -> int:
    """Run the ScanGuard Sprint 2 security analyzer."""

    print("")
    print("ScanGuard AI - Sprint 2 Security Analyzer")
    print("==========================================")

    previous_analysis = load_previous_analysis()

    component_counts: dict[
        str,
        dict[str, int],
    ] = {}

    all_vulnerabilities: list[
        dict[str, Any]
    ] = []

    loaded_reports: list[str] = []
    missing_reports: list[str] = []
    report_locations: dict[str, str | None] = {}

    for component_name, candidate_paths in (
        EXPECTED_REPORTS.items()
    ):
        report_path = find_report_file(
            candidate_paths
        )

        if report_path is None:
            print(
                f"[WARNING] Missing report for "
                f"{component_name}"
            )

            component_counts[
                component_name
            ] = empty_severity_counts()

            missing_reports.append(
                component_name
            )

            report_locations[
                component_name
            ] = None

            continue

        report = load_json_file(report_path)

        if report is None:
            component_counts[
                component_name
            ] = empty_severity_counts()

            missing_reports.append(
                component_name
            )

            report_locations[
                component_name
            ] = str(report_path)

            continue

        loaded_reports.append(
            report_path.name
        )

        report_locations[
            component_name
        ] = str(
            report_path.relative_to(
                PROJECT_ROOT
            )
        )

        vulnerabilities = extract_vulnerabilities(
            report,
            component_name,
        )

        all_vulnerabilities.extend(
            vulnerabilities
        )

        component_counts[
            component_name
        ] = count_vulnerabilities(
            vulnerabilities
        )

    total_counts = aggregate_counts(
        component_counts
    )

    total_findings = sum(
        total_counts.values()
    )

    security_score, score_breakdown = (
        calculate_security_score(
            total_counts,
            len(loaded_reports),
            len(EXPECTED_REPORTS),
        )
    )

    risk_level = determine_risk_level(
        security_score,
        total_counts,
    )

    (
        release_readiness,
        release_reasons,
    ) = determine_release_readiness(
        total_counts,
        len(missing_reports),
    )

    executive_summary = build_executive_summary(
        total_counts,
        security_score,
        risk_level,
        release_readiness,
        len(loaded_reports),
    )

    business_impact = determine_business_impact(
        total_counts,
        release_readiness,
    )

    recommendations = generate_recommendations(
        total_counts,
        all_vulnerabilities,
        missing_reports,
    )

    top_findings = create_top_findings(
        all_vulnerabilities
    )

    component_analysis = build_component_analysis(
        component_counts
    )

    security_trend = calculate_security_trend(
        security_score,
        total_findings,
        previous_analysis,
    )

    fixable_findings = get_fixable_findings(
        all_vulnerabilities
    )

    analysis = {
        "analysis_version": "2.0.0",
        "product": "ScanGuard AI",
        "engine": (
            "ScanGuard deterministic security "
            "decision engine"
        ),
        "generated_at": datetime.now(
            timezone.utc
        ).isoformat(),
        "security_score": security_score,
        "risk_level": risk_level,
        "release_readiness": release_readiness,
        "release_reasons": release_reasons,
        "executive_summary": executive_summary,
        "business_impact": business_impact,
        "security_trend": security_trend,
        "vulnerability_summary": {
            "total": total_findings,
            "fix_available": len(
                fixable_findings
            ),
            "no_fix_listed": (
                total_findings
                - len(fixable_findings)
            ),
            "by_severity": total_counts,
            "by_component": component_counts,
        },
        "component_analysis": component_analysis,
        "score_breakdown": score_breakdown,
        "recommendations": recommendations,
        "top_findings": top_findings,
        "reports": {
            "expected_count": len(
                EXPECTED_REPORTS
            ),
            "loaded_count": len(
                loaded_reports
            ),
            "loaded": loaded_reports,
            "missing": missing_reports,
            "locations": report_locations,
        },
        "ai_status": {
            "mode": (
                "deterministic-security-reasoning"
            ),
            "llm_enabled": False,
            "sprint": 2,
            "message": (
                "Sprint 2 provides explainable scoring, "
                "risk classification, release decisions, "
                "business impact analysis, trend detection, "
                "and prioritized remediation recommendations. "
                "External LLM integration will be introduced "
                "in Sprint 3."
            ),
        },
    }

    REPORTS_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )

    try:
        with OUTPUT_FILE.open(
            "w",
            encoding="utf-8",
        ) as output_file:
            json.dump(
                analysis,
                output_file,
                indent=2,
                ensure_ascii=False,
            )

    except OSError as error:
        print(
            f"[ERROR] Could not write output: "
            f"{error}"
        )
        return 1

    print("")
    print(
        f"[OK] Reports loaded: "
        f"{len(loaded_reports)}/"
        f"{len(EXPECTED_REPORTS)}"
    )

    print(
        f"[OK] Findings analyzed: "
        f"{total_findings}"
    )

    print(
        f"[OK] Security score: "
        f"{security_score}/100"
    )

    print(
        f"[OK] Risk level: "
        f"{risk_level}"
    )

    print(
        f"[OK] Release status: "
        f"{release_readiness}"
    )

    print(
        f"[OK] Trend: "
        f"{security_trend['status']}"
    )

    print(
        f"[OK] Recommendations generated: "
        f"{len(recommendations)}"
    )

    print(
        f"[OK] Output created: "
        f"{OUTPUT_FILE}"
    )

    print("")

    return 0


if __name__ == "__main__":
    sys.exit(main())