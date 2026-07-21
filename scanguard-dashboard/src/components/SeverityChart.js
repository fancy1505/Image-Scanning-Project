const severityConfig = [
  { key: "CRITICAL", label: "Critical" },
  { key: "HIGH", label: "High" },
  { key: "MEDIUM", label: "Medium" },
  { key: "LOW", label: "Low" },
];

function SeverityChart({ severityCounts = {} }) {
  const maximum = Math.max(
    ...severityConfig.map(
      (severity) => severityCounts[severity.key] || 0
    ),
    1
  );

  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <div className="section-eyebrow">Vulnerability Distribution</div>
          <h3>Findings by Severity</h3>
        </div>

        <span className="panel-badge">Trivy Results</span>
      </div>

      <div className="severity-chart">
        {severityConfig.map((severity) => {
          const count = severityCounts[severity.key] || 0;
          const width = `${(count / maximum) * 100}%`;

          return (
            <div className="severity-row" key={severity.key}>
              <div className="severity-header">
                <span>{severity.label}</span>
                <strong>{count}</strong>
              </div>

              <div className="severity-track">
                <div
                  className={`severity-bar severity-${severity.key.toLowerCase()}`}
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default SeverityChart;