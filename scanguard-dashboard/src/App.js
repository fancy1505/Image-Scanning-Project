import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/data/ai-analysis.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load ai-analysis.json");
        }

        return response.json();
      })
      .then((data) => {
        setAnalysis(data);
      })
      .catch((loadError) => {
        setError(loadError.message);
      });
  }, []);

  if (error) {
    return (
      <div className="screen-center">
        <div className="message-card">
          <h2>Dashboard data unavailable</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="screen-center">
        <div className="message-card">
          <h2>Loading ScanGuard AI...</h2>
        </div>
      </div>
    );
  }

  const decision =
    analysis.release_readiness === "READY"
      ? "APPROVED"
      : analysis.release_readiness === "BLOCK RELEASE"
      ? "REJECTED"
      : "REQUIRES REVIEW";

  return (
    <div className="dashboard">
      <header className="header">
        <div>
          <h1>ScanGuard AI</h1>
          <p>DevSecOps Security Command Center</p>
        </div>

        <a
          className="grafana-button"
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
        >
          Open Grafana
        </a>
      </header>

      <main className="content">
        <section className="cards">
          <article className="card">
            <p>Security Score</p>
            <h2>{analysis.security_score}/100</h2>
          </article>

          <article className="card">
            <p>Risk Level</p>
            <h2>{analysis.risk_level}</h2>
          </article>

          <article className="card">
            <p>Total Findings</p>
            <h2>
              {analysis.vulnerability_summary?.total ?? 0}
            </h2>
          </article>
        </section>

        <section
          className={`decision ${
            decision === "APPROVED"
              ? "approved"
              : decision === "REJECTED"
              ? "rejected"
              : "review"
          }`}
        >
          <p>Deployment Decision</p>
          <h2>{decision}</h2>
          <span>
            Release status: {analysis.release_readiness}
          </span>
        </section>

        <section className="panel">
          <h2>AI Executive Summary</h2>
          <p>
            {analysis.executive_summary ||
              "No executive summary available."}
          </p>
        </section>

        <section className="panel">
          <h2>Business Impact</h2>
          <p>
            {analysis.business_impact ||
              "No business impact statement available."}
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;