<div align="center">

# 🛡️ ScanGuard AI
## DevSecOps Security Command Center

### Secure Today • Deploy Tomorrow • Protect Always

An enterprise-inspired DevSecOps platform that automates security scanning, vulnerability analysis, AI-powered risk assessment, and release readiness decisions for containerized applications.

---

![GitHub last commit](https://img.shields.io/github/last-commit/fancy1505/Image-Scanning-Project?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/fancy1505/Image-Scanning-Project?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/fancy1505/Image-Scanning-Project?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/fancy1505/Image-Scanning-Project?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

</div>

---

# 📖 Overview

ScanGuard AI is a modern DevSecOps Security Command Center designed to automate application security throughout the software delivery lifecycle.

The platform integrates multiple security tools into a unified dashboard that enables development, DevOps, and security teams to continuously identify vulnerabilities, evaluate release readiness, and make informed deployment decisions.

Unlike traditional vulnerability scanners, ScanGuard AI combines security scanning, AI-powered analysis, executive reporting, and operational dashboards into a single platform.

The current implementation demonstrates the platform using the **ShopNow** reference application, while the architecture is designed to support any containerized application.

---

# 🎯 Project Objectives

- Automate security scanning in CI/CD pipelines
- Detect source code secrets before deployment
- Perform static code quality analysis
- Scan container images for vulnerabilities
- Generate executive security reports
- Calculate security scores
- Provide AI-assisted remediation recommendations
- Support release governance through risk-based deployment decisions
- Visualize security posture through an interactive dashboard

---

# ❗ Problem Statement

Modern software deployments involve multiple security validation steps performed using independent tools.

Development teams often struggle with:

- Fragmented security reports
- Manual vulnerability analysis
- Lack of centralized dashboards
- Delayed release decisions
- No unified executive security view
- Limited visibility into DevSecOps pipelines

ScanGuard AI addresses these challenges by consolidating security analysis into a single DevSecOps platform.

---

# 🚀 Key Features

✅ GitHub Actions CI/CD Integration

✅ GitLeaks Secret Detection

✅ SonarCloud Static Code Analysis

✅ Docker Container Image Build

✅ Trivy Filesystem Vulnerability Scan

✅ Trivy Container Image Scan

✅ AI-Powered Risk Analysis

✅ Executive Security Dashboard

✅ Vulnerability Lifecycle Tracking

✅ Security Score Calculation

✅ Release Readiness Decision

✅ HTML Report Generation

✅ JSON Report Generation

✅ Prometheus Metrics Exporter

✅ Grafana Security Monitoring

✅ Slack Notifications

✅ Email Notifications

---

# 🏗 High-Level Architecture

(Add architecture image here)

```
Developer
      │
GitHub Repository
      │
GitHub Actions
      │
──────────────────────────────────────
GitLeaks
SonarCloud
Docker Build
Trivy Filesystem
Trivy Image
──────────────────────────────────────
      │
AI Risk Analysis
      │
Reports
      │
Prometheus
      │
Grafana
      │
React Dashboard
      │
Executive Decision
```

---

# 🖥 Dashboard Preview

(Add dashboard screenshot here)

Dashboard Modules:

- Executive Overview
- Security Score
- Risk Level
- Deployment Decision
- Vulnerability Lifecycle
- CI/CD Pipeline
- Reports & Notifications
- Severity Distribution
- Executive Summary
- Business Impact
- AI Recommendations
- Security Report Coverage

---

# 🛠 Technology Stack

| Category | Technologies |
|-----------|--------------|
| Frontend | React |
| Backend | Python |
| CI/CD | GitHub Actions |
| Containerization | Docker |
| Vulnerability Scanner | Trivy |
| Secret Detection | GitLeaks |
| Static Analysis | SonarCloud |
| Monitoring | Prometheus |
| Visualization | Grafana |
| Reports | HTML, JSON |
| Notifications | Slack, Email |
| Version Control | Git |

---

# 🔄 DevSecOps Workflow

Developer

↓

GitHub Repository

↓

GitHub Actions

↓

GitLeaks

↓

SonarCloud

↓

Docker Build

↓

Trivy Filesystem Scan

↓

Trivy Image Scan

↓

AI Analysis

↓

Executive Dashboard

↓

Deployment Decision

---

# 📂 Repository Structure

```text
Image-Scanning-Project/
│
├── dashboard/
├── shopNow/
├── scripts/
├── reports/
├── metrics/
├── monitoring/
├── docs/
├── .github/workflows/
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

# 📊 Dashboard Highlights

✔ Security Score

✔ Executive Summary

✔ Risk Level

✔ Vulnerability Lifecycle

✔ Release Readiness

✔ Security Reports

✔ Pipeline Status

✔ AI Recommendations

✔ Business Impact

✔ Historical Metrics

---

# 📈 Current Results

| Metric | Value |
|---------|------:|
| Critical | 8 |
| High | 120 |
| Medium | 70 |
| Low | 78 |
| Total Findings | 276 |
| Baseline Findings | 744 |
| Resolved Findings | 468 |
| Reduction | 63% |
| Risk Level | CRITICAL |
| Release Status | BLOCK RELEASE |

---

# 🚀 Future Enhancements

- Multi-application support
- Kubernetes
-
- Done by Junior DevOps Team (Fancy & Rahul Kumar)
Assigned from HeroVired Virtual Education
PPMCAD - (Batch 15)
