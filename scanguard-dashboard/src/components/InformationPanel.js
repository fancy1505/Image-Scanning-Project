function InformationPanel({
  eyebrow,
  title,
  children,
  badge,
}) {
  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <div className="section-eyebrow">{eyebrow}</div>
          <h3>{title}</h3>
        </div>

        {badge && <span className="panel-badge">{badge}</span>}
      </div>

      <div className="panel-content">{children}</div>
    </article>
  );
}

export default InformationPanel;