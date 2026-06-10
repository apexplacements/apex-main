import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const JobsComp = ({ jobs, onRefresh }) => {
  const [form, setForm] = useState({
    company_name: "",
    role_name: "",
    experience: "",
    location: "",
    salary: "",
    description: "",
    apply_link: "",
    last_date: "",
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
      await apiClient.post("/api/jobs", form);
      setSuccess("Job posted successfully!");
      setForm({ company_name: "", role_name: "", experience: "", location: "", salary: "", description: "", apply_link: "", last_date: "" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/api/jobs/${id}`);
      setSuccess("Job deleted successfully!");
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Job Management</h2>
      
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={form.company_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="role_name"
          placeholder="Role Name"
          value={form.role_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience (Years)"
          value={form.experience}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary (LPA)"
          value={form.salary}
          onChange={handleInputChange}
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={form.description}
          onChange={handleInputChange}
          rows="3"
        />
        <input
          type="text"
          name="apply_link"
          placeholder="Apply Link"
          value={form.apply_link}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="last_date"
          value={form.last_date}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Role</th>
              <th>Experience</th>
              <th>Location</th>
              <th>Salary</th>
              <th>Last Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.id}</td>
                <td>{job.company_name}</td>
                <td>{job.role_name}</td>
                <td>{job.experience}</td>
                <td>{job.location}</td>
                <td>₹{job.salary}</td>
                <td>{new Date(job.last_date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(job.id)}
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

export default JobsComp;
