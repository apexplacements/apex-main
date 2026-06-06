import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const MockTestsComp = ({ studentId }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="tests-section">
      <h2>Mock Tests</h2>
      <div className="empty-state">
        <div className="empty-state-icon">🧪</div>
        <p>Select a batch to view tests</p>
      </div>
    </div>
  );
};

export default MockTestsComp;
