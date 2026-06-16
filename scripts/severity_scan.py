import subprocess

subprocess.run([
    "trivy",
    "image",
    "--severity",
    "CRITICAL,HIGH",
    "shopnow-backend:v1"
])