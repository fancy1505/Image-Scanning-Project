function RiskScore() {
  return (
    <section className="panel risk-panel">
      <p className="eyebrow">RISK REDUCTION</p>
      <h2>Security Improvement</h2>

      <div className="risk-circle">
        <div>
          <strong>38%</strong>
          <span>Improved</span>
        </div>
      </div>

      <div className="risk-details">
        <div>
          <span>Before</span>
          <strong>91</strong>
        </div>

        <div>
          <span>After</span>
          <strong>56</strong>
        </div>

        <div>
          <span>Resolved</span>
          <strong>35</strong>
        </div>
      </div>
    </section>
  );
}

export default RiskScore;