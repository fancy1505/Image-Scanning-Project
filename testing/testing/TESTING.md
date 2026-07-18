# ScanGuard AI – Testing Report

## Project

Container Image Vulnerability Scanner with Reporting

---

# Test Environment

Operating System:
Windows 11

Python:
3.12+

Docker Desktop:
Installed

GitHub Actions:
Enabled

Git:
Installed

Node.js:
Installed

Grafana:
Configured

Prometheus:
Configured

Slack:
Configured

Email:
Configured

---

# Test Cases

## TC-01 GitLeaks Secret Scan

Objective:
Verify secrets are detected.

Expected Result:
Pipeline completes.
Secrets detected if present.

Status:
PASS

---

## TC-02 Trivy Filesystem Scan

Objective:
Scan source code.

Expected Result:
JSON report generated.

Status:
PASS

---

## TC-03 Backend Image Scan

Expected:
backend-report.json generated.

Status:
PASS

---

## TC-04 Frontend Image Scan

Expected:
frontend-report.json generated.

Status:
PASS

---

## TC-05 Admin Image Scan

Expected:
admin-report.json generated.

Status:
PASS

---

## TC-06 Report Generator

Expected:
summary-report.json
consolidated-report.html

Status:
PASS

---

## TC-07 Slack Notification

Expected:
Security alert appears in Slack.

Status:
PASS

---

## TC-08 Email Notification

Expected:
Email received.

Status:
PASS

---

## TC-09 Retry Logic

Expected:
Command retries automatically.

Status:
PASS

---

## TC-10 .trivyignore

Expected:
Ignored CVEs excluded.

Status:
PASS

---

## TC-11 GitHub Actions

Expected:
Pipeline completes successfully.

Status:
PASS

---

# Overall Result

All mandatory project requirements completed successfully.

Overall Status

PASS