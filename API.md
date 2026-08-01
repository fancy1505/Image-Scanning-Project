# API Documentation

## ScanGuard AI – DevSecOps Security Command Center

---

# 1. Overview

The ScanGuard AI platform aggregates security data from multiple tools and exposes it to the dashboard through structured JSON reports and monitoring endpoints.

The current implementation primarily uses JSON files as the data source. Future releases may expose RESTful APIs for external integrations.

---

# 2. Architecture

```
GitHub Actions
      │
      ▼
Security Tools
      │
      ▼
JSON Reports
      │
      ▼
Python Processing
      │
      ▼
Dashboard
      │
      ▼
Prometheus Metrics
```

---

# 3. Current Data Sources

| Source | Format | Consumer |
|---------|--------|----------|
| Trivy Filesystem Report | JSON | Dashboard |
| Trivy Image Report | JSON | Dashboard |
| GitLeaks Report | JSON | Dashboard |
| SonarCloud Metrics | JSON / API | Dashboard |
| AI Analysis | JSON | Dashboard |
| Prometheus Metrics | HTTP | Grafana |

---

# 4. Directory Structure

```
reports/
│
├── trivy-fs-report.json
├── shopnow-backend_v1.json
├── shopnow-frontend_v1.json
├── shopnow-admin_v1.json
├── consolidated-report.html

mock-data/
│
├── ai/
├── security/
├── dashboard/
```

---

# 5. Report Formats

## Trivy Report

Contains:

- Target
- Vulnerabilities
- Severity
- Package Name
- Installed Version
- Fixed Version
- CVE ID

Example:

```json
{
  "Target": "shopnow-backend",
  "Vulnerabilities": [
    {
      "VulnerabilityID": "CVE-2025-12345",
      "PkgName": "openssl",
      "Severity": "HIGH"
    }
  ]
}
```

---

## GitLeaks Report

Contains:

- Rule ID
- Description
- File
- Commit
- Secret Type

Example:

```json
{
  "Description": "GitHub Token",
  "File": "config.py",
  "RuleID": "github-pat"
}
```

---

## SonarCloud Metrics

Collected metrics include:

- Bugs
- Vulnerabilities
- Code Smells
- Reliability Rating
- Security Rating
- Quality Gate Status

Example:

```json
{
  "bugs": 3,
  "vulnerabilities": 22,
  "code_smells": 19
}
```

---

# 6. Dashboard Data Flow

```
Security Reports
        │
        ▼
Python Processing
        │
        ▼
JSON Transformation
        │
        ▼
React Dashboard
```

---

# 7. Metrics Endpoint

The Python exporter exposes Prometheus-compatible metrics.

Default endpoint:

```
http://localhost:8000/metrics
```

Example metrics:

```
trivy_critical_vulnerabilities 8
trivy_high_vulnerabilities 120
trivy_medium_vulnerabilities 70
trivy_low_vulnerabilities 78
```

---

# 8. Grafana Integration

Grafana retrieves metrics from Prometheus.

```
Grafana
    │
    ▼
Prometheus
    │
    ▼
Python Exporter
    │
    ▼
Security Reports
```

---

# 9. Dashboard JSON Contracts

The React dashboard consumes structured JSON containing:

- Security Score
- Risk Level
- Severity Counts
- Pipeline Status
- Report Coverage
- Deployment Recommendation

These JSON files are stored in the project and updated after pipeline execution.

---

# 10. Future REST APIs

Future versions may expose REST endpoints such as:

| Endpoint | Description |
|-----------|-------------|
| GET /api/dashboard | Dashboard summary |
| GET /api/vulnerabilities | Vulnerability details |
| GET /api/pipeline | Pipeline status |
| GET /api/reports | Security reports |
| GET /api/metrics | Aggregated metrics |

> **Note:** These endpoints are planned for future implementation and are not available in the current version.

---

# 11. Error Handling

Current implementation validates:

- Missing report files
- Invalid JSON
- Empty scan results
- Failed pipeline execution

Errors are logged for troubleshooting and surfaced in the dashboard where applicable.

---

# 12. Security Considerations

Current implementation:

- Read-only report consumption
- Local JSON processing
- No authentication required
- No external API exposure

Future improvements:

- JWT authentication
- Role-Based Access Control (RBAC)
- HTTPS
- API rate limiting
- Audit logging

---

# 13. Conclusion

The current ScanGuard AI platform exchanges data through structured JSON reports and Prometheus metrics, providing a lightweight and extensible integration model for the dashboard. The architecture also lays the foundation for introducing REST APIs in future releases as the platform evolves.
