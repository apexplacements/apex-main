import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const ProgressComp = ({ studentId }) => {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await apiClient.get(`/api/lms/student/${studentId}/progress`);
      if (res.data.success) {
        setProgress(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="progress-section">
      <h2>Learning Progress</h2>
      <div className="progress-cards">
        {progress.map((p) => (
          <div key={p.batch_id} className="progress-card">
            <h3>{p.course_name}</h3>
            <p className="batch-name">{p.batch_name}</p>
            <div className="progress-details">
              <p>Lessons: {p.completed_lessons} / {p.total_lessons}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${p.completion_percentage}%` }}></div>
              </div>
              <p className="progress-percentage">{p.completion_percentage}% Complete</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressComp;
