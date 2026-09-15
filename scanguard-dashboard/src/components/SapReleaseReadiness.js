function StatusBadge({ status }) {
  const normalizedStatus = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`sap-status-badge ${normalizedStatus}`}>
      {status}
    </span>
  );
}

function CheckCard({ label, value }) {
  return (
    <article className="sap-check-card">
      <span>{label}</span>
      <StatusBadge status={value} />
    </article>
  );
}

function SapReleaseReadiness({ data }) {
  if (!data) {
    return null;
  }

  const {
    transport,
    quality,
    security,
    integration,
    validation,
    operations,
    risk,
    ai_recommendation: aiRecommendation,
  } = data;

  return (
    <section className="sap-release-section">
      <div className="panel-heading">
        <div>
          <div className="section-eyebrow">
            SAP ATTP DevSecOps
          </div>

          <h3>Release Readiness Command Center</h3>

          <p className="section-description">
            Evidence-based assessment of SAP transport,
            security, quality, integration, validation and
            operational readiness.
          </p>
        </div>

        <div className="sap-release-score">
          <span>Release Score</span>
          <strong>{risk.score}/100</strong>
          <small>{risk.level} RISK</small>
        </div>
      </div>

      <div className="sap-transport-banner">
        <div>
          <span className="sap-label">TRANSPORT</span>
          <strong>{transport.request}</strong>
        </div>

        <div>
          <span className="sap-label">SYSTEM</span>
          <strong>
            {transport.source_system} → {transport.target_system}
          </strong>
        </div>

        <div>
          <span className="sap-label">TYPE</span>
          <strong>{transport.type}</strong>
        </div>

        <div>
          <span className="sap-label">ACTIVECONTROL</span>
          <StatusBadge status={transport.activecontrol_status} />
        </div>
      </div>

      <div className="sap-check-grid">
        <CheckCard
          label="ATC / Code Quality"
          value={quality.atc_status}
        />

        <CheckCard
          label="Sonar Analysis"
          value={quality.sonar_status}
        />

        <CheckCard
          label="Security"
          value={security.status}
        />

        <CheckCard
          label="Authorization Impact"
          value={security.authorization_impact}
        />

        <CheckCard
          label="AIF / Interface Impact"
          value={integration.aif_impact}
        />

        <CheckCard
          label="SIT"
          value={validation.sit_status}
        />

        <CheckCard
          label="UAT"
          value={validation.uat_status}
        />

        <CheckCard
          label="Regression"
          value={validation.regression_status}
        />

        <CheckCard
          label="CAB"
          value={validation.cab_status}
        />

        <CheckCard
          label="New Relic Health"
          value={operations.new_relic_health}
        />

        <CheckCard
          label="Background Jobs"
          value={operations.background_jobs}
        />

        <CheckCard
          label="User Lock Status"
          value={operations.user_lock_status}
        />
      </div>

      <div className="sap-ai-decision">
        <div className="sap-ai-heading">
          <div>
            <div className="section-eyebrow">
              AI RELEASE INTELLIGENCE
            </div>

            <h4>AI Recommendation</h4>
          </div>

          <div className="sap-ai-decision-badge">
            {aiRecommendation.decision}
          </div>
        </div>

        <p className="sap-ai-summary">
          {aiRecommendation.summary}
        </p>

        <div className="sap-ai-reason">
          <strong>Why?</strong>
          <span>{aiRecommendation.reason}</span>
        </div>

        <div className="sap-next-actions">
          <strong>Recommended next actions</strong>

          <ul>
            {aiRecommendation.next_actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>

        <div className="sap-confidence">
          AI confidence: <strong>{risk.confidence}%</strong>
        </div>
      </div>
    </section>
  );
}

export default SapReleaseReadiness;