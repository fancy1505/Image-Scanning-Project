function Header({ onRefresh, refreshing }) {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand-shield">S</div>

        <div>
          <h1>ScanGuard AI</h1>
          <p>DevSecOps Security Command Center</p>
        </div>
      </div>

      <div className="header-actions">
        <span className="engine-status">
          <span className="status-dot" />
          AI Analyzer Active
        </span>

        <a
          className="secondary-button"
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
        >
          Open Grafana
        </a>

        <button
          className="primary-button"
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
    </header>
  );
}

export default Header;