import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const AttendanceComp = ({ studentId }) => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    if (selectedBatch) {
      fetchAttendance();
    }
  }, [selectedBatch]);

  const fetchAttendance = async () => {
    try {
      const res = await apiClient.get(
        `/api/lms/student/${studentId}/batches/${selectedBatch}/attendance`
      );
      if (res.data.success) {
        setAttendance(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  if (!attendance) {
    return <div className="empty-state"><p>Select a batch to view attendance</p></div>;
  }

  return (
    <div className="attendance-section">
      <h2>Attendance Record</h2>
      <div className="attendance-stats">
        <div className="stat-card">
          <div className="stat-value">{attendance.percentage}%</div>
          <div className="stat-label">Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{color: '#27ae60'}}>{attendance.present}</div>
          <div className="stat-label">Present</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{color: '#e74c3c'}}>{attendance.absent}</div>
          <div className="stat-label">Absent</div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceComp;
