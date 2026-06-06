import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";

const AssignmentsComp = ({ studentId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    if (selectedBatch) {
      fetchAssignments();
    }
  }, [selectedBatch]);

  const fetchAssignments = async () => {
    try {
      const res = await apiClient.get(
        `/api/lms/student/${studentId}/batches/${selectedBatch}/assignments`
      );
      if (res.data.success) {
        setAssignments(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="assignments-section">
      <h2>Assignments</h2>
      {assignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p>No assignments yet</p>
        </div>
      ) : (
        <div className="assignments-grid">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="assignment-card">
              <h3>{assignment.assignment_title}</h3>
              <p>{assignment.description}</p>
              <p><strong>Due:</strong> {new Date(assignment.due_date).toLocaleDateString()}</p>
              <p><strong>Marks:</strong> {assignment.total_marks}</p>
              <p><strong>Status:</strong> {assignment.submission_status || 'Pending'}</p>
              {assignment.submission_status === 'Graded' && (
                <p><strong>Score:</strong> {assignment.marks}/{assignment.total_marks}</p>
              )}
              {assignment.feedback && (
                <p><strong>Feedback:</strong> {assignment.feedback}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentsComp;
