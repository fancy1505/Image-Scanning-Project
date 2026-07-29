# 🚀 INSTALLATION.md

# Installing ScanGuard AI

> **Project:** ScanGuard AI – DevSecOps Security Command Center  
> **Version:** 1.0.0

---

# Table of Contents

1. System Requirements
2. Software Prerequisites
3. Clone the Repository
4. Project Structure
5. Backend Setup
6. Frontend Setup
7. Docker Setup
8. Configure SonarCloud
9. Configure GitHub Actions
10. Configure Trivy
11. Configure GitLeaks
12. Configure Prometheus
13. Configure Grafana
14. Running the Application
15. Verifying the Installation
16. Troubleshooting

---

# 1. System Requirements

Recommended development environment:

| Component | Requirement |
|-----------|-------------|
| Operating System | Windows 11 / Ubuntu 22.04 / macOS |
| RAM | 8 GB (16 GB recommended) |
| CPU | Dual Core or better |
| Disk Space | 5 GB free |
| Internet | Required for SonarCloud and GitHub Actions |

---

# 2. Software Prerequisites

Install the following tools before starting.

| Software | Recommended Version |
|----------|---------------------|
| Git | Latest |
| Node.js | 18.x or later |
| npm | Latest |
| Python | 3.12+ |
| Docker Desktop | Latest |
| GitHub Account | Required |
| SonarCloud Account | Required |
| Prometheus | Latest |
| Grafana | Latest |

Verify the installation:

```bash
git --version

node --version
npm --version
python --version
docker --version
```
<img width="2760" height="1586" alt="image" src="https://github.com/user-attachments/assets/76ce6fdf-f285-4da3-a1b7-7da2b1a47a6c" />
<img width="2277" height="1370" alt="image" src="https://github.com/user-attachments/assets/66644149-85c4-4240-8481-3cc0b215beaf" />

---

# 3. Clone the Repository

Clone the project:

```bash
git clone https://github.com/fancy1505/Image-Scanning-Project.git
```

Navigate to the project:

```bash
cd Image-Scanning-Project
```

---

# 4. Project Structure



---<img width="2047" height="1597" alt="image" src="https://github.com/user-attachments/assets/c636c7b8-8568-437e-9b85-5523f91d959c" />
<img width="2722" height="1620" alt="image" src="https://github.com/user-attachments/assets/15bdf13b-e73e-467e-bc36-8c361ff7c349" />

<img width="2877" height="1602" alt="image" src="https://github.com/user-attachments/assets/5618c976-f0bf-4bd8-8a80-1f8d13320c41" />
<img width="2817" height="1676" alt="image" src="https://github.com/user-attachments/assets/2d8abc6d-b716-48af-b86b-f1cf0edfefb9" />



# 5. Backend Setup

Create a Python virtual environment.

Windows:

```bash
python -m venv venv
venv\Scripts\activate
# <img width="2049" height="220" alt="image" src="https://github.com/user-attachments/assets/9fe0d11a-9b92-4b82-83ad-9cc55168f6b0" />


Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 6. Frontend Setup

Navigate to the dashboard:

```bash
cd dashboard
```
<img width="2848" height="1599" alt="image" src="https://github.com/user-attachments/assets/1a68ba40-17d8-41a9-8494-71f6aaa939f4" />
<img width="2868" height="1590" alt="image" src="https://github.com/user-attachments/assets/aaa38d98-7da5-439f-9a7c-275425570bb1" />


Install packages:

```bash
npm install
```

Start the development server:

```bash
npm start

<img width="1206" height="713" alt="image" src="https://github.com/user-attachments/assets/3a6c6340-04ad-4556-a30a-5cb6b4809529" />
```

The dashboard will typically be available at:

```text
http://localhost:3000
```
<img width="2875" height="1595" alt="image" src="https://github.com/user-attachments/assets/f633832d-3e27-4d17-b103-a42c22d5f9b0" />


---

# 7. Docker Setup

Build the demonstration application images.

Backend:

```bash
docker build -t shopnow-backend:v1 ./shopNow/backend
```

Frontend:

```bash
docker build -t shopnow-frontend:v1 ./shopNow/frontend
```

Admin:

```bash
docker build -t shopnow-admin:v1 ./shopNow/admin
```

Verify the images:

```bash
docker images
<img width="1183" height="615" alt="image" src="https://github.com/user-attachments/assets/d76b74fc-4705-49f6-81ec-8ac5a311bcda" />

<img width="1188" height="399" alt="image" src="https://github.com/user-attachments/assets/b8f1bbee-e47b-4860-9fb6-65d863ff3307" />

<img width="1121" height="826" alt="image" src="https://github.com/user-attachments/assets/7047685e-3a4b-4a35-8ace-2817c7b81f7d" />

---

# 8. Configure SonarCloud

Create a project in SonarCloud.

Update `sonar-project.properties` with:

```properties
sonar.projectKey=<your-project-key>
sonar.organization=<your-organization>
sonar.projectName=ScanGuardAI
sonar.sources=shopNow,scripts
```

Add the following GitHub repository secret:

| Secret | Description |
|--------|-------------|
| SONAR_TOKEN | SonarCloud access token |

---

# 9. Configure GitHub Actions

Navigate to:

```text
.github/workflows/
```

The security workflow automates:

- Source checkout
- Secret scanning
- Static analysis
- Docker image build
- Trivy scans
- Report generation
- AI analysis

Repository secrets to configure:

