import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const StudentManagementComp = ({ trainerId }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStudentId, setNewStudentId] = useState("");

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

  const fetchBatchStudents = async (batchId) => {
    try {
      const res = await apiClient.get(
        `/api/lms/trainer/${trainerId}/batches/${batchId}/students`
      );
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleBatchSelect = (batchId) => {
    setSelectedBatch(batchId);
    fetchBatchStudents(batchId);
  };

  const handleAddStudent = async () => {
    if (!newStudentId || !selectedBatch) {
      alert("Please select a batch and enter student ID");
      return;
    }

    try {
      const res = await apiClient.post(
        `/api/lms/trainer/${trainerId}/batches/${selectedBatch}/students`,
        { student_id: newStudentId }
      );
      if (res.data.success) {
        fetchBatchStudents(selectedBatch);
        setNewStudentId("");
        alert("Student added successfully!");
      }
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="student-management-section">
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
        <div className="add-student-section">
          <h3>Add Student to Batch</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="number"
              placeholder="Enter Student ID"
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
            />
            <button onClick={handleAddStudent} className="btn btn-primary">
              Add Student
            </button>
          </div>
        </div>
      )}

      {selectedBatch && (
        <div className="table-container">
          <h3>Current Students</h3>
          {students.length === 0 ? (
            <div className="empty-state">
              <p>No students in this batch</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.student_id}</td>
                    <td>{student.student_name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span className="badge badge-info">{student.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentManagementComp;
