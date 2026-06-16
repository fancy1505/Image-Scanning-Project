\# Sprint 1: Initial Setup and Basic Vulnerability Scanning



\## Objective



Set up a container image vulnerability scanning solution using Trivy and validate scanning on Docker images.



\## Application



ShopNow E-Commerce Application



\## Docker Images Built



\- shopnow-backend:v1

\- shopnow-frontend:v1

\- shopnow-admin:v1



\## Tools Used



\- Docker

\- Trivy

\- Python



\## Activities Completed



1\. Cloned ShopNow application.

2\. Built Docker images.

3\. Installed Trivy.

4\. Performed single image scan.

5\. Performed multi-image scan.

6\. Generated JSON reports.

7\. Generated HTML report.

8\. Explored CVE database integration.



\## Findings



\- Backend image uses Alpine 3.21.3.

\- Frontend image uses Alpine 3.17.7.

\- Admin image uses Alpine 3.17.7.

\- Alpine 3.17.7 is no longer supported.

\- Vulnerability scanning successfully identified security risks.



\## Deliverables



\- Single image scanner

\- Multi image scanner

\- JSON reports

\- HTML report

\- Vulnerability summary

\# Container Image Vulnerability Scanner with Reporting



\## Sprint 1 Features



\- ShopNow Docker image scanning

\- Single Image Scan

\- Multi Image Scan

\- JSON Report Generation

\- HTML Report Generation

\- CVE Detection using Trivy



\## Run



\### Single Scan



```bash

python scripts/scan\_single.py

```



\### Multi Scan



```bash

python scripts/scan.py

```



\### HTML Report



```bash

python scripts/generate\_html.py

```



\## Images Scanned



\- shopnow-backend:v1

\- shopnow-frontend:v1

\- shopnow-admin:v1

