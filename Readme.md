# Sprint 2 – Security Pipeline Integration using GitHub Actions

## Project Overview

The objective of Sprint 2 was to integrate automated security testing into the CI/CD pipeline using GitHub Actions. The implementation follows DevSecOps principles by embedding security controls directly into the software delivery lifecycle.

The security pipeline automatically performs:

* Secret scanning using Gitleaks
* Static code analysis preparation using SonarQube
* Filesystem vulnerability scanning using Trivy
* Docker image security scanning
* Security report generation
* Artifact storage for auditing and compliance

This automation helps identify vulnerabilities and exposed secrets early in the development process before deployment.

# Architecture

```text
Developer Push
      │
      ▼
GitHub Actions
      │
      ▼
Checkout Repository
      │
      ▼
Gitleaks Secret Scan
      │
      ▼
Trivy Filesystem Scan
      │
      ▼
Docker Image Build
      │
      ▼
Container Vulnerability Scan
      │
      ▼
Generate Reports
      │
      ▼
Upload Security Artifacts
```

---

# Technologies Used

| Tool             | Purpose                   |
| ---------------- | ------------------------- |
| GitHub Actions   | CI/CD workflow automation |
| Docker           | Containerization platform |
| Trivy            | Vulnerability scanning    |
| Gitleaks         | Secret detection          |
| SonarQube        | Static code analysis      |
| GitHub Artifacts | Security report storage   |

---

# Tool Description and Purpose

## GitHub Actions

GitHub Actions is used to automate the execution of security checks whenever code is pushed or a pull request is created.

Responsibilities:

* Execute security workflow
* Build Docker images
* Run vulnerability scans
* Upload security reports

---

## Gitleaks

Gitleaks detects sensitive information accidentally committed to source code repositories.

Security Checks:

* API Keys
* Passwords
* Tokens
* Secrets
* Credentials

Purpose:

Prevent credential leakage and improve repository security.

---

## Trivy

Trivy is an open-source vulnerability scanner used for filesystem and container security scanning.

Security Checks:

* Vulnerable packages
* Dependency CVEs
* Operating system vulnerabilities
* Container image vulnerabilities

Purpose:

Identify HIGH and CRITICAL vulnerabilities before deployment.

---

## Docker

Docker packages applications into containers that can be scanned and deployed consistently.

Images Built:

* shopnow-backend:v1
* shopnow-frontend:v1
* shopnow-admin:v1

Purpose:

Provide isolated environments and enable container security scanning.

---

## SonarQube

SonarQube provides static code analysis and code quality assessment.

Analysis Areas:

* Bugs
* Code Smells
* Vulnerabilities
* Security Hotspots
* Maintainability Issues

Purpose:

Improve code quality and identify security weaknesses.

---

## GitHub Artifacts

GitHub Artifacts store generated reports from workflow executions.

Artifacts Generated:

* gitleaks-results.sarif
* security-reports

Purpose:

Support auditing and historical security tracking.

---

# Repository Structure
Description:
Screenshot showing the Container-Vulnerability-Scanner repository structure in VS Code.
<img width="711" height="1246" alt="image" src="https://github.com/user-attachments/assets/f1a22476-dcd6-4304-b09a-dbdfa4d8058b" />
<img width="1732" height="1026" alt="image" src="https://github.com/user-attachments/assets/1b5e8d94-fa57-4328-8227-46e0aeb953cf" />


---

# Security Pipeline Workflow

Workflow File:

```yaml
.github/workflows/security-pipeline.yml
```
Description:
GitHub Actions workflow implementing automated security scanning.
<img width="1206" height="1500" alt="image" src="https://github.com/user-attachments/assets/5faf0c1d-2373-4983-ba7c-c2c52877529e" />
<img width="1464" height="1257" alt="image" src="https://github.com/user-attachments/assets/f48e2a5c-f050-4e20-9547-f8fadffd2314" />
<img width="1059" height="956" alt="image" src="https://github.com/user-attachments/assets/44affefa-18ed-480b-889e-b54ee2c74deb" />
<img width="1109" height="1048" alt="image" src="https://github.com/user-attachments/assets/ade5c0a5-b00d-4d6d-aefa-82ac5e72b574" />

---

# Secret Scanning using Gitleaks

Purpose:

* Detect hardcoded passwords
* Detect API keys
* Detect exposed tokens
* Prevent credential leakage

Workflow Step:

```yaml
- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@v2
```

Result:

No secrets were detected.

<img width="2479" height="1525" alt="image" src="https://github.com/user-attachments/assets/301ccb47-19ce-438e-b22c-c8ac9e5b7c33" />
<img width="2677" height="1557" alt="image" src="https://github.com/user-attachments/assets/9a52aaca-34c8-4fbd-979c-d79a3c604450" />


## Static Code Analysis with SonarQube

Purpose:
- Analyze source code quality
- Detect bugs and code smells
- Identify security vulnerabilities and hotspots
- Enforce quality gates before deployment

Project Key:
shopnow-security

Tools Used:
- SonarQube Community Edition
- SonarScanner
- Java 17

<img width="2875" height="1453" alt="image" src="https://github.com/user-attachments/assets/fd4c5c9c-c98f-4307-ae57-a9e08bf29de8" />
<img width="2877" height="1476" alt="image" src="https://github.com/user-attachments/assets/a1373c1c-f889-49e6-bd45-38f8bbe7f2c3" />



[PASTE SCREENSHOT 4 – SONARQUBE ANALYSIS RESULTS HERE]

---

