const rows = [
  {
    component: "Frontend",
    before: 54,
    after: 28,
    fixed: 26,
    improvement: "48.15%",
  },
  {
    component: "Backend",
    before: 9,
    after: 0,
    fixed: 9,
    improvement: "100%",
  },
  {
    component: "Admin",
    before: 28,
    after: 28,
    fixed: 0,
    improvement: "0%",
  },
];

function ComparisonTable() {
  return (
    <section className="panel comparison-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">REMEDIATION RESULTS</p>
          <h2>Before vs After</h2>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Before</th>
              <th>After</th>
              <th>Fixed</th>
              <th>Improvement</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.component}>
                <td>{row.component}</td>
                <td>{row.before}</td>
                <td>{row.after}</td>
                <td>{row.fixed}</td>
                <td>{row.improvement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ComparisonTable;