import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const ResumesComp = ({ resumes, onRefresh }) => {
  const [form, setForm] = useState({
    student_id: "",
    resume_url: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.post("/api/resumes", form);
      setSuccess("Resume uploaded successfully!");
      setForm({ student_id: "", resume_url: "", status: "Pending" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload resume");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/api/resumes/${id}`);
      setSuccess("Resume deleted successfully!");
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Resume Management</h2>
      
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={form.student_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="resume_url"
          placeholder="Resume URL"
          value={form.resume_url}
          onChange={handleInputChange}
          required
        />
        <select name="status" value={form.status} onChange={handleInputChange}>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Resume URL</th>
              <th>Status</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume) => (
              <tr key={resume.id}>
                <td>{resume.id}</td>
                <td>{resume.student_id}</td>
                <td>
                  <a href={resume.resume_url} target="_blank" rel="noopener noreferrer">
                    View Resume
                  </a>
                </td>
                <td>
                  <span className={`status-badge ${resume.status?.toLowerCase()}`}>
                    {resume.status}
                  </span>
                </td>
                <td>{new Date(resume.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(resume.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResumesComp;
