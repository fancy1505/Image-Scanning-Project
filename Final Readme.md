<div align="center">

# 🛡️ ScanGuard AI
## DevSecOps Security Command Center|| Docker Image Scanner - Final Capstone Project

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
- develop a vulnerability scanner that automatically scans container images before they are pushed to production, based on known vulnerability databases like the CVE database.
- integrate the scanner into popular CI/CD pipelines (e.g., Jenkins or GitHub Actions) to ensure continuous security checks.
- generate detailed vulnerability reports and send real-time notifications via Slack or Teams, allowing DevOps teams to take immediate action.
- create a user-friendly dashboard that provides a historical view of vulnerabilities detected, resolved, and pending fixes.

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
With the rise in containerized applications, securing container images is critical to prevent vulnerabilities from reaching production. However, DevOps teams often lack automated tools that integrate seamlessly into their CI/CD pipelines, resulting in manual checks or no checks at all. This project aims to develop an automated vulnerability scanner that scans container images for known vulnerabilities, integrates with CI/CD pipelines, and reports results, ensuring only secure images are deployed.
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

<img width="864" height="1821" alt="image" src="https://github.com/user-attachments/assets/d1a96550-86fc-4efa-9487-e2ee08ec9b81" />
---

# 🖥 Dashboard Preview

<img width="2877" height="1026" alt="image" src="https://github.com/user-attachments/assets/1e24eddf-f2f1-4b5a-b0ec-fe2865d83eb9" />
<img width="2871" height="1156" alt="image" src="https://github.com/user-attachments/assets/6985646f-811d-4a50-aa0e-f284f8b4c7e2" />
<img width="2180" height="1291" alt="image" src="https://github.com/user-attachments/assets/7af2314b-7a54-4d69-a60c-8ebefa540028" />
<img width="2214" height="1401" alt="image" src="https://github.com/user-attachments/assets/bf228659-4d05-431a-9b7b-43c9027c797f" />


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

## infographic that tells the story of our capstone—from the problem we set out to solve, through the DevSecOps architecture and CI/CD pipeline, to the dashboard, reports, monitoring, and final outcomes.
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/55465c94-a3b0-42be-826f-2eaa4ce1b31d" />

# 🚀 Future Enhancements

- Multi-application support
- Kubernetes
-
- Done by Junior DevOps Team (Fancy & Rahul Kumar)
Assigned from HeroVired Virtual Education
PPMCAD - (Batch 15)
