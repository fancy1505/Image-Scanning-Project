const BASELINE = {
  critical: 12,
  high: 180,
  medium: 236,
  low: 316,
};

const remediationActions = [
  {
    title: "Automated Container Scanning",
    tool: "Trivy",
    description:
      "Added filesystem and Docker image scanning to detect operating-system and application-package vulnerabilities.",
  },
  {
    title: "Secret Detection",
    tool: "GitLeaks",
    description:
      "Added automated secret scanning to identify credentials, tokens, and sensitive values before release.",
  },
  {
    title: "Static Code Analysis",
    tool: "SonarCloud",
    description:
      "Integrated code-quality and security analysis with quality-gate visibility.",
  },
  {
    title: "CI/CD Security Checks",
    tool: "GitHub Actions",
    description:
      "Added repeatable security checks during the pipeline rather than relying only on manual scans.",
  },
  {
    title: "Operational Monitoring",
    tool: "Prometheus and Grafana",
    description:
      "Published security metrics and created monitoring panels for vulnerability and pipeline visibility.",
  },
  {
    title: "AI Risk Analysis",
    tool: "ScanGuard AI Analyzer",
    description:
      "Added explainable security scoring, release readiness, business impact, and prioritized recommendations.",
  },
  {
    title: "Security Notifications",
    tool: "Email and Slack",
    description:
      "Added automated notification channels so security findings and release decisions can reach stakeholders.",
  },
];

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function SeverityRow({ label, before, after }) {
  const resolved = Math.max(before - after, 0);
  const increased = Math.max(after - before, 0);

  return (
    <div className="improvement-row">
      <div className="improvement-severity">
        <span className={`severity-dot ${label.toLowerCase()}`} />
        <strong>{label}</strong>
      </div>

      <div className="improvement-value before-value">{before}</div>

      <div className="improvement-arrow">→</div>

      <div className="improvement-value after-value">{after}</div>

      <div
        className={`improvement-result ${
          increased > 0 ? "result-increased" : "result-resolved"
        }`}
      >
        {resolved > 0 && `${resolved} reduced`}
        {increased > 0 && `${increased} increased`}
        {resolved === 0 && increased === 0 && "No change"}
      </div>
    </div>
  );
}

function SecurityImprovementJourney({
  vulnerabilitySummary = {},
  securityScore = 0,
  previousScore,
}) {
  const current = {
    critical: numberValue(vulnerabilitySummary.critical),
    high: numberValue(vulnerabilitySummary.high),
    medium: numberValue(vulnerabilitySummary.medium),
    low: numberValue(vulnerabilitySummary.low),
  };

  const baselineTotal = Object.values(BASELINE).reduce(
    (total, value) => total + value,
    0
  );

  const currentTotal =
    numberValue(vulnerabilitySummary.total) ||
    Object.values(current).reduce((total, value) => total + value, 0);

  const netReduction = baselineTotal - currentTotal;
  const reductionPercentage =
    baselineTotal > 0
      ? Math.round((netReduction / baselineTotal) * 100)
      : 0;

  const hasImproved = netReduction > 0;

  return (
    <section className="improvement-section">
      <div className="panel-heading">
        <div>
          <div className="section-eyebrow">Remediation Evidence</div>
          <h3>Security Improvement Journey</h3>
          <p className="section-description">
            Initial baseline compared with the latest synchronized security
            analysis.
          </p>
        </div>

        <span
          className={`improvement-badge ${
            hasImproved ? "improved" : "attention"
          }`}
        >
          {hasImproved ? "Risk Reduced" : "Requires Attention"}
        </span>
      </div>

      <div className="comparison-header">
        <span>Severity</span>
        <span>Before</span>
        <span />
        <span>Current</span>
        <span>Measured Change</span>
      </div>

      <div className="comparison-table">
        <SeverityRow
          label="Critical"
          before={BASELINE.critical}
          after={current.critical}
        />
        <SeverityRow
          label="High"
          before={BASELINE.high}
          after={current.high}
        />
        <SeverityRow
          label="Medium"
          before={BASELINE.medium}
          after={current.medium}
        />
        <SeverityRow
          label="Low"
          before={BASELINE.low}
          after={current.low}
        />
      </div>

      <div className="improvement-metrics">
        <article>
          <span>Baseline Findings</span>
          <strong>{baselineTotal}</strong>
        </article>

        <article>
          <span>Current Findings</span>
          <strong>{currentTotal}</strong>
        </article>

        <article>
          <span>Net Change</span>
          <strong className={hasImproved ? "metric-good" : "metric-danger"}>
            {netReduction > 0 ? `-${netReduction}` : `+${Math.abs(netReduction)}`}
          </strong>
        </article>

        <article>
          <span>Risk Reduction</span>
          <strong className={hasImproved ? "metric-good" : "metric-danger"}>
            {hasImproved ? `${reductionPercentage}%` : "0%"}
          </strong>
        </article>

        <article>
          <span>Security Score</span>
          <strong>
            {previousScore ?? "N/A"} → {securityScore}
          </strong>
        </article>
      </div>

      <div className="remediation-heading">
        <div>
          <div className="section-eyebrow">Engineering Work</div>
          <h3>Security Controls Implemented</h3>
        </div>

        <p>
          These items describe verified project capabilities. They do not claim
          that every detected CVE has been remediated.
        </p>
      </div>

      <div className="remediation-grid">
        {remediationActions.map((action) => (
          <article className="remediation-card" key={action.title}>
            <div className="remediation-card-header">
              <span className="control-check">✓</span>
              <div>
                <h4>{action.title}</h4>
                <span>{action.tool}</span>
              </div>
            </div>

            <p>{action.description}</p>
          </article>
        ))}
      </div>

      <div className="evidence-note">
        <strong>Evidence rule:</strong> vulnerability reductions are calculated
        from scan data. Tool integrations are shown separately as implemented
        security controls.
      </div>
    </section>
  );
}

export default SecurityImprovementJourney;