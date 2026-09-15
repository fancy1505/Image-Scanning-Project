function StatusBadge({ status }) {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`sap-status-badge ${normalized}`}>
      {status || "N/A"}
    </span>
  );
}

function RiskMetric({ label, value, status }) {
  return (
    <div className="transport-risk-metric">
      <span>{label}</span>

      {status ? (
        <StatusBadge status={status} />
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}

function SapTransportRisk({ data }) {
  if (!data) return null;

  const {
    transport,
    quality,
    security,
    integration,
    validation,
    operations,
    risk,
  } = data;

  return (
    <section className="sap-transport-risk">

      {/* Header */}
      <div className="transport-risk-header">
        <div>
          <div className="section-eyebrow">
            SAP ATTP DEVSECOPS
          </div>

          <h3>Transport Risk Assessment</h3>

          <p>
            Evidence-based technical and operational assessment
            before SAP transport deployment.
          </p>
        </div>

        <div className="transport-risk-score">
          <span>RISK SCORE</span>
          <strong>{risk.score}</strong>
          <small>{risk.level}</small>
        </div>
      </div>

      {/* Transport Identity */}
      <div className="transport-identity">

        <div>
          <span>TRANSPORT REQUEST</span>
          <strong>{transport.request}</strong>
        </div>

        <div>
          <span>TYPE</span>
          <strong>{transport.type}</strong>
        </div>

        <div>
          <span>OWNER</span>
          <strong>{transport.owner}</strong>
        </div>

        <div>
          <span>SOURCE</span>
          <strong>{transport.source_system}</strong>
        </div>

        <div className="transport-arrow">
          →
        </div>

        <div>
          <span>TARGET</span>
          <strong>{transport.target_system}</strong>
        </div>

      </div>

      {/* Technical Risk */}
      <div className="transport-risk-grid">

        <div className="risk-panel">

          <h4>Technical Quality</h4>

          <RiskMetric
            label="ATC"
            status={quality.atc_status}
          />

          <RiskMetric
            label="Sonar"
            status={quality.sonar_status}
          />

          <RiskMetric
            label="ATC Critical Findings"
            value={quality.atc_critical}
          />

          <RiskMetric
            label="ATC High Findings"
            value={quality.atc_high}
          />

          <RiskMetric
            label="ATC Medium Findings"
            value={quality.atc_medium}
          />

        </div>

        {/* Security */}
        <div className="risk-panel">

          <h4>Security</h4>

          <RiskMetric
            label="Security Gate"
            status={security.status}
          />

          <RiskMetric
            label="Authorization Impact"
            status={security.authorization_impact}
          />

          <RiskMetric
            label="Secrets Detected"
            value={security.secrets_detected}
          />

          <RiskMetric
            label="Critical Vulnerabilities"
            value={security.critical_vulnerabilities}
          />

        </div>

        {/* Integration */}
        <div className="risk-panel">

          <h4>AIF / Integration</h4>

          <RiskMetric
            label="AIF Impact"
            status={integration.aif_impact}
          />

          <RiskMetric
            label="Interfaces"
            value={integration.interface_count}
          />

          <RiskMetric
            label="Failed Messages"
            value={integration.failed_messages}
          />

          <RiskMetric
            label="Integration Status"
            status={integration.status}
          />

        </div>

        {/* Validation */}
        <div className="risk-panel">

          <h4>Release Validation</h4>

          <RiskMetric
            label="SIT"
            status={validation.sit_status}
          />

          <RiskMetric
            label="UAT"
            status={validation.uat_status}
          />

          <RiskMetric
            label="Regression"
            status={validation.regression_status}
          />

          <RiskMetric
            label="CAB"
            status={validation.cab_status}
          />

        </div>

      </div>

      {/* Operational Readiness */}
      <div className="operational-readiness">

        <h4>Operational Readiness</h4>

        <div className="operations-grid">

          <RiskMetric
            label="ActiveControl"
            status={transport.activecontrol_status}
          />

          <RiskMetric
            label="New Relic"
            status={operations.new_relic_health}
          />

          <RiskMetric
            label="Background Jobs"
            status={operations.background_jobs}
          />

          <RiskMetric
            label="User Lock"
            status={operations.user_lock_status}
          />

        </div>

      </div>

    </section>
  );
}

export default SapTransportRisk;