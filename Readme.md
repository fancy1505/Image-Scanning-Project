# 🛡️ ScanGuard AI - DevSecOps Security Command Center

## 📌 Project Overview

ScanGuard AI is a DevSecOps Security Command Center designed to automate security assessment, vulnerability comparison, and deployment decision-making for modern applications.

The platform integrates multiple security tools to identify vulnerabilities, compare security posture before and after remediation, and generate actionable security insights.

This project demonstrates a practical DevSecOps workflow by scanning applications, applying security improvements, validating the results, and presenting them through an executive dashboard.

---

# Project Objectives

- Automate security scanning
- Compare security posture before and after remediation
- Reduce application vulnerabilities
- Generate deployment recommendations
- Provide executive security reporting
- Build a reusable DevSecOps security platform

---

# Features

## Application Security

- npm Audit
- Trivy Container Scanning
- Trivy Filesystem Scanning
- GitLeaks Secret Detection
- SonarCloud Static Code Analysis

---

## DevSecOps Automation

- GitHub Actions CI Pipeline
- Automated Security Reports
- JSON Report Generation
- HTML Report Generation
- Before vs After Comparison
- Risk Reduction Analysis

---

## Monitoring

- Prometheus Metrics Exporter
- Grafana Dashboard
- Vulnerability Metrics
- Security Health Monitoring

---

## AI Ready

Designed for future integration with AI-powered security recommendations including:

- Risk Analysis
- Deployment Decision Support
- Vulnerability Summarization
- Security Recommendations

---

# Project Architecture

```

Developer
↓

GitHub Repository

↓

GitHub Actions Pipeline

↓

Security Scans

- npm Audit
- Trivy
- GitLeaks
- SonarCloud

↓

JSON Reports

↓

Comparison Engine

↓

Risk Score Calculation

↓

Deployment Recommendation

↓

ScanGuard AI Dashboard

```

---

# Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React |
| Backend | Node.js |
| Security | Trivy |
| Secrets | GitLeaks |
| SAST | SonarCloud |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus |
| Dashboard | Grafana |
| Container | Docker |
| Version Control | Git |

---

# Project Structure

```

Container-Vulnerability-Scanner

├── backend
├── frontend
├── admin
├── reports
├── scans
│   └── shopnow-comparison
│       ├── before
│       └── after
├── metrics
├── monitoring
├── scripts
├── docs
├── .github
│   └── workflows
└── docker-compose.yml

```

---

# Before vs After Security Assessment

| Component | Before | After | Improvement |
|----------|--------|-------|-------------|
| Frontend | 54 | 28 | 48.15% Reduction |
| Backend | 9 | 0 | 100% Reduction |
| Admin | 28 | 28 | Legacy CRA Dependencies |

---

# Security Workflow

```

Build Application

↓

Security Scan

↓

Generate Reports

↓

Apply Remediation

↓

Rebuild

↓

Rescan

↓

Compare Results

↓

Risk Assessment

↓

Deployment Recommendation

```

---

# Security Tools

## npm Audit

Detects vulnerable Node.js dependencies.

---

## Trivy

- Container Image Scanning
- Filesystem Scanning
- Vulnerability Assessment

---

## GitLeaks

Detects exposed secrets such as:

- API Keys
- Tokens
- Passwords

---

## SonarCloud

Static Application Security Testing

- Bugs
- Vulnerabilities
- Code Smells
- Maintainability

---

# Key Achievements

- Implemented automated security scanning
- Generated before vs after comparison reports
- Reduced Frontend vulnerabilities by 48%
- Eliminated Backend vulnerabilities
- Built reusable DevSecOps workflow
- Integrated multiple security tools
- Automated report generation

---

# Future Enhancements

- AI-powered remediation recommendations
- Executive Dashboard
- Risk Scoring Engine
- Deployment Approval Engine
- Multi-Repository Support
- Repository Auto Discovery
- Kubernetes Security
- SBOM Generation
- Dependency Track Integration

---

# Dashboard (Coming Soon)

- Executive Summary
- Risk Score
- Before vs After Charts
- Deployment Decision
- Vulnerability Trends
- Security KPIs

---

# Author

Fancy Kejriwal & Rahul kumar prajapati

DevSecOps | Cloud | Security Automation
