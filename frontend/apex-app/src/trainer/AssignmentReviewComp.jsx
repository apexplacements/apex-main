import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";

const AssignmentReviewComp = ({ trainerId }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gradingData, setGradingData] = useState({});

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
        `/api/lms/trainer/${trainerId}/batches/${batchId}/assignments`
      );
      if (res.data.success) {
        setAssignments(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const handleAssignmentSelect = async (assignmentId) => {
    setSelectedAssignment(assignmentId);
    try {
      const res = await apiClient.get(
        `/api/lms/trainer/${trainerId}/assignments/${assignmentId}/submissions`
      );
      if (res.data.success) {
        setSubmissions(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  const handleGradeChange = (submissionId, marks, feedback) => {
    setGradingData({
      ...gradingData,
      [submissionId]: { marks, feedback },
    });
  };

  const handleSubmitGrade = async (submissionId) => {
    const grade = gradingData[submissionId];
    if (!grade) {
      alert("Please enter marks");
      return;
    }

    try {
      const res = await apiClient.put(
        `/api/lms/trainer/${trainerId}/submissions/${submissionId}/grade`,
        {
          marks: grade.marks,
          feedback: grade.feedback,
        }
      );

      if (res.data.success) {
        alert("Grade submitted!");
        handleAssignmentSelect(selectedAssignment);
      }
    } catch (err) {
      console.error("Error submitting grade:", err);
      alert("Failed to submit grade");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="assignment-review-section">
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

      {selectedBatch && (
        <div className="form-group">
          <label>Select Assignment</label>
          <select onChange={(e) => handleAssignmentSelect(e.target.value)} value={selectedAssignment || ""}>
            <option value="">-- Select an Assignment --</option>
            {assignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>
                {assignment.assignment_title}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedAssignment && (
        <div className="table-container">
          <h3>Submissions</h3>
          {submissions.length === 0 ? (
            <div className="empty-state">
              <p>No submissions yet</p>
            </div>
          ) : (
            <div className="submissions-list">
              {submissions.map((submission) => (
                <div key={submission.id} className="submission-card">
                  <h4>{submission.student_name}</h4>
                  <p><strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {submission.status}</p>
                  
                  {submission.status !== "Graded" && (
                    <div className="grading-form">
                      <input
                        type="number"
                        placeholder="Marks"
                        onChange={(e) => handleGradeChange(submission.id, e.target.value, gradingData[submission.id]?.feedback || "")}
                        style={{ marginRight: "10px" }}
                      />
                      <textarea
                        placeholder="Feedback"
                        onChange={(e) => handleGradeChange(submission.id, gradingData[submission.id]?.marks || "", e.target.value)}
                        style={{ marginRight: "10px" }}
                      />
                      <button onClick={() => handleSubmitGrade(submission.id)} className="btn btn-success">
                        Submit Grade
                      </button>
                    </div>
                  )}

                  {submission.status === "Graded" && (
                    <div className="graded-info">
                      <p><strong>Score:</strong> {submission.marks}/{submission.total_marks}</p>
                      <p><strong>Feedback:</strong> {submission.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentReviewComp;
