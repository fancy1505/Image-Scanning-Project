function SummaryCards({ analysis }) {
  const summary = analysis.vulnerability_summary || {};
  const severities = summary.by_severity || {};

  const cards = [
    {
      label: "Security Score",
      value: `${analysis.security_score ?? 0}/100`,
      detail: "Calculated security posture",
      className: "danger-value",
    },
    {
      label: "Risk Level",
      value: analysis.risk_level || "UNKNOWN",
      detail: "Current application exposure",
      className: "danger-value",
    },
    {
      label: "Total Findings",
      value: summary.total ?? 0,
      detail: `${severities.CRITICAL ?? 0} Critical findings`,
      className: "",
    },
    {
      label: "Reports Analyzed",
      value: analysis.reports?.loaded_count ?? 0,
      detail: `${analysis.reports?.expected_count ?? 0} reports expected`,
      className: "",
    },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <article className="metric-card" key={card.label}>
          <div className="metric-label">{card.label}</div>

          <div className={`metric-value ${card.className}`}>
            {card.value}
          </div>

          <div className="metric-detail">{card.detail}</div>
        </article>
      ))}
    </section>
  );
}

export default SummaryCards;