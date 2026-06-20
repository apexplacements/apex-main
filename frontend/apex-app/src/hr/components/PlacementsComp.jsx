import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const PlacementsComp = ({ placements, onRefresh }) => {
  const [form, setForm] = useState({
    student_id: "",
    company_name: "",
    role_name: "",
    package: "",
    placement_status: "Placed",
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
      await apiClient.post("/api/placements", form);
      setSuccess("Placement record added successfully!");
      setForm({ student_id: "", company_name: "", role_name: "", package: "", placement_status: "Placed" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add placement record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Placements</h2>
      
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
          name="package"
          placeholder="Package (LPA)"
          value={form.package}
          onChange={handleInputChange}
        />
        <select name="placement_status" value={form.placement_status} onChange={handleInputChange}>
          <option>Placed</option>
          <option>Offered</option>
          <option>Pending</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Placement"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student ID</th>
              <th>Company</th>
              <th>Role</th>
              <th>Package</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((placement) => (
              <tr key={placement.id}>
                <td>{placement.id}</td>
                <td>{placement.student_id}</td>
                <td>{placement.company_name}</td>
                <td>{placement.role_name}</td>
                <td>₹{placement.package} LPA</td>
                <td>
                  <span className={`status-badge ${placement.placement_status?.toLowerCase()}`}>
                    {placement.placement_status}
                  </span>
                </td>
                <td>{new Date(placement.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacementsComp;
