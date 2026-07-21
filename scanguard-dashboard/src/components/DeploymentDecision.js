function getDecision(releaseReadiness) {
  if (releaseReadiness === "READY") {
    return {
      value: "APPROVED",
      className: "approved",
      description:
        "Security checks passed and the deployment can proceed.",
    };
  }

  if (releaseReadiness === "BLOCK RELEASE") {
    return {
      value: "REJECTED",
      className: "rejected",
      description:
        "Release blocked because the current security risk exceeds the deployment threshold.",
    };
  }

  return {
    value: "REQUIRES REVIEW",
    className: "review",
    description:
      "Manual security review and risk acceptance are required.",
  };
}

function DeploymentDecision({ releaseReadiness }) {
  const decision = getDecision(releaseReadiness);

  return (
    <section className={`decision-card ${decision.className}`}>
      <div>
        <div className="section-eyebrow">Deployment Decision</div>
        <h2>{decision.value}</h2>
        <p>{decision.description}</p>
      </div>

      <div className="release-status">
        <span>Analyzer status</span>
        <strong>{releaseReadiness || "UNKNOWN"}</strong>
      </div>
    </section>
  );
}

export default DeploymentDecision;