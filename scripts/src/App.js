import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  CircleGauge,
  CloudCog,
  FileWarning,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import "./App.css";

function getDeploymentDecision(releaseReadiness) {
  switch (releaseReadiness) {
    case "READY":
      return {
        status: "APPROVED",
        className: "approved",
        message:
          "All required security checks passed. Production deployment is approved.",
        icon: ShieldCheck,
      };

    case "BLOCK RELEASE":
      return {
        status: "REJECTED",
        className: "rejected",
        message:
          "Production deployment is blocked until Critical and High-risk findings are remediated.",
        icon: ShieldAlert,
      };

    case "NEEDS REVIEW":
      return {
        status: "REQUIRES REVIEW",
        className: "review",
        message:
          "Deployment requires security review, risk acceptance, and formal approval.",
        icon: AlertTriangle,
      };

    default:
      return {
        status: "UNKNOWN",
        className: "unknown",
        message:
          "The deployment decision could not be determined from the available scan results.",
        icon: FileWarning,
      };
  }
}

function getScoreClass(score) {
  if (score >= 80) {
    return "score-good";
  }

  if (score >= 60) {
    return "score-medium";
  }

  return "score-danger";
}

function getRiskClass(riskLevel) {
  const value = String(riskLevel || "").toLowerCase();

  if (value === "critical" || value === "high") {
    return "risk-danger";
  }

  if (value === "medium") {
    return "risk-medium";
  }

  return "risk-good";
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not available";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString();
}

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [llmAnalysis, setLlmAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboardData(isRefresh = false) {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const timestamp = Date.now();

      const [analysisResponse, llmResponse] = await Promise.all([
        fetch(`/data/ai-analysis.json?t=${timestamp}`),
        fetch(`/data/ai-llm-analysis.json?t=${timestamp}`),
      ]);

      if (!analysisResponse.ok) {
        throw new Error(
          "Could not load ai-analysis.json. Run the dashboard data sync script first."
        );
      }

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);

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
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <RefreshCw className="spin" size={38} />
          <h2>Loading ScanGuard AI</h2>
          <p>Reading the latest security analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="state-screen">
        <div className="state-card error-state">
          <ShieldAlert size={42} />
          <h2>Dashboard data unavailable</h2>
          <p>{error || "The security analysis could not be loaded."}</p>

          <button
            className="primary-button"
            type="button"
            onClick={() => loadDashboardData()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const deploymentDecision = getDeploymentDecision(
    analysis.release_readiness
  );

  const DeploymentIcon = deploymentDecision.icon;

  const severityCounts =
    analysis.vulnerability_summary?.by_severity || {};

  const totalFindings =
    analysis.vulnerability_summary?.total ?? 0;

  const securityTrend = analysis.security_trend || {};

  const trendStatus = securityTrend.status || "BASELINE";

  const TrendIcon =
    trendStatus === "IMPROVING"
      ? TrendingUp
      : trendStatus === "DECLINING"
      ? TrendingDown
      : RefreshCw;

  const executiveSummary =
    llmAnalysis?.executive_summary ||
    analysis.executive_summary ||
    "No executive summary is available.";

  const businessImpact =
    llmAnalysis?.management_summary ||
    analysis.business_impact ||
    "No business impact statement is available.";

  const llmEnabled = Boolean(llmAnalysis?.llm_enabled);

  const reportsLoaded =
    analysis.reports?.loaded_count ?? 0;

  const reportsExpected =
    analysis.reports?.expected_count ?? 0;

  return (
    <div className="dashboard-shell">
      <header className="top-header">
        <div className="brand-section">
          <div className="brand-icon">
            <Shield size={28} />
          </div>

          <div>
            <h1>ScanGuard AI</h1>
            <p>DevSecOps Security Command Center</p>
          </div>
        </div>

        <div className="header-actions">
          <div
            className={`ai-mode-badge ${
              llmEnabled ? "ai-live" : "ai-fallback"
            }`}
          >
            <Bot size={17} />

            <span>
              {llmEnabled
                ? "Claude AI Enabled"
                : "Deterministic AI Mode"}
            </span>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={() => loadDashboardData(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={17}
              className={refreshing ? "spin" : ""}
            />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <div>
            <span className="eyebrow">Latest Security Assessment</span>
            <h2>Application Security Overview</h2>
            <p>
              Automated security intelligence generated from container,
              filesystem, and dependency scan reports.
            </p>
          </div>

          <div className="scan-meta">
            <span>Generated</span>
            <strong>{formatDate(analysis.generated_at)}</strong>
          </div>
        </section>

        <section className="summary-grid">
          <article className="metric-card">
            <div className="metric-header">
              <span>Security Score</span>

              <div className="metric-icon">
                <CircleGauge size={21} />
              </div>
            </div>

            <div
              className={`metric-value ${getScoreClass(
                analysis.security_score
              )}`}
            >
              {analysis.security_score}
              <span>/100</span>
            </div>

            <p>
              Explainable score calculated from severity and scan
              coverage.
            </p>
          </article>

          <article className="metric-card">
            <div className="metric-header">
              <span>Overall Risk</span>

              <div className="metric-icon">
                <AlertTriangle size={21} />
              </div>
            </div>

            <div
              className={`metric-value text-value ${getRiskClass(
                analysis.risk_level
              )}`}
            >
              {analysis.risk_level || "UNKNOWN"}
            </div>

            <p>
              Highest application risk determined from current
              findings.
            </p>
          </article>

          <article className="metric-card">
            <div className="metric-header">
              <span>Total Findings</span>

              <div className="metric-icon">
                <FileWarning size={21} />
              </div>
            </div>

            <div className="metric-value">
              {totalFindings}
            </div>

            <p>
              {severityCounts.CRITICAL || 0} Critical and{" "}
              {severityCounts.HIGH || 0} High findings detected.
            </p>
          </article>

          <article className="metric-card">
            <div className="metric-header">
              <span>Security Trend</span>

              <div className="metric-icon">
                <TrendIcon size={21} />
              </div>
            </div>

            <div className="metric-value text-value trend-value">
              {trendStatus}
            </div>

            <p>
              Score change:{" "}
              {securityTrend.score_change > 0 ? "+" : ""}
              {securityTrend.score_change || 0}
            </p>
          </article>
        </section>

        <section
          className={`deployment-card ${deploymentDecision.className}`}
        >
          <div className="deployment-main">
            <div className="deployment-icon-wrapper">
              <DeploymentIcon size={32} />
            </div>

            <div>
              <p className="section-label">Deployment Decision</p>
              <h2>{deploymentDecision.status}</h2>
              <p>{deploymentDecision.message}</p>
            </div>
          </div>

          <div className="deployment-details">
            <span>Release status</span>
            <strong>
              {analysis.release_readiness || "UNKNOWN"}
            </strong>
          </div>
        </section>

        <section className="content-grid">
          <article className="panel executive-panel">
            <div className="panel-heading">
              <div className="panel-title">
                <div className="panel-icon purple">
                  <Sparkles size={20} />
                </div>

                <div>
                  <p className="section-label">AI Intelligence</p>
                  <h3>Executive Summary</h3>
                </div>
              </div>

              <span
                className={`status-pill ${
                  llmEnabled ? "status-live" : "status-fallback"
                }`}
              >
                {llmEnabled ? "LLM Generated" : "Fallback Generated"}
              </span>
            </div>

            <p className="executive-text">
              {executiveSummary}
            </p>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div className="panel-title">
                <div className="panel-icon orange">
                  <CloudCog size={20} />
                </div>

                <div>
                  <p className="section-label">Risk Context</p>
                  <h3>Business Impact</h3>
                </div>
              </div>
            </div>

            <p className="panel-body-text">
              {businessImpact}
            </p>
          </article>
        </section>

        <section className="content-grid lower-grid">
          <article className="panel">
            <div className="panel-heading">
              <div className="panel-title">
                <div className="panel-icon red">
                  <ShieldAlert size={20} />
                </div>

                <div>
                  <p className="section-label">Release Control</p>
                  <h3>Decision Reasons</h3>
                </div>
              </div>
            </div>

            <div className="reason-list">
              {(analysis.release_reasons || []).length > 0 ? (
                analysis.release_reasons.map((reason, index) => (
                  <div className="reason-item" key={`${reason}-${index}`}>
                    <AlertTriangle size={18} />
                    <span>{reason}</span>
                  </div>
                ))
              ) : (
                <div className="reason-item positive">
                  <CheckCircle2 size={18} />
                  <span>No release-blocking reasons were reported.</span>
                </div>
              )}
            </div>
          </article>

          <article className="panel">
            <div className="panel-heading">
              <div className="panel-title">
                <div className="panel-icon green">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="section-label">Scan Coverage</p>
                  <h3>Security Report Status</h3>
                </div>
              </div>
            </div>

            <div className="coverage-value">
              <strong>
                {reportsLoaded}/{reportsExpected}
              </strong>
              <span>reports successfully loaded</span>
            </div>

            <div className="coverage-bar">
              <div
                className="coverage-progress"
                style={{
                  width:
                    reportsExpected > 0
                      ? `${Math.min(
                          100,
                          (reportsLoaded / reportsExpected) * 100
                        )}%`
                      : "0%",
                }}
              />
            </div>

            <p className="coverage-note">
              Missing reports may cause the deployment decision to be
              rejected or require manual review.
            </p>
          </article>
        </section>
      </main>

      <footer className="dashboard-footer">
        <div>
          <Shield size={16} />
          <span>ScanGuard AI Security Platform</span>
        </div>

        <span>
          Analyzer version:{" "}
          {analysis.analysis_version || "Unknown"}
        </span>
      </footer>
    </div>
  );
}

export default App;