# Filesystem Vulnerability Scan using Trivy

Purpose:

* Scan project dependencies
* Identify vulnerable packages
* Detect HIGH and CRITICAL CVEs

Command:

```bash
trivy fs shopNow --severity HIGH,CRITICAL
```

<img width="2400" height="1037" alt="image" src="https://github.com/user-attachments/assets/19123ac0-f0f8-4e62-9009-563cbcf39b63" />
<img width="2394" height="600" alt="image" src="https://github.com/user-attachments/assets/42d1ea4b-03f2-4133-9119-515a0fb63758" />
<img width="2810" height="1410" alt="image" src="https://github.com/user-attachments/assets/f848faff-f943-4e61-afae-7640fd266931" />
<img width="2166" height="949" alt="image" src="https://github.com/user-attachments/assets/099d94e0-0e7d-443e-a475-6efc168c0cd3" />

---

# Vulnerability Scan Results

Summary:

| Component | Vulnerabilities |
| --------- | --------------- |
| Admin     | 35              |
| Backend   | 2               |
| Frontend  | 35              |

Generated Report:

```text
reports/trivy-fs-report.json
```
<img width="1766" height="1543" alt="image" src="https://github.com/user-attachments/assets/6e0f908b-4453-4315-8cbc-1223d8bb2bfd" />
<img width="1143" height="1298" alt="image" src="https://github.com/user-attachments/assets/968f1dd4-fdd6-44e1-996f-b4e72ada0941" />
<img width="1134" height="1300" alt="image" src="https://github.com/user-attachments/assets/188ca37e-4cec-4cc9-ba22-39e301fc2547" />
<img width="1120" height="1399" alt="image" src="https://github.com/user-attachments/assets/f4e1390d-adba-4e99-841b-8c8958213bf1" />
<img width="1905" height="1523" alt="image" src="https://github.com/user-attachments/assets/914e5316-1e96-4ee7-9591-19120f48f33d" />

---

# Docker Image Security Scanning

Docker Images Built:

* shopnow-backend:v1
* shopnow-frontend:v1
* shopnow-admin:v1

Purpose:

* Scan container images
* Identify vulnerable libraries
* Generate JSON security reports

Reports Generated:

* backend-report.json
* frontend-report.json
* admin-report.json

<img width="549" height="567" alt="image" src="https://github.com/user-attachments/assets/252ccc2d-4103-457f-9f03-6d2d9167533c" />
<img width="2387" height="1525" alt="image" src="https://github.com/user-attachments/assets/867fdc2d-76f5-4bb1-b692-04bf327290c1" />


---

# GitHub Actions Pipeline Execution

The Security Pipeline was automatically triggered on:

```yaml
on:
  push:
  pull_request:
```

Completed Stages:

* Checkout Code
* Gitleaks Scan
* Trivy Filesystem Scan
* Container Scan
* Artifact Upload

<img width="1660" height="1442" alt="image" src="https://github.com/user-attachments/assets/0171b23f-3e19-425f-95ce-6c2679a910e7" />
<img width="1269" height="1449" alt="image" src="https://github.com/user-attachments/assets/e5a2bda6-3074-4447-8a35-422c7ba445b6" />
<img width="1392" height="1494" alt="image" src="https://github.com/user-attachments/assets/e737a52b-056e-4cd8-bd29-755095ab0a8f" />
<img width="1408" height="1012" alt="image" src="https://github.com/user-attachments/assets/7f407fd3-8c05-401a-a6e1-705240474fb8" />
<img width="2864" height="990" alt="image" src="https://github.com/user-attachments/assets/e93df6df-7a96-4a6e-9055-10ed2b414d33" />
<img width="2832" height="1269" alt="image" src="https://github.com/user-attachments/assets/b352888e-1371-44db-97a1-244c96996765" />


---

# Security Artifacts Generated

Artifacts Produced:

* gitleaks-results.sarif
* security-reports

Purpose:

* Store scan results
* Download reports for auditing
* Track security posture over time

<img width="2018" height="666" alt="image" src="https://github.com/user-attachments/assets/b28fcb63-0e86-473e-9fe8-32e9173275a4" />


---

# Git Operations

Branch Used:

```bash
sprint2-security-pipeline
```

Push Command:

```bash
git push origin sprint2-security-pipeline
```

<img width="1674" height="819" alt="image" src="https://github.com/user-attachments/assets/a25ee3f3-ae39-4731-b3c4-795da78716bd" />


# Challenges Faced

1. Java installation and configuration for SonarScanner.
2. SonarScanner PATH configuration.
3. GitHub Actions workflow debugging.
4. Trivy action version compatibility issues.
5. Docker image build path troubleshooting.
6. GitHub artifact upload configuration.
7. Vulnerability report generation and validation.

---

# Learning Outcomes

* GitHub Actions workflow development
* DevSecOps implementation
* Secret detection using Gitleaks
* Filesystem vulnerability scanning
* Container image security scanning
* SonarQube integration
* Artifact management
* CI/CD security automation
* Security report generation
* Vulnerability assessment and analysis

---

# Conclusion

Sprint 2 successfully integrated automated security testing into the CI/CD pipeline using GitHub Actions. Security checks are now executed automatically whenever code changes are introduced, ensuring continuous monitoring of source code, dependencies, and container images.

The implementation demonstrates DevSecOps best practices by combining secret scanning, vulnerability assessment, static analysis preparation, automated reporting, and artifact management into a unified security pipeline. This approach improves application security, enhances code quality, and enables early detection of security issues throughout the software development lifecycle.
