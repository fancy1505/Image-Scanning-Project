import subprocess
import os

images = [
    "shopnow-backend:v1",
    "shopnow-frontend:v1",
    "shopnow-admin:v1"
]

os.makedirs("reports", exist_ok=True)

for image in images:
    filename = image.replace(":", "_")

    print(f"\nScanning {image}...")

    result = subprocess.run([
        "trivy",
        "image",
        "-f",
        "json",
        "-o",
        f"reports/{filename}.json",
        image
    ])

    if result.returncode == 0:
        print(f"Generated reports/{filename}.json")
    else:
        print(f"Failed scanning {image}")

print("\nAll scans completed")