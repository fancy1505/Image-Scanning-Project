# 🏗️ ARCHITECTURE.md

# ScanGuard AI – System Architecture

> **Version:** 1.0.0  
> **Project:** ScanGuard AI – DevSecOps Security Command Center  
> **Reference Application:** ShopNow  
> **Author:** Fancy Kejriwal

---

# Table of Contents

1. Architecture Overview
2. Design Principles
3. High-Level Architecture
4. Core Components
5. System Workflow
6. Data Flow
7. Component Details
8. Security Architecture
9. Monitoring Architecture
10. AI Decision Engine
11. Dashboard Architecture
12. Technology Stack
13. Scalability
14. Future Architecture
15. Conclusion

---

# 1. Architecture Overview

ScanGuard AI is an end-to-end DevSecOps Security Command Center designed to automate application security throughout the software delivery lifecycle.

Rather than relying on multiple disconnected security tools, the platform consolidates vulnerability scanning, static code analysis, secret detection, monitoring, AI-assisted analysis, and executive reporting into a single unified solution.

The current implementation demonstrates these capabilities using the **ShopNow** application, while the platform architecture is designed to support any containerized application.

---

# 2. Design Principles

The architecture follows five key principles:

## Security First

Security checks are integrated directly into the CI/CD pipeline, enabling early detection of vulnerabilities before deployment.

---

## Automation

Manual security validation is replaced by automated workflows to improve consistency and reduce human error.

---

## Observability

Security metrics are continuously collected, monitored, and visualized using Prometheus and Grafana.

---

## Scalability

The platform is modular, allowing additional scanners, dashboards, and applications to be integrated with minimal changes.

---

## Intelligence

AI-generated summaries and remediation recommendations assist development teams in prioritizing security issues.

---

# 3. High-Level Architecture

```text
                    ScanGuard AI
             DevSecOps Security Command Center

                 Developer / Security Team
                          │
                          ▼
                  GitHub Repository
                          │
                          ▼
                 GitHub Actions CI/CD
                          │
      ┌───────────────────┼────────────────────┐
      │                   │                    │
      ▼                   ▼                    ▼
 GitLeaks            SonarCloud          Docker Build
 Secret Scan       Static Analysis      Container Image
      │                   │                    │
      └───────────────┬───┴────────────────────┘
                      ▼
              Trivy Filesystem Scan
                      │
                      ▼
                Trivy Image Scan
                      │
      ┌───────────────┼─────────────────────┐
      │               │                     │
      ▼               ▼                     ▼
 JSON Reports    HTML Reports      Python Metrics Exporter
      │               │                     │
      └───────────────┴─────────────┬───────┘
                                    ▼
                           AI Risk Analysis
                                    │
                     Executive Summary Engine
                                    │
      ┌─────────────────────────────┼─────────────────────────┐
      ▼                             ▼                         ▼
 Security Score             Release Decision          Recommendations
      │                             │                         │
      └─────────────────────────────┴─────────────────────────┘
                                    ▼
                    ScanGuard AI React Dashboard
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
   Prometheus Metrics         Grafana Dashboard      Slack / Email
```

---

# 4. Core Components

## Developer

Developers commit application source code to the GitHub repository. Every commit triggers the automated security pipeline.

---

## GitHub Repository

The repository stores the application source code, configuration files, GitHub Actions workflows, documentation, and security reports.

---

## GitHub Actions

GitHub Actions orchestrates the complete DevSecOps workflow.

Responsibilities include:

- Code checkout
- Security scanning
- Docker image creation
- Report generation
- Artifact publishing
- AI analysis execution

---

## GitLeaks

GitLeaks detects sensitive information accidentally committed into source code.

Examples include:

- API Keys
- AWS Credentials
- Database Passwords
- Tokens
- Certificates

Early secret detection prevents credential exposure.

---

## SonarCloud

SonarCloud performs static application security testing (SAST) and code quality analysis.

Metrics include:

- Bugs
- Vulnerabilities
- Code Smells
- Reliability Rating
- Maintainability Rating
- Security Rating
- Technical Debt

---

## Docker

Docker packages the application into portable container images that are scanned before deployment.

---

## Trivy

Trivy performs two independent scans.

### Filesystem Scan

Analyzes application dependencies before image creation.

### Image Scan

Scans built Docker images for operating system packages and application vulnerabilities.

