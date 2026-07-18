function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">S</div>

        <div>
          <h2>ScanGuard AI</h2>
          <p>DevSecOps Security Command Center</p>
        </div>
      </div>

      <div className="navbar-actions">
        <span className="environment-badge">Production Analysis</span>
      </div>
    </nav>
  );
}

export default Navbar;