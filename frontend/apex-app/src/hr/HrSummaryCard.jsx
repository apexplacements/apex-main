import React from "react";
import "./HrSummaryCard.css";

const HrSummaryCard = ({ title, value, delta, icon, accent }) => {
  return (
    <div className={`hr-summary-card ${accent || "accent-primary"}`}>
      <div className="hr-summary-card-icon">{icon}</div>
      <div className="hr-summary-card-text">
        <span className="hr-summary-card-title">{title}</span>
        <span className="hr-summary-card-value">{value}</span>
      </div>
      {delta ? (
        <div className="hr-summary-card-delta">{delta}</div>
      ) : null}
    </div>
  );
};

export default HrSummaryCard;
