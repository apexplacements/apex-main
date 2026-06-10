import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const InterviewsComp = ({ interviews, onRefresh }) => {
  const [form, setForm] = useState({
    student_id: "",
    company_id: "",
    interview_date: "",
    interview_time: "",
    round_name: "Technical",
    mode: "Online",
    status: "Scheduled",
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
      await apiClient.post("/api/interviews", form);
      setSuccess("Interview scheduled successfully!");
      setForm({ student_id: "", company_id: "", interview_date: "", interview_time: "", round_name: "Technical", mode: "Online", status: "Scheduled" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Interview Management</h2>
      
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
          name="company_id"
          placeholder="Company ID"
          value={form.company_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="interview_date"
          value={form.interview_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="time"
          name="interview_time"
          value={form.interview_time}
          onChange={handleInputChange}
        />
        <select name="round_name" value={form.round_name} onChange={handleInputChange}>
          <option>Technical</option>
          <option>HR</option>
          <option>Group Discussion</option>
          <option>Coding</option>
        </select>
        <select name="mode" value={form.mode} onChange={handleInputChange}>
          <option>Online</option>
          <option>Offline</option>
          <option>Hybrid</option>
        </select>
        <select name="status" value={form.status} onChange={handleInputChange}>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Rescheduled</option>
          <option>Cancelled</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Interview"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Company ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Round</th>
              <th>Mode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={interview.id}>
                <td>{interview.id}</td>
                <td>{interview.student_id}</td>
                <td>{interview.company_id}</td>
                <td>{new Date(interview.interview_date).toLocaleDateString()}</td>
                <td>{interview.interview_time}</td>
                <td>{interview.round_name}</td>
                <td>{interview.mode}</td>
                <td>
                  <span className={`status-badge ${interview.status?.toLowerCase()}`}>
                    {interview.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InterviewsComp;
