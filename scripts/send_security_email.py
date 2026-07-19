import os
import smtplib
import sys
from email.message import EmailMessage


def get_required_variable(name: str) -> str:
    value = os.getenv(name, "").strip()

    if not value:
        raise ValueError(f"Missing required environment variable: {name}")

    return value


def main() -> int:
    try:
        smtp_username = get_required_variable("SMTP_USERNAME")
        smtp_password = get_required_variable("SMTP_APP_PASSWORD")
        recipient = get_required_variable("SECURITY_ALERT_EMAIL")

        pipeline_status = os.getenv("PIPELINE_STATUS", "unknown").upper()
        repository = os.getenv("GITHUB_REPOSITORY", "Local test")
        branch = os.getenv("GITHUB_REF_NAME", "Unknown")
        workflow = os.getenv("GITHUB_WORKFLOW", "Security Pipeline")
        run_number = os.getenv("GITHUB_RUN_NUMBER", "Unknown")
        actor = os.getenv("GITHUB_ACTOR", "Unknown")
        run_id = os.getenv("GITHUB_RUN_ID", "")
        server_url = os.getenv("GITHUB_SERVER_URL", "https://github.com")

        if run_id and repository != "Local test":
            run_url = (
                f"{server_url}/{repository}/actions/runs/{run_id}"
            )
        else:
            run_url = "Local email-notification test"

        passed = pipeline_status == "SUCCESS"
        status_text = "PASSED" if passed else "FAILED"

        message = EmailMessage()
        message["From"] = smtp_username
        message["To"] = recipient
        message["Subject"] = (
            f"[ScanGuard AI] Security Pipeline {status_text}"
        )

        message.set_content(
            f"""
ScanGuard AI Security Pipeline Report

Status: {status_text}
Repository: {repository}
Branch: {branch}
Workflow: {workflow}
Run number: {run_number}
Triggered by: {actor}

Workflow report:
{run_url}

Security Summary:
- Container image scanning completed
- Dependency security checks completed
- Security reports generated
- Review the GitHub Actions workflow for detailed results

This message was generated automatically by ScanGuard AI.
""".strip()
        )

        with smtplib.SMTP_SSL(
            "smtp.gmail.com",
            465,
            timeout=30,
        ) as smtp:
            smtp.login(smtp_username, smtp_password)
            smtp.send_message(message)

        print(f"Email notification sent successfully to {recipient}.")
        return 0

    except Exception as error:
        print(f"Email notification failed: {error}")
        return 1


if __name__ == "__main__":
    sys.exit(main())