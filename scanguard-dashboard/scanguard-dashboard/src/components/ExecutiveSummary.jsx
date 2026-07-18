function ExecutiveSummary() {
  return (
    <section className="panel">
      <p className="eyebrow">MANAGEMENT VIEW</p>
      <h2>Executive Summary</h2>

      <div className="executive-content">
        <p>
          The ShopNow application's dependency security posture improved after
          controlled remediation.
        </p>

        <ul>
          <li>35 vulnerabilities were resolved across the application.</li>
          <li>Frontend findings decreased from 54 to 28.</li>
          <li>Backend achieved complete remediation from 9 to 0.</li>
          <li>
            Admin findings require migration from the legacy Create React App
            toolchain.
          </li>
          <li>
            Risky force-upgrade actions were intentionally avoided to preserve
            application stability.
          </li>
        </ul>
      </div>
    </section>
  );
}

export default ExecutiveSummary;