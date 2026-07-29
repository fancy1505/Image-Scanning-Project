# Container Image Vulnerability Scanner with Reporting

## Project Overview

Containerized applications are widely used in modern DevOps environments. However, vulnerable container images can introduce security risks into production systems.

This project implements an automated **Container Image Vulnerability Scanner** using **Trivy** to scan Docker images, detect known vulnerabilities from CVE databases, and generate detailed reports.

The project uses the **ShopNow E-Commerce Application** as the target application for vulnerability assessment.

---

## Sprint 1 Goal

The objective of Sprint 1 was to establish the foundation of the vulnerability scanning solution by:

* Setting up the project repository structure
* Installing and configuring Trivy
* Building Docker images for the ShopNow application
* Performing single-image and multi-image vulnerability scans
* Generating JSON and HTML vulnerability reports
* Exploring CVE-based vulnerability detection
* 
<img width="947" height="529" alt="image" src="https://github.com/user-attachments/assets/b081fece-2e14-44c2-972a-3bd0478f609b" />
<img width="1773" height="719" alt="image" src="https://github.com/user-attachments/assets/2167e7d3-66b4-49bb-906f-dfda2b751e42" />
<img width="885" height="1153" alt="image" src="https://github.com/user-attachments/assets/63da1405-0d27-4e25-919c-89e6c3a2a87d" />
<img width="889" height="1126" alt="image" src="https://github.com/user-attachments/assets/9852e9a1-bdfa-4161-8937-1d58a1876219" />
<img width="900" height="393" alt="image" src="https://github.com/user-attachments/assets/d42e6b6c-a768-4e00-af7d-ba276712ba8c" />
# Multi-Image Scan Execution
<img width="933" height="398" alt="image" src="https://github.com/user-attachments/assets/4545616a-2d95-41ad-9a6e-02b6e1d3542b" />
<img width="1089" height="620" alt="image" src="https://github.com/user-attachments/assets/cbab891c-2eb9-410a-b7e7-bf473b9924e6" />


# JSON Reports Generated
<img width="963" height="460" alt="image" src="https://github.com/user-attachments/assets/84426abf-3f03-44ac-ab29-3d5ebf50538e" />
<img width="1010" height="819" alt="image" src="https://github.com/user-attachments/assets/b864cc28-5a2a-4658-ae42-33b5210bd35e" />
<img width="1017" height="878" alt="image" src="https://github.com/user-attachments/assets/9165c1ba-8c67-416c-b449-21cf12a01259" />

# Single-Image Scan Execution
<img width="1083" height="512" alt="image" src="https://github.com/user-attachments/assets/2febaeef-cd35-47e9-95c0-b01f57309a3e" />
<img width="878" height="450" alt="image" src="https://github.com/user-attachments/assets/6fe11f5d-2541-41e9-bab4-37c9a7b61f74" />







---

## Technologies Used

| Tool         | Purpose                  |
| ------------ | ------------------------ |
| Docker       | Container image creation |
| Trivy        | Vulnerability scanning   |
| Python       | Scan automation scripts  |
| CVE Database | Vulnerability detection  |
| GitHub       | Source code management   |

---

# Project Structure

```text
Container-Vulnerability-Scanner
│
├── docs
│   └── Sprint1_Report.md
│
├── images
│
├── reports
│   ├── shopnow-admin_v1.json
│   ├── shopnow-backend_v1.json
│   ├── shopnow-frontend_v1.json
│   └── shopnow-backend.html
│
├── scripts
│   ├── scan.py
│   ├── scan_single.py
│   ├── severity_scan.py
│   └── generate_html.py
│
├── shopNow
│
├── html.tpl
└── README.md
```

### Project Structure Screenshot

```markdown
![Project Structure](images/project-structure.png)
```

---

# ShopNow Application

The ShopNow E-Commerce Application was selected as the target application for vulnerability scanning.

Docker images built:

```text
shopnow-admin:v1
shopnow-backend:v1
shopnow-frontend:v1
```

### Docker Images Screenshot

```markdown
![Docker Images](images/docker-images.png)
```

---

# Single Image Vulnerability Scan

A Python script was created to scan individual Docker images using Trivy.

### Command

```bash
python scripts/scan_single.py
```

### Example Scan

```text
Enter Docker image name: shopnow-backend:v1

INFO [vuln] Vulnerability scanning is enabled
INFO Detected OS family="alpine" version="3.21.3"

Scan completed for shopnow-backend:v1
```

### Screenshot

```markdown
![Single Image Scan](images/single-image-scan.png)
```

---

# Multi Image Vulnerability Scan

A Python automation script was developed to scan multiple Docker images sequentially.

### Command

```bash
python scripts/scan.py
```

### Output

```text
Scanning shopnow-backend:v1...
Generated reports/shopnow-backend_v1.json

Scanning shopnow-frontend:v1...
Generated reports/shopnow-frontend_v1.json

Scanning shopnow-admin:v1...
Generated reports/shopnow-admin_v1.json

All scans completed
```

### Screenshot

```markdown
![Multi Image Scan](images/multi-image-scan.png)
```

---

# CVE-Based Vulnerability Detection

Trivy integrates with vulnerability databases and scans:

* Operating System packages
* Application dependencies
* Language-specific packages
* Known CVEs

During scanning, Trivy detected:

* Alpine Linux vulnerabilities
* Package vulnerabilities
* Dependency vulnerabilities

Example:

```text
Detected OS family="alpine"
Detecting vulnerabilities...
```

---

# Generated JSON Reports

The scanner generates machine-readable JSON reports for further analysis.

Generated reports:

```text
shopnow-admin_v1.json
shopnow-backend_v1.json
shopnow-frontend_v1.json
```

### Screenshot

```markdown
![Generated Reports](images/generated-reports.png)
```

---

# HTML Vulnerability Report

An HTML report was generated for easier visualization of vulnerabilities.

### Features

* Vulnerability summary
* Severity classification
* CVE IDs
* Package details
* Fix recommendations

### Screenshot

```markdown
![HTML Report](images/html-report.png)
```

---

# Sprint 1 Achievements

### Completed Tasks

* Repository setup completed
* Folder structure created
* Trivy installed and configured
* ShopNow Docker images built
* Single image scanning implemented
* Multi-image scanning implemented
* CVE-based vulnerability detection verified
* JSON reports generated
* HTML report generated
* Sprint 1 documentation completed

---

# Results

Successfully scanned the following ShopNow images:

```text
shopnow-backend:v1
shopnow-frontend:v1
shopnow-admin:v1
```

Generated:

* JSON vulnerability reports
* HTML vulnerability report
* CVE-based vulnerability analysis

The Sprint 1 objective of establishing a functional container vulnerability scanning framework was successfully achieved.

---

# Future Enhancements (Sprint 2)

* GitHub Actions integration
* CI/CD pipeline scanning
* Build failure on HIGH/CRITICAL vulnerabilities
* Configurable severity thresholds
* Automated scanning on every code push

---

# Author

**Fancy Kejriwal &Rahul**

Container Image Vulnerability Scanner with Reporting – Sprint 1 Submission

---

After creating the screenshots, place them in the `images/` folder and this README will render nicely on GitHub.