Severity levels:

- Critical
- High
- Medium
- Low

---

## Report Engine

Security reports are generated in multiple formats.

### JSON Reports

Machine-readable reports used by the dashboard and AI engine.

### HTML Reports

Human-readable reports for auditors and security reviews.

---

## Metrics Exporter

A custom Python exporter converts scan results into Prometheus metrics.

Example metrics:

- Critical vulnerabilities
- High vulnerabilities
- Medium vulnerabilities
- Low vulnerabilities
- SonarCloud metrics
- Pipeline status

---

## AI Risk Analysis

The AI engine processes consolidated security findings and generates:

- Executive summaries
- Business impact analysis
- Remediation plans
- Deployment recommendations
- Risk prioritization

---

## React Dashboard

The React application presents all security information through an executive dashboard.

Major modules include:

- Executive Summary
- Security Score
- Risk Level
- Deployment Decision
- Vulnerability Lifecycle
- CI/CD Pipeline
- Security Reports
- Business Impact
- AI Recommendations

---

# 5. System Workflow

1. Developer pushes code.
2. GitHub Actions starts automatically.
3. GitLeaks scans for secrets.
4. SonarCloud analyzes code quality.
5. Docker builds container images.
6. Trivy scans the filesystem.
7. Trivy scans Docker images.
8. Reports are generated.
9. Metrics are exported.
10. AI analyzes findings.
11. Dashboard visualizes results.
12. Deployment decision is produced.

---

# 6. Data Flow

```text
Source Code
      │
      ▼
Security Scanners
      │
      ▼
JSON Reports
      │
      ▼
Python Processing
      │
      ▼
AI Analysis
      │
      ▼
Dashboard
      │
      ▼
Executive Decision
```

---

# 7. Security Architecture

Security validation occurs at multiple layers:

| Layer | Tool |
|--------|------|
| Secret Detection | GitLeaks |
| Static Analysis | SonarCloud |
| Filesystem Scan | Trivy |
| Container Scan | Trivy |
| Metrics | Prometheus |
| Monitoring | Grafana |
| Executive Dashboard | React |
| AI Analysis | Python |

This layered approach reduces the likelihood of vulnerabilities reaching production.

---

# 8. Monitoring Architecture

Prometheus continuously collects metrics generated by the custom Python exporter.

Grafana visualizes:

- Vulnerability trends
- Severity distribution
- Pipeline health
- Historical findings
- Security posture

---

# 9. AI Decision Engine

The AI module consolidates outputs from all scanners and transforms raw findings into actionable insights.

Key outputs include:

- Security score
- Risk classification
- Business impact summary
- Prioritized remediation plan
- Release recommendation (Deploy / Hold / Block)

---

# 10. Dashboard Architecture

The dashboard is organized into modular sections:

- Executive Overview
- Security Score
- Risk Level
- Vulnerability Lifecycle
- Pipeline Status
- Severity Distribution
- Reports & Notifications
- Business Impact
- AI Recommendations
- Deployment Decision

Each module consumes structured JSON reports produced during the CI/CD pipeline.

---

# 11. Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React |
| Backend | Python |
| CI/CD | GitHub Actions |
| Containers | Docker |
| Secret Detection | GitLeaks |
| Static Analysis | SonarCloud |
| Vulnerability Scanner | Trivy |
| Metrics | Prometheus |
| Monitoring | Grafana |
| Reports | HTML, JSON |
| Notifications | Slack, Email |

---

# 12. Scalability

The architecture is intentionally modular.

Future enhancements include:

- Multi-application support
- Kubernetes integration
- SBOM generation
- Dependency-Track integration
- Cloud deployment
- Role-based access control
- Multi-user dashboard
- Enterprise authentication
- AI chatbot assistant

---

# 13. Future Architecture

Future versions will allow users to onboard any containerized application by configuring:

- Repository URL
- Build path
- Scan policy
- Dashboard profile

This transforms ScanGuard AI from a single-application demonstration into a reusable DevSecOps platform.

---

# 14. Conclusion

ScanGuard AI demonstrates how multiple DevSecOps tools can be integrated into a unified security platform that automates security validation, centralizes reporting, and supports informed release decisions.

Its modular architecture, observability features, and AI-assisted analysis provide a strong foundation for future enterprise-scale enhancements.
