import Navbar from "../components/Navbar";
import SummaryCards from "../components/SummaryCards";
import ComparisonTable from "../components/ComparisonTable";
import RiskScore from "../components/RiskScore";
import Recommendation from "../components/Recommendation";
import ExecutiveSummary from "../components/ExecutiveSummary";
import Footer from "../components/Footer";

function Dashboard() {
  return (
    <div className="app-container">
      <Navbar />

      <main className="dashboard-container">
        <section className="dashboard-header">
          <div>
            <p className="eyebrow">SECURITY OVERVIEW</p>
            <h1>ShopNow Security Dashboard</h1>
            <p className="subtitle">
              Before-and-after vulnerability remediation analysis
            </p>
          </div>

          <div className="scan-status">
            <span className="status-dot"></span>
            Latest scan completed
          </div>
        </section>

        <SummaryCards />

        <section className="dashboard-grid">
          <ComparisonTable />
          <RiskScore />
        </section>

        <section className="dashboard-grid">
          <Recommendation />
          <ExecutiveSummary />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;