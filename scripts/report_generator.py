import json
import os

REPORTS = [
    "reports/shopnow-backend_v1.json",
    "reports/shopnow-frontend_v1.json",
    "reports/shopnow-admin_v1.json",
    "reports/trivy-fs-report.json"
]

summary = {}

for report_file in REPORTS:

    if not os.path.exists(report_file):
        continue

    high = 0
    critical = 0

    try:
        with open(report_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        for result in data.get("Results", []):
            for vuln in result.get("Vulnerabilities", []):
                severity = vuln.get("Severity", "")

                if severity == "HIGH":
                    high += 1
                elif severity == "CRITICAL":
                    critical += 1

        summary[os.path.basename(report_file)] = {
            "HIGH": high,
            "CRITICAL": critical
        }

    except Exception as e:
        print(f"Error processing {report_file}: {e}")

with open("reports/summary-report.json", "w") as outfile:
    json.dump(summary, outfile, indent=4)

html = """
<html>
<head>
<title>Container Security Report</title>
<style>
body {font-family: Arial;}
table {border-collapse: collapse;}
td, th {border: 1px solid black; padding: 8px;}
</style>
</head>
<body>
<h1>Container Vulnerability Report</h1>
<table>
<tr>
<th>Report</th>
<th>HIGH</th>
<th>CRITICAL</th>
</tr>
"""

for report, values in summary.items():
    html += f"""
    <tr>
        <td>{report}</td>
        <td>{values['HIGH']}</td>
        <td>{values['CRITICAL']}</td>
    </tr>
    """

html += """
</table>
</body>
</html>
"""

with open("reports/consolidated-report.html", "w") as f:
    f.write(html)

print("Reports generated successfully.")