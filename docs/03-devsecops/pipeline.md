# ⚙️ PIPELINE.md

# ScanGuard AI – DevSecOps Pipeline

> **Version:** 1.0.0  
> **Project:** ScanGuard AI – DevSecOps Security Command Center

---

# Table of Contents

1. Pipeline Overview
2. Pipeline Objectives
3. Workflow Architecture
4. Pipeline Stages
5. Security Gates
6. Generated Reports
7. Metrics Collection
8. AI Analysis
9. Dashboard Integration
10. Deployment Decision
11. Error Handling
12. Future Enhancements

---

# 1. Pipeline Overview

The ScanGuard AI pipeline automates application security throughout the software delivery lifecycle.

Every code change committed to the GitHub repository automatically triggers a series of security validations before an application is considered ready for deployment.

The pipeline integrates multiple open-source security tools into a single automated workflow, eliminating manual security checks and reducing release risk.

---

# 2. Pipeline Objectives

The pipeline is designed to:

- Automate security validation
- Detect vulnerabilities early
- Prevent credential leaks
- Improve code quality
- Scan container images
- Generate executive reports
- Produce AI-assisted recommendations
- Support release governance

---

# 3. Workflow Architecture

```text
Developer
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Actions
      │
      ▼
──────────────────────────────────────────
Stage 1  → Checkout Source Code
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 2 → GitLeaks Secret Scan
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 3 → SonarCloud Analysis
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 4 → Docker Image Build
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 5 → Trivy Filesystem Scan
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 6 → Trivy Image Scan
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 7 → Generate Reports
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 8 → AI Risk Analysis
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 9 → Metrics Export
──────────────────────────────────────────
      │
      ▼
──────────────────────────────────────────
Stage 10 → Dashboard Update
──────────────────────────────────────────
      │
      ▼
Executive Deployment Decision
```

---

# 4. Pipeline Stages

## Stage 1 – Source Code Checkout

GitHub Actions checks out the latest version of the repository.

### Purpose

- Retrieve application source code
- Download workflow configuration
- Prepare runner environment

---

## Stage 2 – GitLeaks Secret Detection

Tool:

- GitLeaks

Purpose:

Detect accidentally committed secrets including:

- API Keys
- AWS Credentials
- Azure Credentials
- JWT Tokens
- Database Passwords
- Private Keys
- Certificates

### Output

```
gitleaks-report.json
```

Benefits:

- Prevent credential leakage
- Improve repository security
- Detect exposed secrets before deployment

---

## Stage 3 – SonarCloud Analysis

Tool:

SonarCloud

Purpose:

Perform Static Application Security Testing (SAST).

Metrics collected:

- Bugs
- Vulnerabilities
- Code Smells
- Security Rating
- Reliability Rating
- Maintainability Rating
- Technical Debt
- Quality Gate

### Output

SonarCloud API Metrics

Benefits:

- Improve software quality
- Reduce technical debt
- Identify insecure coding practices

---

## Stage 4 – Docker Image Build

Tool:

Docker

Purpose:

Package the application into deployable container images.

Example images:

```
shopnow-backend:v1
shopnow-frontend:v1
shopnow-admin:v1
```

Benefits:

- Standardized deployments
- Portable runtime
- Reproducible builds

---

## Stage 5 – Trivy Filesystem Scan

Tool:

Trivy

Purpose:

Scan source code dependencies before image creation.

Scanned items include:

- Libraries
- Packages
- Dependency vulnerabilities

Severity levels:

- Critical
- High
- Medium
- Low

Output:

```
trivy-fs-report.json
```

---

## Stage 6 – Trivy Image Scan

Tool:

Trivy

Purpose:

Analyze Docker images for known CVEs.

Checks include:

- Operating System Packages
- Application Dependencies
- Installed Libraries

Generated reports:

```
shopnow-backend_v1.json
shopnow-admin_v1.json
nginx_latest.json
```

Benefits:

- Detect vulnerable packages
- Prevent deployment of insecure images

---

## Stage 7 – Report Generation

The pipeline consolidates security findings into structured reports.

Generated formats:

### JSON

Machine-readable reports consumed by:

- Dashboard
- AI Engine
- Metrics Exporter

### HTML

Executive-friendly reports for:

- Auditors
- Security Teams
- Compliance Reviews

---

# 5. Security Gates

The pipeline contains multiple validation gates.

| Security Gate | Tool |
|---------------|------|
| Secret Detection | GitLeaks |
| Static Analysis | SonarCloud |
| Filesystem Scan | Trivy |
| Container Scan | Trivy |
| Quality Gate | SonarCloud |
| AI Risk Assessment | Python |

These gates help ensure that security issues are detected before deployment.

---

# 6. Metrics Collection

A custom Python exporter parses the generated JSON reports and exposes metrics in Prometheus format.

Example metrics:

```
trivy_critical_vulnerabilities

trivy_high_vulnerabilities

trivy_medium_vulnerabilities

trivy_low_vulnerabilities

sonar_bugs

sonar_vulnerabilities

pipeline_status

gitleaks_secrets
```

Prometheus continuously scrapes these metrics for visualization.

---

# 7. AI Risk Analysis

The AI module aggregates outputs from all security tools and produces:

- Executive Summary
- Security Score
- Risk Level
- Business Impact
- Remediation Plan
- Deployment Recommendation

Rather than reviewing multiple reports manually, stakeholders receive a consolidated security assessment.

---

# 8. Dashboard Integration

After the pipeline completes, the generated reports are consumed by the React dashboard.

Dashboard modules include:

- Executive Summary
- Security Score
- Deployment Decision
- Pipeline Status
- Vulnerability Lifecycle
- Reports & Notifications
- Severity Distribution
- AI Recommendations
- Business Impact

This provides a centralized view of the application's security posture.

---

# 9. Deployment Decision

The platform evaluates all findings to determine deployment readiness.

Example decision logic:

| Condition | Decision |
|-----------|----------|
| Critical vulnerabilities detected | Block Release |
| Failed Quality Gate | Block Release |
| Secret detected | Block Release |
| High vulnerabilities exceed threshold | Manual Review |
| No blocking issues | Approve Release |

This risk-based approach helps prevent vulnerable software from reaching production.

---

# 10. Error Handling

The pipeline is designed to continue generating reports even if individual scans detect issues.

Examples:

- Trivy scan failures are captured in reports.
- GitLeaks findings do not stop report generation.
- SonarCloud Quality Gate results are recorded for review.

This ensures visibility into all findings while allowing teams to make informed decisions.

---

# 11. Future Enhancements

Future versions of the pipeline may include:

- Kubernetes security scanning
- Infrastructure as Code (IaC) scanning
- Software Bill of Materials (SBOM) generation
- Dependency-Track integration
- Container signing and verification
- Multi-application support
- Policy-as-Code
- Automated compliance reporting

---

# 12. Conclusion

The ScanGuard AI pipeline demonstrates how multiple security tools can be orchestrated within a CI/CD workflow to automate security validation, consolidate findings, and support executive release decisions.

By integrating GitLeaks, SonarCloud, Docker, Trivy, AI analysis, Prometheus, Grafana, and a React dashboard, the platform provides an enterprise-inspired DevSecOps workflow that is modular, scalable, and suitable for continuous improvement.
