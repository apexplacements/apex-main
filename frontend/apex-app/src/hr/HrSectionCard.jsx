import React from "react";
import "./HrSectionCard.css";

const HrSectionCard = ({ title, subtitle, children, footer }) => {
  return (
    <section className="hr-section-card">
      <div className="hr-section-card-header">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="hr-section-card-body">{children}</div>
      {footer ? <div className="hr-section-card-footer">{footer}</div> : null}
    </section>
  );
};

export default HrSectionCard;
