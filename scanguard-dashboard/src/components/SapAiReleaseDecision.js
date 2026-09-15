function ReadinessItem({ label, status }) {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  const isReady =
    normalized.includes("pass") ||
    normalized.includes("passed") ||
    normalized.includes("approved") ||
    normalized.includes("ready") ||
    normalized.includes("healthy");

  return (
    <div className="sap-readiness-item">
      <div className={`sap-readiness-icon ${isReady ? "ready" : "review"}`}>
        {isReady ? "✓" : "!"}
      </div>

      <div>
        <span>{label}</span>
        <strong>{status}</strong>
      </div>
    </div>
  );
}

function SapAiReleaseDecision({ data }) {
  if (!data) return null;

  const {
    quality,
    security,
    integration,
    validation,
    operations,
    risk,
    ai_recommendation: aiRecommendation,
  } = data;

  return (
    <section className="sap-ai-release-decision">

      {/* Header */}
      <div className="sap-ai-decision-header">
        <div>
          <div className="section-eyebrow">
            SAP ATTP DEVSECOPS
          </div>

          <h3>AI Release Decision</h3>

          <p>
            AI-driven release governance based on technical,
            security, integration, validation and operational evidence.
          </p>
        </div>

        <div className="sap-ai-hold-badge">
          <span>RELEASE DECISION</span>
          <strong>{aiRecommendation.decision}</strong>
        </div>
      </div>

      {/* Decision Message */}
      <div className="sap-ai-decision-message">

        <div className="sap-decision-status">
          <div className="sap-decision-icon">
            !
          </div>

          <div>
            <span>RECOMMENDED ACTION</span>
            <strong>
              {aiRecommendation.decision} — DO NOT IMPORT YET
            </strong>
          </div>
        </div>

        <p>
          {aiRecommendation.summary}
        </p>

        <div className="sap-ai-why">
          <strong>Why?</strong>
          <span>{aiRecommendation.reason}</span>
        </div>

      </div>

      {/* Readiness Assessment */}
      <div className="sap-readiness-section">

        <h4>Release Readiness Assessment</h4>

        <div className="sap-readiness-grid">

          <ReadinessItem
            label="Technical Readiness"
            status={quality.atc_status}
          />

          <ReadinessItem
            label="Security Readiness"
            status={security.status}
          />

          <ReadinessItem
            label="Validation Readiness"
            status={validation.regression_status}
          />

          <ReadinessItem
            label="Operational Readiness"
            status={operations.new_relic_health}
          />

          <ReadinessItem
            label="Integration Readiness"
            status={integration.aif_impact}
          />

        </div>

      </div>

      {/* Decision Flow */}
      <div className="sap-decision-flow">

        <div className="flow-step">
          <span>Technical</span>
          <strong>✓ READY</strong>
        </div>

        <div className="flow-arrow">→</div>

        <div className="flow-step">
          <span>Security</span>
          <strong>✓ READY</strong>
        </div>

        <div className="flow-arrow">→</div>

        <div className="flow-step">
          <span>Validation</span>
          <strong>✓ READY</strong>
        </div>

        <div className="flow-arrow">→</div>

        <div className="flow-step warning">
          <span>Integration</span>
          <strong>⚠ REVIEW</strong>
        </div>

        <div className="flow-arrow">→</div>

        <div className="flow-final">
          <span>FINAL DECISION</span>
          <strong>{aiRecommendation.decision}</strong>
        </div>

      </div>

      {/* Recommended Actions */}
      <div className="sap-next-actions">

        <h4>Recommended Next Actions</h4>

        <ol>
          {aiRecommendation.next_actions.map((action, index) => (
            <li key={index}>
              {action}
            </li>
          ))}
        </ol>

      </div>

      {/* Confidence */}
      <div className="sap-ai-confidence">
        <span>AI Confidence</span>
        <strong>{risk.confidence}%</strong>
      </div>

    </section>
  );
}

export default SapAiReleaseDecision;