import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";

const AnalyticsComp = ({ trainerId }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trainerId) {
      fetchBatches();
    }
  }, [trainerId]);

  const fetchBatches = async () => {
    try {
      const res = await apiClient.get(`/api/lms/trainer/${trainerId}/batches`);
      if (res.data.success) {
        setBatches(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSelect = async (batchId) => {
    setSelectedBatch(batchId);
    try {
      const res = await apiClient.get(
        `/api/lms/trainer/${trainerId}/batches/${batchId}/analytics`
      );
      if (res.data.success) {
        setAnalytics(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="analytics-section">
      <div className="form-group">
        <label>Select Batch</label>
        <select onChange={(e) => handleBatchSelect(e.target.value)} value={selectedBatch || ""}>
          <option value="">-- Select a Batch --</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.batch_name}
            </option>
          ))}
        </select>
      </div>

      {selectedBatch && analytics && (
        <div className="analytics-dashboard">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{analytics.total_students}</h3>
              <p>Total Students</p>
            </div>
            <div className="stat-card">
              <h3>{analytics.avg_completion}%</h3>
              <p>Avg Completion</p>
            </div>
            <div className="stat-card">
              <h3>{analytics.avg_attendance}%</h3>
              <p>Avg Attendance</p>
            </div>
            <div className="stat-card">
              <h3>{analytics.assignments_pending}</h3>
              <p>Pending Assignments</p>
            </div>
          </div>

          <div className="analytics-section">
            <h3>Student Performance</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Completion %</th>
                    <th>Attendance %</th>
                    <th>Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.students && analytics.students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `${student.completion_percentage}%` }}></div>
                        </div>
                        {student.completion_percentage}%
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `${student.attendance_percentage}%` }}></div>
                        </div>
                        {student.attendance_percentage}%
                      </td>
                      <td>{student.avg_score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!selectedBatch && (
        <div className="empty-state">
          <p>Select a batch to view analytics</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsComp;
