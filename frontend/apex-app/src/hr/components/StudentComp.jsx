import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const StudentComp = ({ students, onRefresh }) => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
    batch: "",
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
      await apiClient.post("/api/students", form);
      setSuccess("Student added successfully!");
      setForm({ name: "", mobile: "", email: "", course: "", batch: "", status: "Active" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/api/students/${id}`);
      setSuccess("Student deleted successfully!");
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Student Management</h2>
      
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="batch"
          placeholder="Batch"
          value={form.batch}
          onChange={handleInputChange}
        />
        <select name="status" value={form.status} onChange={handleInputChange}>
          <option>Active</option>
          <option>Inactive</option>
          <option>Placed</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.mobile}</td>
                <td>{student.course}</td>
                <td>{student.batch}</td>
                <td>
                  <span className={`status-badge ${student.status?.toLowerCase()}`}>
                    {student.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(student.id)}
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

export default StudentComp;
