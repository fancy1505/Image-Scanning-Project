const BASELINE = {
  score: 18,
  critical: 12,
  high: 180,
  medium: 236,
  low: 316,
};

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function SecurityTrend({
  trend = {},
  currentScore = 0,
  vulnerabilitySummary = {},
}) {
  const currentFindings =
    numberValue(vulnerabilitySummary.total) ||
    numberValue(vulnerabilitySummary.critical) +
      numberValue(vulnerabilitySummary.high) +
      numberValue(vulnerabilitySummary.medium) +
      numberValue(vulnerabilitySummary.low);

  const baselineFindings =
    BASELINE.critical +
    BASELINE.high +
    BASELINE.medium +
    BASELINE.low;

  const scoreChange = currentScore - BASELINE.score;
  const findingsChange = currentFindings - baselineFindings;

  const improved = scoreChange > 0 || findingsChange < 0;

  return (
    <section className="trend-section">
      <div className="panel-heading">
        <div>
          <div className="section-eyebrow">Security Trend</div>
          <h3>Baseline vs Current Analysis</h3>
        </div>

        <span
          className={`trend-status ${
            improved ? "trend-positive" : "trend-negative"
          }`}
        >
          {improved ? "↑ IMPROVING" : "↓ DECLINING"}
        </span>
      </div>

      <div className="trend-comparison-grid">
        <article className="trend-card">
          <span>Baseline Security Score</span>
          <strong>{BASELINE.score}/100</strong>
        </article>

        <div
          className={`trend-change ${
            scoreChange >= 0 ? "trend-positive" : "trend-negative"
          }`}
        >
          <span>{scoreChange >= 0 ? "↑" : "↓"}</span>
          <strong>
            {scoreChange > 0 ? "+" : ""}
            {scoreChange}
          </strong>
          <small>score change</small>
        </div>

        <article className="trend-card current">
          <span>Current Security Score</span>
          <strong>{currentScore}/100</strong>
        </article>
      </div>

      <div className="trend-comparison-grid findings-comparison">
        <article className="trend-card">
          <span>Baseline Findings</span>
          <strong>{baselineFindings}</strong>
        </article>

        <div
          className={`trend-change ${
            findingsChange <= 0 ? "trend-positive" : "trend-negative"
          }`}
        >
          <span>{findingsChange <= 0 ? "↓" : "↑"}</span>
          <strong>
            {findingsChange > 0 ? "+" : ""}
            {findingsChange}
          </strong>
          <small>findings change</small>
        </div>

        <article className="trend-card current">
          <span>Current Findings</span>
          <strong>{currentFindings}</strong>
        </article>
      </div>

      <div
        className={`trend-message ${
          improved ? "trend-positive" : "trend-negative"
        }`}
      >
        {trend.message ||
          "Current security posture compared with the recorded baseline scan."}
      </div>
    </section>
  );
}

export default SecurityTrend;