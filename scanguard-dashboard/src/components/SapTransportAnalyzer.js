import React, { useMemo, useState } from "react";

const StatusBadge = ({ status }) => {
  const normalized = String(status || "UNKNOWN").toUpperCase();

  let className = "sap-status-badge neutral";

  if (
    ["PASS", "PASSED", "READY", "HEALTHY", "APPROVED", "LOW"].includes(
      normalized
    )
  ) {
    className = "sap-status-badge success";
  }

  if (
    ["WARNING", "HOLD", "HIGH", "REVIEW", "MEDIUM"].includes(normalized)
  ) {
    className = "sap-status-badge warning";
  }

  if (
    ["FAIL", "FAILED", "BLOCK", "CRITICAL", "REJECTED", "DEGRADED"].includes(
      normalized
    )
  ) {
    className = "sap-status-badge danger";
  }

  return <span className={className}>{normalized}</span>;
};

const DomainCard = ({
  title,
  subtitle,
  status,
  icon,
  metrics,
  active,
  onClick,
}) => {
  return (
    <button
      className={`sap-domain-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="sap-domain-top">
        <div className="sap-domain-icon">{icon}</div>

        <StatusBadge status={status} />
      </div>

      <div className="sap-domain-title">{title}</div>

      <div className="sap-domain-subtitle">{subtitle}</div>

      <div className="sap-domain-metrics">
        {metrics.map((metric, index) => (
          <div className="sap-mini-metric" key={index}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </div>
        ))}
      </div>

      <div className="sap-investigate">
        {active ? "Viewing evidence ↑" : "View evidence →"}
      </div>
    </button>
  );
};

const EvidencePanel = ({ domain, data, onClose }) => {
  if (!domain) return null;

  const {
    quality = {},
    security = {},
    integration = {},
    validation = {},
    operations = {},
    transport = {},
  } = data;

  const renderEvidence = () => {
    switch (domain) {
      case "quality":
        return (
          <>
            <div className="sap-evidence-summary">
              The transport passed the primary ATC quality gate, while Sonar
              indicates a warning that should be reviewed before production
              deployment.
            </div>

            <div className="sap-evidence-grid">
              <div>
                <span>ATC Gate</span>
                <strong>{quality.atc_status || "N/A"}</strong>
              </div>

              <div>
                <span>Sonar Analysis</span>
                <strong>{quality.sonar_status || "N/A"}</strong>
              </div>

              <div>
                <span>Critical Findings</span>
                <strong>{quality.atc_critical ?? 0}</strong>
              </div>

              <div>
                <span>High Findings</span>
                <strong>{quality.atc_high ?? 0}</strong>
              </div>

              <div>
                <span>Medium Findings</span>
                <strong>{quality.atc_medium ?? 0}</strong>
              </div>
            </div>
          </>
        );

      case "security":
        return (
          <>
            <div className="sap-evidence-summary">
              No critical vulnerability or secret exposure is currently
              detected. Authorization impact remains low.
            </div>

            <div className="sap-evidence-grid">
              <div>
                <span>Security Gate</span>
                <strong>{security.status || "N/A"}</strong>
              </div>

              <div>
                <span>Authorization Impact</span>
                <strong>{security.authorization_impact || "N/A"}</strong>
              </div>

              <div>
                <span>Secrets Detected</span>
                <strong>{security.secrets ?? 0}</strong>
              </div>

              <div>
                <span>Critical CVEs</span>
                <strong>{security.critical_vulnerabilities ?? 0}</strong>
              </div>
            </div>
          </>
        );

      case "integration":
        return (
          <>
            <div className="sap-evidence-summary">
              This is the primary release concern. The transport has a high
              AIF/interface impact. No failed messages are currently reported,
              but additional interface validation is recommended.
            </div>

            <div className="sap-evidence-grid">
              <div>
                <span>AIF Impact</span>
                <strong>{integration.aif_impact || "N/A"}</strong>
              </div>

              <div>
                <span>Interfaces</span>
                <strong>{integration.interface_count ?? 0}</strong>
              </div>

              <div>
                <span>Failed Messages</span>
                <strong>{integration.failed_messages ?? 0}</strong>
              </div>

              <div>
                <span>Integration Status</span>
                <strong>{integration.status || "N/A"}</strong>
              </div>
            </div>

            <div className="sap-evidence-checklist">
              <div>✓ Review impacted AIF interfaces</div>
              <div>✓ Confirm functional validation</div>
              <div>✓ Monitor interfaces during release window</div>
              <div>✓ Confirm business readiness</div>
            </div>
          </>
        );

      case "validation":
        return (
          <>
            <div className="sap-evidence-summary">
              Functional and release validation gates have passed. CAB approval
              is also available for this transport.
            </div>

            <div className="sap-evidence-grid">
              <div>
                <span>SIT</span>
                <strong>{validation.sit || "N/A"}</strong>
              </div>

              <div>
                <span>UAT</span>
                <strong>{validation.uat || "N/A"}</strong>
              </div>

              <div>
                <span>Regression</span>
                <strong>{validation.regression || "N/A"}</strong>
              </div>

              <div>
                <span>CAB</span>
                <strong>{validation.cab || "N/A"}</strong>
              </div>
            </div>
          </>
        );

      case "operations":
        return (
          <>
            <div className="sap-evidence-summary">
              The production operating environment is currently healthy and
              the operational controls required for the release are ready.
            </div>

            <div className="sap-evidence-grid">
              <div>
                <span>ActiveControl</span>
                <strong>{transport.activecontrol || "N/A"}</strong>
              </div>

              <div>
                <span>New Relic</span>
                <strong>{operations.new_relic || "N/A"}</strong>
              </div>

              <div>
                <span>Background Jobs</span>
                <strong>{operations.background_jobs || "N/A"}</strong>
              </div>

              <div>
                <span>User Lock</span>
                <strong>{operations.user_lock || "N/A"}</strong>
              </div>
            </div>
          </>
        );

      case "governance":
        return (
          <>
            <div className="sap-evidence-summary">
              Governance controls are currently satisfied for this transport.
            </div>

            <div className="sap-evidence-grid">
              <div>
                <span>CAB</span>
                <strong>{validation.cab || "N/A"}</strong>
              </div>

              <div>
                <span>ActiveControl</span>
                <strong>{transport.activecontrol || "N/A"}</strong>
              </div>

              <div>
                <span>Owner</span>
                <strong>{transport.owner || "N/A"}</strong>
              </div>

              <div>
                <span>Transport Type</span>
                <strong>{transport.type || "N/A"}</strong>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="sap-evidence-panel">
      <div className="sap-evidence-header">
        <div>
          <div className="sap-evidence-eyebrow">TECHNICAL EVIDENCE</div>
          <h3>
            {domain === "quality" && "Code Quality Evidence"}
            {domain === "security" && "Security Evidence"}
            {domain === "integration" && "AIF / Integration Evidence"}
            {domain === "validation" && "Release Validation Evidence"}
            {domain === "operations" && "Operational Evidence"}
            {domain === "governance" && "Governance Evidence"}
          </h3>
        </div>

        <button className="sap-evidence-close" onClick={onClose}>
          ×
        </button>
      </div>

      {renderEvidence()}
    </div>
  );
};

const SapTransportAnalyzer = ({ transports = [] }) => {
  const [selectedTransport, setSelectedTransport] = useState(
    transports[0] || null
  );

  const [analyzedTransport, setAnalyzedTransport] = useState(
    transports[0] || null
  );

  const [activeEvidence, setActiveEvidence] = useState(null);

  const data = analyzedTransport;
  function SapTransportAnalyzer({ transports }) {
  const [selectedTransport, setSelectedTransport] = useState(
    transports?.[0]?.transport?.request || ""
  );

  const data = transports.find(
    (item) => item.transport?.request === selectedTransport
  );

  if (!data) {
    return <div>No transport selected.</div>;
  }

  // Paste the compatibility code here

  const score = Number(
    data.risk_score ??
      data.release_score ??
      data.score ??
      data.risk?.score ??
      0
  );

  const riskLevel =
    data.risk_level ??
    data.risk?.level ??
    data.riskLevel ??
    (score >= 90 ? "LOW" : score >= 70 ? "MEDIUM" : "CRITICAL");

  const decision = String(
    data.decision ??
      data.release_decision ??
      data.deployment_gate ??
      data.risk?.decision ??
      (score >= 90 ? "READY" : score >= 70 ? "HOLD" : "BLOCK")
  ).toUpperCase();

  const confidence = Number(
    data.confidence ??
      data.ai_confidence ??
      data.ai?.confidence ??
      data.ai_recommendation?.confidence ??
      0
  );

  return (
    <div>
      {/* existing dashboard JSX */}
    </div>
  );
}


  const healthDomains = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: "quality",
        title: "Code Quality",
        subtitle: "ATC & static analysis",
        status:
          data.quality?.atc_status === "PASS" &&
          data.quality?.sonar_status === "PASS"
            ? "PASS"
            : "WARNING",
        icon: "⌁",
        metrics: [
          {
            label: "ATC",
            value: data.quality?.atc_status || "N/A",
          },
          {
            label: "Sonar",
            value: data.quality?.sonar_status || "N/A",
          },
        ],
      },

      {
        id: "security",
        title: "Security",
        subtitle: "Security & authorization",
        status: data.security?.status || "N/A",
        icon: "◈",
        metrics: [
          {
            label: "Auth",
            value: data.security?.authorization_impact || "N/A",
          },
          {
            label: "Critical CVEs",
            value: data.security?.critical_vulnerabilities ?? 0,
          },
        ],
      },

      {
        id: "integration",
        title: "Integration",
        subtitle: "AIF & interfaces",
        status: data.integration?.aif_impact || "N/A",
        icon: "⇄",
        metrics: [
          {
            label: "Interfaces",
            value: data.integration?.interface_count ?? 0,
          },
          {
            label: "Failed",
            value: data.integration?.failed_messages ?? 0,
          },
        ],
      },

      {
        id: "validation",
        title: "Validation",
        subtitle: "SIT, UAT & regression",
        status: data.validation?.regression || "N/A",
        icon: "✓",
        metrics: [
          {
            label: "SIT",
            value: data.validation?.sit || "N/A",
          },
          {
            label: "UAT",
            value: data.validation?.uat || "N/A",
          },
        ],
      },

      {
        id: "operations",
        title: "Operations",
        subtitle: "Production readiness",
        status: data.operations?.new_relic || "N/A",
        icon: "◉",
        metrics: [
          {
            label: "Jobs",
            value: data.operations?.background_jobs || "N/A",
          },
          {
            label: "User Lock",
            value: data.operations?.user_lock || "N/A",
          },
        ],
      },

      {
        id: "governance",
        title: "Governance",
        subtitle: "CAB & transport control",
        status: data.validation?.cab || "N/A",
        icon: "◆",
        metrics: [
          {
            label: "CAB",
            value: data.validation?.cab || "N/A",
          },
          {
            label: "Control",
            value: data.transport?.activecontrol || "N/A",
          },
        ],
      },
    ];
  }, [data]);

  if (!data) {
    return (
      <div className="sap-empty-state">
        No SAP transport data available.
      </div>
    );
  }

  const score = Number(
  data.risk_score ??
    data.release_score ??
    data.score ??
    data.risk?.score ??
    0
);
const riskLevel =
  data.risk_level ??
  data.risk?.level ??
  data.riskLevel ??
  (score >= 90 ? "LOW" : score >= 70 ? "MEDIUM" : "CRITICAL");
  <StatusBadge status={riskLevel} />

const decision = String(
  data.decision ??
    data.release_decision ??
    data.deployment_gate ??
    data.risk?.decision ??
    (score >= 90 ? "READY" : score >= 70 ? "HOLD" : "BLOCK")
).toUpperCase();
<StatusBadge status={decision} />

const confidence = Number(
  data.confidence ??
    data.ai_confidence ??
    data.ai?.confidence ??
    data.ai_recommendation?.confidence ??
    0
);

  const decisionClass =
    decision === "READY"
      ? "ready"
      : decision === "BLOCK"
      ? "block"
      : "hold";
      

  const aiSummary =
    data.ai?.summary ||
    data.ai_recommendation?.summary ||
    "The transport requires additional review before production deployment.";

  const aiReason =
    data.ai?.reason ||
    data.ai_recommendation?.reason ||
    "Additional technical and business validation is recommended.";

  const nextActions =
    data.ai?.next_actions ||
    data.ai_recommendation?.next_actions ||
    [];
    

  return (
    <section className="sap-command-center">

      {/* PRODUCT HEADER */}
      <div className="sap-product-header">
        <div>
          <div className="sap-product-label">
            SCANGUARD AI · SAP ATTP
          </div>

          <h1>SAP Transport Deployment Intelligence</h1>

          <p>
            Know the health of every transport before it reaches Production.
          </p>
        </div>

        <div className="sap-live-indicator">
          <span />
          LIVE ANALYSIS
        </div>
      </div>

      {/* TRANSPORT COMMAND BAR */}
      <div className="sap-command-bar">
        <div className="sap-selector-group">
          <label>TRANSPORT REQUEST</label>

          <select
            value={selectedTransport?.transport?.request || ""}
            onChange={(e) => {
              const selected = transports.find(
                (item) =>
                  item.transport?.request === e.target.value
              );

              setSelectedTransport(selected || null);
              setActiveEvidence(null);
            }}
          >
            {transports.map((item) => (
              <option
                key={item.transport?.request}
                value={item.transport?.request}
              >
                {item.transport?.request}
              </option>
            ))}
          </select>
        </div>

        <button
          className="sap-analyze-button"
          onClick={() => {
            setAnalyzedTransport(selectedTransport);
            setActiveEvidence(null);
          }}
        >
          Analyze Transport
          <span>→</span>
        </button>
      </div>

      {/* TRANSPORT IDENTITY */}
      <div className="sap-transport-meta">
        <div>
          <span>TRANSPORT</span>
          <strong>{data.transport?.request || "N/A"}</strong>
        </div>

        <div>
          <span>SOURCE</span>
          <strong>{data.transport?.source || "N/A"}</strong>
        </div>

        <div className="sap-flow-arrow">→</div>

        <div>
          <span>TARGET</span>
          <strong>{data.transport?.target || "N/A"}</strong>
        </div>

        <div>
          <span>TYPE</span>
          <strong>{data.transport?.type || "N/A"}</strong>
        </div>

        <div>
          <span>OWNER</span>
          <strong>{data.transport?.owner || "N/A"}</strong>
        </div>
      </div>

      {/* MAIN RELEASE GATE */}
      <div className={`sap-release-gate ${decisionClass}`}>

        <div className="sap-score-block">
          <div className="sap-score-label">RELEASE SCORE</div>

          <div className="sap-score">
            {score}
            <span>/100</span>
          </div>

          <StatusBadge
            status={
              data.risk_level ||
              (score >= 90 ? "LOW" : score >= 70 ? "MEDIUM" : "CRITICAL")
            }
          />
        </div>

        <div className="sap-gate-divider" />

        <div className="sap-decision-block">
          <div className="sap-score-label">DEPLOYMENT GATE</div>

          <div className="sap-decision">
            {decision === "READY" && "✓"}
            {decision === "HOLD" && "!"}
            {decision === "BLOCK" && "×"}

            <span>{decision}</span>
          </div>

          <div className="sap-decision-message">
            {decision === "READY" &&
              "Transport meets the current release readiness criteria."}

            {decision === "HOLD" &&
              "Technically ready, but additional review is required."}

            {decision === "BLOCK" &&
              "Critical release conditions must be resolved before import."}
          </div>
        </div>

        <div className="sap-ai-assessment">
          <div className="sap-score-label">AI ASSESSMENT</div>

          <strong>{aiSummary}</strong>

          <p>{aiReason}</p>
        </div>
      </div>

      {/* HEALTH DOMAINS */}
      <div className="sap-section-heading">
        <div>
          <span>RELEASE HEALTH</span>
          <h2>Six deployment readiness domains</h2>
        </div>

        <p>
          Select a domain to inspect the evidence behind the decision.
        </p>
      </div>

      <div className="sap-health-grid">
        {healthDomains.map((domain) => (
          <DomainCard
            key={domain.id}
            {...domain}
            active={activeEvidence === domain.id}
            onClick={() =>
              setActiveEvidence(
                activeEvidence === domain.id ? null : domain.id
              )
            }
          />
        ))}
      </div>

      {/* EVIDENCE */}
      {activeEvidence && (
        <EvidencePanel
          domain={activeEvidence}
          data={data}
          onClose={() => setActiveEvidence(null)}
        />
      )}

      {/* WHAT NEEDS ATTENTION */}
      <div className="sap-attention-panel">
        <div className="sap-attention-icon">
          {decision === "READY" ? "✓" : decision === "BLOCK" ? "×" : "!"}
        </div>

        <div className="sap-attention-content">
          <div className="sap-attention-label">
            {decision === "READY"
              ? "RELEASE READY"
              : "WHAT NEEDS ATTENTION?"}
          </div>

          <h3>
            {data.integration?.aif_impact === "HIGH"
              ? "AIF / Interface Impact — HIGH"
              : decision === "BLOCK"
              ? "Critical deployment blockers detected"
              : "Additional release review recommended"}
          </h3>

          <p>
            {data.integration?.aif_impact === "HIGH"
              ? `This transport impacts ${
                  data.integration?.interface_count ?? 0
                } interfaces. Although ${
                  data.integration?.failed_messages ?? 0
                } failed messages are currently reported, additional interface
                validation and business confirmation are recommended.`
              : aiReason}
          </p>
        </div>

        <button
          className="sap-evidence-button"
          onClick={() => setActiveEvidence("integration")}
        >
          View Evidence →
        </button>
      </div>

      {/* AI COPILOT */}
      <div className="sap-copilot">

        <div className="sap-copilot-header">
          <div>
            <div className="sap-copilot-label">
              SCANGUARD AI
            </div>

            <h2>AI Release Copilot</h2>
          </div>

          <div className="sap-confidence">
            <span>AI CONFIDENCE</span>
            <strong>{confidence}%</strong>
          </div>
        </div>

        <div className="sap-copilot-decision">
          <div
            className={`sap-copilot-status ${decisionClass}`}
          >
            {decision}
          </div>

          <div>
            <h3>
              {decision === "READY"
                ? "Recommended for Production Import"
                : decision === "BLOCK"
                ? "Do Not Import"
                : "Do Not Import Yet"}
            </h3>

            <p>{aiReason}</p>
          </div>
        </div>

        {nextActions.length > 0 && (
          <div className="sap-next-actions">
            <div className="sap-next-title">
              Recommended next actions
            </div>

            <div className="sap-action-list">
              {nextActions.map((action, index) => (
                <div className="sap-action-item" key={index}>
                  <span>{index + 1}</span>
                  <p>{action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* OPERATIONAL FOOTER */}
      <div className="sap-operational-strip">
        <div>
          <span>ACTIVECONTROL</span>
          <strong>
            {data.transport?.activecontrol || "N/A"}
          </strong>
        </div>

        <div>
          <span>NEW RELIC</span>
          <strong>
            {data.operations?.new_relic || "N/A"}
          </strong>
        </div>

        <div>
          <span>BACKGROUND JOBS</span>
          <strong>
            {data.operations?.background_jobs || "N/A"}
          </strong>
        </div>

        <div>
          <span>USER LOCK</span>
          <strong>
            {data.operations?.user_lock || "N/A"}
          </strong>
        </div>

        <div>
          <span>CAB</span>
          <strong>
            {data.validation?.cab || "N/A"}
          </strong>
        </div>
      </div>
    </section>
  );
};

export default SapTransportAnalyzer;