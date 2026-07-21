import { useCallback, useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import DeploymentDecision from "./components/DeploymentDecision";
import SeverityChart from "./components/SeverityChart";
import InformationPanel from "./components/InformationPanel";

import "./App.css";

/*
 * Recorded baseline from the initial Trivy scan.
 * Replace these values only when you have a different verified baseline report.
 */
const BASELINE_VULNERABILITIES = {
  critical: 12,
  high: 180,
  medium: 236,
  low: 316,
};

const PIPELINE_STAGES = [
  {
    name: "GitHub Actions",
    description: "CI/CD workflow automation",
    status: "Integrated",
  },
  {
    name: "GitLeaks",
    description: "Secret and credential detection",
    status: "Integrated",
  },
  {
    name: "SonarCloud",
    description: "Static code and quality-gate analysis",
    status: "Integrated",
  },
  {
    name: "Docker Build",
    description: "Container image creation",
    status: "Integrated",
  },
  {
    name: "Trivy Filesystem",
    description: "Source and dependency scanning",
    status: "Integrated",
  },
  {
    name: "Trivy Image",
    description: "Container image vulnerability scan",
    status: "Integrated",
  },
  {
    name: "AI Analyzer",
    description: "Risk scoring and release recommendation",
    status: "Active",
  },
];

const OUTPUT_CAPABILITIES = [
  {
    name: "JSON Security Report",
    type: "Report",
    status: "Generated",
  },
  {
    name: "HTML Executive Report",
    type: "Report",
    status: "Generated",
  },
  {
    name: "AI Analysis Report",
    type: "Report",
    status: "Generated",
  },
  {
    name: "Slack Notifications",
    type: "Notification",
    status: "Implemented",
  },
  {
    name: "Email Notifications",
    type: "Notification",
    status: "Implemented",
  },
  {
    name: "Grafana Monitoring",
    type: "Monitoring",
    status: "Available",
  },
];

function toNumber(value) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function readSeverity(summary, severityCounts, severity) {
  const lowerCaseSeverity = severity.toLowerCase();
  const upperCaseSeverity = severity.toUpperCase();

  return toNumber(
    summary?.[lowerCaseSeverity] ??
      summary?.[upperCaseSeverity] ??
      severityCounts?.[lowerCaseSeverity] ??
      severityCounts?.[upperCaseSeverity] ??
      0
  );
}

function formatChange(value) {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
}

function VulnerabilityRow({ severity, before, current }) {
  const resolved = Math.max(before - current, 0);
  const increase = Math.max(current - before, 0);
  const improvement =
    before > 0 ? Math.round((resolved / before) * 100) : 0;

  return (
    <div className="lifecycle-row">
      <div className="lifecycle-severity">
        <span
          className={`severity-indicator ${severity.toLowerCase()}`}
        />
        <strong>{severity}</strong>
      </div>

      <div className="lifecycle-number">{before}</div>

      <div className="lifecycle-number current-number">
        {current}
      </div>

      <div className="lifecycle-number resolved-number">
        {resolved}
      </div>

      <div className="lifecycle-number pending-number">
        {current}
      </div>

      <div>
        {increase > 0 ? (
          <span className="change-badge increased">
            +{increase} increased
          </span>
        ) : resolved > 0 ? (
          <span className="change-badge improved">
            {improvement}% reduced
          </span>
        ) : (
          <span className="change-badge unchanged">
            No change
          </span>
        )}
      </div>
    </div>
  );
}

function VulnerabilityLifecycle({
  currentVulnerabilities,
  currentTotal,
  currentScore,
}) {
  const baselineTotal = Object.values(
    BASELINE_VULNERABILITIES
  ).reduce((sum, value) => sum + value, 0);

  const resolvedBySeverity = Object.keys(
    BASELINE_VULNERABILITIES
  ).reduce((sum, severity) => {
    return (
      sum +
      Math.max(
        BASELINE_VULNERABILITIES[severity] -
          currentVulnerabilities[severity],
        0
      )
    );
  }, 0);

  const increasedBySeverity = Object.keys(
    BASELINE_VULNERABILITIES
  ).reduce((sum, severity) => {
    return (
      sum +
      Math.max(
        currentVulnerabilities[severity] -
          BASELINE_VULNERABILITIES[severity],
        0
      )
    );
  }, 0);

  const overallReduction =
    baselineTotal > 0
      ? Math.round((resolvedBySeverity / baselineTotal) * 100)
      : 0;

  return (
    <section className="lifecycle-section">
      <div className="panel-heading lifecycle-heading">
        <div>
          <div className="section-eyebrow">
            Historical Vulnerability View
          </div>

          <h3>Vulnerability Lifecycle</h3>

          <p className="section-description">
            Comparison between the recorded baseline scan and the
            latest synchronized vulnerability analysis.
          </p>
        </div>

        <span
          className={`lifecycle-status ${
            resolvedBySeverity > increasedBySeverity
              ? "positive"
              : "negative"
          }`}
        >
          {resolvedBySeverity > increasedBySeverity
            ? `${overallReduction}% reduced`
            : "Remediation required"}
        </span>
      </div>

      <div className="lifecycle-header">
        <div>Severity</div>
        <div>Before</div>
        <div>Current</div>
        <div>Resolved</div>
        <div>Pending</div>
        <div>Measured change</div>
      </div>

      <div className="lifecycle-table">
        <VulnerabilityRow
          severity="Critical"
          before={BASELINE_VULNERABILITIES.critical}
          current={currentVulnerabilities.critical}
        />

        <VulnerabilityRow
          severity="High"
          before={BASELINE_VULNERABILITIES.high}
          current={currentVulnerabilities.high}
        />

        <VulnerabilityRow
          severity="Medium"
          before={BASELINE_VULNERABILITIES.medium}
          current={currentVulnerabilities.medium}
        />

        <VulnerabilityRow
          severity="Low"
          before={BASELINE_VULNERABILITIES.low}
          current={currentVulnerabilities.low}
        />
      </div>

      <div className="lifecycle-summary-grid">
        <article>
          <span>Baseline findings</span>
          <strong>{baselineTotal}</strong>
        </article>

        <article>
          <span>Current findings</span>
          <strong>{currentTotal}</strong>
        </article>

        <article>
          <span>Resolved findings</span>
          <strong className="resolved-number">
            {resolvedBySeverity}
          </strong>
        </article>

        <article>
          <span>Pending findings</span>
          <strong className="pending-number">
            {currentTotal}
          </strong>
        </article>

        <article>
          <span>Net finding change</span>
          <strong
            className={
              currentTotal <= baselineTotal
                ? "resolved-number"
                : "pending-number"
            }
          >
            {formatChange(currentTotal - baselineTotal)}
          </strong>
        </article>

        <article>
          <span>Current security score</span>
          <strong>{currentScore}/100</strong>
        </article>
      </div>

      <div className="lifecycle-evidence-note">
        <strong>Evidence:</strong> before values come from the
        recorded initial Trivy scan. Current, resolved, and pending
        values are calculated from the latest dashboard data.
      </div>
    </section>
  );
}

function PipelineOverview() {
  return (
    <section className="pipeline-section">
      <div className="panel-heading">
        <div>
          <div className="section-eyebrow">
            Continuous Security
          </div>
          <h3>CI/CD Security Pipeline</h3>
        </div>

        <span className="pipeline-status-badge">
          Security controls active
        </span>
      </div>

      <div className="pipeline-flow">
        {PIPELINE_STAGES.map((stage, index) => (
          <div className="pipeline-stage-wrapper" key={stage.name}>
            <article className="pipeline-stage">
              <span className="pipeline-stage-number">
                {index + 1}
              </span>

              <div>
                <h4>{stage.name}</h4>
                <p>{stage.description}</p>
              </div>

              <span className="pipeline-stage-status">
                {stage.status}
              </span>
            </article>

            {index < PIPELINE_STAGES.length - 1 && (
              <span className="pipeline-connector">→</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function ReportsAndNotifications() {
  return (
    <section className="outputs-section">
      <div className="panel-heading">
        <div>
          <div className="section-eyebrow">
            Security Outputs
          </div>
          <h3>Reports, Notifications and Monitoring</h3>
        </div>
      </div>

      <div className="outputs-grid">
        {OUTPUT_CAPABILITIES.map((output) => (
          <article className="output-card" key={output.name}>
            <div className="output-card-heading">
              <span>{output.type}</span>
              <strong>{output.status}</strong>
            </div>

            <h4>{output.name}</h4>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [llmAnalysis, setLlmAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const cacheKey = Date.now();

      const analysisResponse = await fetch(
        `/data/ai-analysis.json?t=${cacheKey}`
      );

      if (!analysisResponse.ok) {
        throw new Error(
          "Could not load public/data/ai-analysis.json."
        );
      }

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);

      const llmResponse = await fetch(
        `/data/ai-llm-analysis.json?t=${cacheKey}`
      );

      if (llmResponse.ok) {
        const llmData = await llmResponse.json();
        setLlmAnalysis(llmData);
      } else {
        setLlmAnalysis(null);
      }
    } catch (loadError) {
      console.error(loadError);
      setError(loadError.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const dashboardData = useMemo(() => {
    if (!analysis) {
      return null;
    }

    const vulnerabilitySummary =
      analysis.vulnerability_summary || {};

    const severityCounts =
      vulnerabilitySummary.by_severity || {};

    const currentVulnerabilities = {
      critical: readSeverity(
        vulnerabilitySummary,
        severityCounts,
        "critical"
      ),
      high: readSeverity(
        vulnerabilitySummary,
        severityCounts,
        "high"
      ),
      medium: readSeverity(
        vulnerabilitySummary,
        severityCounts,
        "medium"
      ),
      low: readSeverity(
        vulnerabilitySummary,
        severityCounts,
        "low"
      ),
    };

    const calculatedTotal = Object.values(
      currentVulnerabilities
    ).reduce((sum, value) => sum + value, 0);

    const currentTotal =
      toNumber(vulnerabilitySummary.total) || calculatedTotal;

    const reportsLoaded =
      toNumber(analysis.reports?.loaded_count);

    const reportsExpected =
      toNumber(analysis.reports?.expected_count);

    const coveragePercentage =
      reportsExpected > 0
        ? Math.min(
            100,
            Math.round(
              (reportsLoaded / reportsExpected) * 100
            )
          )
        : 0;

    return {
      vulnerabilitySummary,
      severityCounts,
      currentVulnerabilities,
      currentTotal,
      reportsLoaded,
      reportsExpected,
      coveragePercentage,
    };
  }, [analysis]);

  if (loading) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <div className="loading-spinner" />
          <h2>Loading ScanGuard AI</h2>
          <p>Reading the latest security assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis || !dashboardData) {
    return (
      <div className="state-screen">
        <div className="state-card error-card">
          <h2>Dashboard data unavailable</h2>

          <p>
            {error ||
              "The security analysis data could not be loaded."}
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() => loadDashboardData()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const executiveSummary =
    llmAnalysis?.executive_summary ||
    analysis.executive_summary ||
    "No executive summary is available.";

  const businessImpact =
    llmAnalysis?.management_summary ||
    analysis.business_impact ||
    "No business-impact assessment is available.";

 const rawRecommendations =
  llmAnalysis?.recommendations ??
  analysis.recommendations ??
  [];

const recommendations = Array.isArray(rawRecommendations)
  ? rawRecommendations
  : rawRecommendations &&
      typeof rawRecommendations === "object"
    ? Object.values(rawRecommendations)
    : [rawRecommendations].filter(Boolean);

  const rawReleaseReasons = analysis.release_reasons ?? [];

const releaseReasons = Array.isArray(rawReleaseReasons)
  ? rawReleaseReasons
  : [rawReleaseReasons].filter(Boolean);

  return (
    <div className="dashboard">
      <Header
        refreshing={refreshing}
        onRefresh={() => loadDashboardData(true)}
      />

      <main className="content">
        <section className="page-introduction">
          <div>
            <div className="section-eyebrow">
              Container Security and Release Intelligence
            </div>

            <h2>DevSecOps Executive Dashboard</h2>

            <p>
              Continuous container-image security scanning,
              vulnerability lifecycle tracking, CI/CD controls,
              automated reporting, and AI-assisted release decisions.
            </p>
          </div>

          <div className="analysis-mode">
            <span>Analysis mode</span>

            <strong>
              {llmAnalysis?.llm_enabled
                ? "Claude AI"
                : "Deterministic AI"}
            </strong>
          </div>
        </section>

        <SummaryCards analysis={analysis} />

        <DeploymentDecision
          releaseReadiness={analysis.release_readiness}
        />

        <VulnerabilityLifecycle
          currentVulnerabilities={
            dashboardData.currentVulnerabilities
          }
          currentTotal={dashboardData.currentTotal}
          currentScore={toNumber(analysis.security_score)}
        />

        <PipelineOverview />

        <ReportsAndNotifications />

        <section className="dashboard-grid">
          <SeverityChart
            severityCounts={dashboardData.severityCounts}
          />

          <InformationPanel
            eyebrow="AI Intelligence"
            title="Executive Summary"
            badge={
              llmAnalysis?.llm_enabled
                ? "Claude AI"
                : "Fallback Engine"
            }
          >
            <p>{executiveSummary}</p>
          </InformationPanel>
        </section>

        <section className="dashboard-grid">
          <InformationPanel
            eyebrow="Business Context"
            title="Business Impact"
          >
            <p>{businessImpact}</p>
          </InformationPanel>

          <InformationPanel
            eyebrow="Release Governance"
            title="Release Reasons"
            badge={`${releaseReasons.length} reasons`}
          >
            {releaseReasons.length > 0 ? (
              <ul className="reason-list">
                {releaseReasons.map((reason, index) => (
                  <li key={`${reason}-${index}`}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p>No release-blocking reasons were reported.</p>
            )}
          </InformationPanel>
        </section>

        <section className="dashboard-grid">
          <InformationPanel
            eyebrow="AI Remediation"
            title="Prioritized Recommendations"
            badge={`${recommendations.length} items`}
          >
            {recommendations.length > 0 ? (
              <div className="recommendation-list">
                {recommendations.map(
                  (recommendation, index) => {
                    const recommendationText =
                      typeof recommendation === "string"
                        ? recommendation
                        : recommendation.description ||
                          recommendation.recommendation ||
                          recommendation.title ||
                          JSON.stringify(recommendation);

                    return (
                      <div
                        className="recommendation-item"
                        key={`${recommendationText}-${index}`}
                      >
                        <span>{index + 1}</span>
                        <p>{recommendationText}</p>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <p>
                No remediation recommendations were included in the
                latest analysis.
              </p>
            )}
          </InformationPanel>

          <InformationPanel
            eyebrow="Data Quality"
            title="Security Report Coverage"
            badge={`${dashboardData.coveragePercentage}%`}
          >
            <div className="coverage-summary">
              <div>
                <strong>
                  {dashboardData.reportsLoaded}/
                  {dashboardData.reportsExpected}
                </strong>

                <span>reports loaded successfully</span>
              </div>

              <div className="coverage-track">
                <div
                  className="coverage-bar"
                  style={{
                    width: `${dashboardData.coveragePercentage}%`,
                  }}
                />
              </div>
            </div>
          </InformationPanel>
        </section>
      </main>

      <footer className="footer final-footer">
        <div>
          <strong>ScanGuard AI</strong>
          <span>Container Security Command Center</span>
        </div>

        <div className="footer-technologies">
          Docker · GitHub Actions · Trivy · GitLeaks · SonarCloud ·
          Prometheus · Grafana · React
        </div>

        <div>
          Analysis version:{" "}
          {analysis.analysis_version || "1.0"}
        </div>
      </footer>
    </div>
  );
}

export default App;