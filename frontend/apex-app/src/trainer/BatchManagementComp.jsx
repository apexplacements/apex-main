import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";

const BatchManagementComp = ({ trainerId }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    course_id: "",
    batch_name: "",
    start_date: "",
    end_date: "",
    max_students: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post(`/api/lms/trainer/${trainerId}/batches`, formData);
      if (res.data.success) {
        fetchBatches();
        setShowForm(false);
        setFormData({
          course_id: "",
          batch_name: "",
          start_date: "",
          end_date: "",
          max_students: "",
        });
        alert("Batch created successfully!");
      }
    } catch (err) {
      console.error("Error creating batch:", err);
      alert("Failed to create batch");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="batch-management-section">
      <div className="section-header">
        <h3>My Batches</h3>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? "Cancel" : "Create Batch"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="batch-form">
          <div className="form-group">
            <label>Course ID</label>
            <input
              type="number"
              name="course_id"
              value={formData.course_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Batch Name</label>
            <input
              type="text"
              name="batch_name"
              value={formData.batch_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Max Students</label>
            <input
              type="number"
              name="max_students"
              value={formData.max_students}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-success">
            Create Batch
          </button>
        </form>
      )}

      <div className="table-container">
        {batches.length === 0 ? (
          <div className="empty-state">
            <p>No batches yet</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Batch Name</th>
                <th>Course ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td>{batch.batch_name}</td>
                  <td>{batch.course_id}</td>
                  <td>{new Date(batch.start_date).toLocaleDateString()}</td>
                  <td>{new Date(batch.end_date).toLocaleDateString()}</td>
                  <td>{batch.student_count || 0}</td>
                  <td>
                    <span className={`badge badge-${batch.status === "Ongoing" ? "info" : "warning"}`}>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default BatchManagementComp;
