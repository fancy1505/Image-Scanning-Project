import subprocess

image = input("Enter Docker image name: ")

filename = image.replace(":", "_")

subprocess.run([
    "trivy",
    "image",
    "-f",
    "json",
    "-o",
    f"reports/{filename}.json",
    image
])

print(f"Scan completed for {image}")