| Secret | Purpose |
|--------|---------|
| SONAR_TOKEN | SonarCloud authentication |
| GITHUB_TOKEN | GitHub Actions authentication |

---

# 10. Configure Trivy

Install Trivy following the official installation guide for your operating system.

Verify the installation:

```bash
trivy --version
```
<img width="2396" height="760" alt="image" src="https://github.com/user-attachments/assets/b77b4145-5471-4684-ba18-922ad6ede22e" />

Example filesystem scan:

```bash
trivy fs .
```

Example image scan:

```bash
trivy image shopnow-backend:v1
```

Reports generated by the project are stored in the `reports/` directory.
<img width="1238" height="715" alt="image" src="https://github.com/user-attachments/assets/ece7a442-c94b-4744-b65f-755c130bae0c" />


---

# 11. Configure GitLeaks

Install GitLeaks and verify it:

```bash
gitleaks version
```

Run a manual repository scan:

```bash
gitleaks detect --source .
<img width="1240" height="421" alt="image" src="https://github.com/user-attachments/assets/74661f20-62fd-4ec5-9120-582f964ba12c" />
<img width="1246" height="551" alt="image" src="https://github.com/user-attachments/assets/c317a3c9-14ed-442d-a09e-68ba0dd18d92" />

```

In normal usage, GitLeaks is executed automatically by the GitHub Actions workflow.
<img width="2063" height="258" alt="image" src="https://github.com/user-attachments/assets/2ff02f13-abbb-4873-a22d-0fde425dd22e" />

<img width="2848" height="1640" alt="image" src="https://github.com/user-attachments/assets/2e698975-cec4-45de-a932-d90316548105" />

---

# 12. Configure Prometheus

Start the Python metrics exporter:

```bash
python metrics/vulnerability_metrics.py
```

By default, metrics are exposed at:

```text
http://localhost:8000/metrics
```

Update `prometheus.yml` to scrape the exporter:

```yaml
scrape_configs:
  - job_name: "scanguard-ai"
    static_configs:
      - targets:
          - localhost:8000
```

Start Prometheus:

```bash
prometheus --config.file=prometheus.yml
```

Open:

```text
http://localhost:9090
```
<img width="2877" height="472" alt="image" src="https://github.com/user-attachments/assets/78295ef5-a98b-44fb-8bd6-83bfdb720744" />
<img width="2733" height="1629" alt="image" src="https://github.com/user-attachments/assets/1009e66e-79cb-4484-8ef1-d64e7626fd17" />
---

# 13. Configure Grafana

Start Grafana and sign in using your configured credentials.

Add Prometheus as a data source.

Import your ScanGuard AI dashboard JSON.

Open:

```text
http://localhost:3000
```

Verify that panels display:

- Vulnerability counts
- Severity distribution
- SonarCloud metrics
- GitLeaks metrics
- Pipeline status

---

# 14. Running the Application

Run the React dashboard:

```bash
cd dashboard
npm start
```

Start the metrics exporter:

```bash
python metrics/vulnerability_metrics.py
<img width="1367" height="1163" alt="image" src="https://github.com/user-attachments/assets/b4b82122-8c9b-4c26-959f-ec1b52b57822" />

```
<img width="1669" height="963" alt="image" src="https://github.com/user-attachments/assets/479f24b2-c10e-4575-b524-57c10b79c61c" />

Run Prometheus:

```bash
prometheus --config.file=prometheus.yml
```

Start Grafana.

Execute the GitHub Actions pipeline by pushing a change to the repository or manually triggering the workflow.
<img width="1433" height="759" alt="image" src="https://github.com/user-attachments/assets/d599c2c8-3dbb-493d-aa31-0649e98a5bee" />
<img width="1317" height="892" alt="image" src="https://github.com/user-attachments/assets/b31151f4-0cdf-434d-9805-509d3944e802" />

---

# 15. Verifying the Installation

Successful installation should result in:

- GitHub Actions workflow completes successfully.
- Docker images are created.
- Trivy reports are generated.
- GitLeaks report is available.
- SonarCloud analysis completes.
- Prometheus scrapes metrics.
- Grafana displays dashboards.
- React dashboard loads security data.
- AI recommendations are visible.

---

# 16. Troubleshooting

## Docker build fails

- Ensure Docker Desktop is running.
- Verify the image paths.
- Confirm Dockerfiles exist in each application directory.

---

## SonarCloud authentication fails

- Check the `SONAR_TOKEN` repository secret.
- Verify the project key and organization in `sonar-project.properties`.

---

## Trivy not found

- Confirm Trivy is installed.
- Ensure it is available in your system `PATH`.

---

## GitLeaks not found

- Verify the installation.
- Confirm the executable is available from the command line.

---

## Dashboard displays no data

- Confirm that the pipeline has generated reports.
- Verify JSON report paths.
- Ensure the dashboard is reading the correct files.

---

## Prometheus metrics unavailable

- Verify that the Python exporter is running.
- Check `http://localhost:8000/metrics`.
- Confirm the Prometheus scrape configuration.

---

# Installation Complete 🎉

Your ScanGuard AI environment is now ready.

You can:

- Execute automated DevSecOps pipelines
- Scan applications for vulnerabilities
- Generate executive security reports
- Monitor metrics in Grafana
- Review AI-powered security recommendations
- Evaluate release readiness through the ScanGuard AI dashboard
- <img width="2702" height="1559" alt="image" src="https://github.com/user-attachments/assets/1bfd676a-dc46-4a6e-90ce-0b7edac1e3a1" />
