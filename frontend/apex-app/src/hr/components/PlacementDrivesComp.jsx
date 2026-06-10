import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const PlacementDrivesComp = ({ placementDrives, onRefresh }) => {
  const [form, setForm] = useState({
    company_name: "",
    role_name: "",
    location: "",
    ctc: "",
    interview_date: "",
    eligibility: "",
    status: "Active",
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
      await apiClient.post("/api/placement-drives", form);
      setSuccess("Placement drive created successfully!");
      setForm({ company_name: "", role_name: "", location: "", ctc: "", interview_date: "", eligibility: "", status: "Active" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create placement drive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Placement Drives</h2>
      
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
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="ctc"
          placeholder="CTC (LPA)"
          value={form.ctc}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="interview_date"
          value={form.interview_date}
          onChange={handleInputChange}
        />
        <textarea
          name="eligibility"
          placeholder="Eligibility Criteria"
          value={form.eligibility}
          onChange={handleInputChange}
          rows="2"
        />
        <select name="status" value={form.status} onChange={handleInputChange}>
          <option>Active</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Drive"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Role</th>
              <th>CTC</th>
              <th>Interview Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {placementDrives.map((drive) => (
              <tr key={drive.id}>
                <td>{drive.id}</td>
                <td>{drive.company_name}</td>
                <td>{drive.role_name}</td>
                <td>₹{drive.ctc} LPA</td>
                <td>{new Date(drive.interview_date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${drive.status?.toLowerCase()}`}>
                    {drive.status}
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

export default PlacementDrivesComp;
