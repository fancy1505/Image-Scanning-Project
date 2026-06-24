import json
import os
import requests


WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")

if not WEBHOOK_URL:
    raise Exception("SLACK_WEBHOOK_URL secret not configured")

with open("reports/summary-report.json", "r") as f:
    data = json.load(f)

message = "*Container Vulnerability Scan Summary*\n\n"

for report, values in data.items():
    message += (
        f"📄 {report}\n"
        f"🔴 Critical: {values.get('CRITICAL', 0)}\n"
        f"🟠 High: {values.get('HIGH', 0)}\n\n"
    )

response = requests.post(
    WEBHOOK_URL,
    json={"text": message}
)

print("Slack notification sent.")S
print("Status:", response.status_code)
print("Response:", response.text)