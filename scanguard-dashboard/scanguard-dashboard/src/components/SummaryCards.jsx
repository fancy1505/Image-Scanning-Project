const securityData = [
  {
    component: "Frontend",
    before: 54,
    after: 28,
    reduction: "48.15%",
    status: "Improved",
  },
  {
    component: "Backend",
    before: 9,
    after: 0,
    reduction: "100%",
    status: "Remediated",
  },
  {
    component: "Admin",
    before: 28,
    after: 28,
    reduction: "0%",
    status: "Needs Review",
  },
];

function SummaryCards() {
  return (
    <section className="summary-grid">
      {securityData.map((item) => (
        <article className="summary-card" key={item.component}>
          <div className="card-heading">
            <h3>{item.component}</h3>
            <span className={`status ${item.status.toLowerCase().replace(" ", "-")}`}>
              {item.status}
            </span>
          </div>

          <div className="score-row">
            <span>{item.before}</span>
            <span className="arrow">→</span>
            <strong>{item.after}</strong>
          </div>

          <p>{item.reduction} vulnerability reduction</p>
        </article>
      ))}

      <article className="summary-card overall-card">
        <div className="card-heading">
          <h3>Overall</h3>
          <span className="status improved">Improved</span>
        </div>

        <div className="score-row">
          <span>91</span>
          <span className="arrow">→</span>
          <strong>56</strong>
        </div>

        <p>38.46% total vulnerability reduction</p>
      </article>
    </section>
  );
}

export default SummaryCards;