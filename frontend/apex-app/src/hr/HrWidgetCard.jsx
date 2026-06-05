import React from "react";
import "./HrWidgetCard.css";

const HrWidgetCard = ({ title, subtitle, items, footerLink, footerText }) => {
  return (
    <section className="hr-widget-card">
      <div className="hr-widget-card-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="hr-widget-card-list">
        {items.map((item) => (
          <article key={item.title} className="hr-widget-card-item">
            <div>
              <strong>{item.title}</strong>
              <span>{item.subtitle}</span>
            </div>
            <div className="hr-widget-card-badge">{item.badge}</div>
          </article>
        ))}
      </div>
      {footerLink ? (
        <a className="hr-widget-card-footer" href={footerLink}>
          {footerText || "View all details"}
        </a>
      ) : null}
    </section>
  );
};

export default HrWidgetCard;
