const recommendations = [
  {
    component: "Backend",
    status: "Ready",
    message: "All detected npm vulnerabilities were remediated.",
    className: "ready",
  },
  {
    component: "Frontend",
    status: "Conditional Approval",
    message: "Critical vulnerabilities removed and production build validated.",
    className: "warning",
  },
  {
    component: "Admin",
    status: "Modernization Required",
    message: "Remaining findings originate from the legacy CRA toolchain.",
    className: "review",
  },
];

function Recommendation() {
  return (
    <section className="panel">
      <p className="eyebrow">DEPLOYMENT DECISION</p>
      <h2>Security Recommendations</h2>

      <div className="recommendation-list">
        {recommendations.map((item) => (
          <article className="recommendation-item" key={item.component}>
            <span className={`recommendation-icon ${item.className}`}></span>

            <div>
              <div className="recommendation-heading">
                <h3>{item.component}</h3>
                <span>{item.status}</span>
              </div>

              <p>{item.message}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Recommendation;