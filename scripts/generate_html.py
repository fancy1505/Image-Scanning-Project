import subprocess

subprocess.run([
    "trivy",
    "image",
    "--format",
    "template",
    "--template",
    "@html.tpl",
    "-o",
    "reports/shopnow-backend.html",
    "shopnow-backend:v1"
])

print("HTML report generated successfully")