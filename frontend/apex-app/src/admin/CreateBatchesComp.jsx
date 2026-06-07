import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import "./DashboardComp.css";
import "./CreateBatches.css";
import { NavLink, useNavigate } from "react-router-dom";

const CreateBatchesComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  {/* Content for Create New Batches can be added here */ }
  const [formData, setFormData] = useState({
  course_name: "",
  trainer_name: "",
  start_date: "",
  end_date: "",
});
const [batches, setBatches] = useState([]);

const fetchBatches = async () => {
  try {
    const res = await apiClient.get('/api/batches');
    if (res.data && res.data.data) setBatches(res.data.data);
  } catch (err) {
    console.error('Failed to fetch batches', err);
  }
};

useEffect(() => {
  fetchBatches();
}, []);

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

{/* Form submission handler */}
const createBatch = async (e) => {
  e.preventDefault();

  try {
    await apiClient.post("/api/batches", formData);

    alert("Batch Created Successfully");

    setFormData({
      course_name: "",
      trainer_name: "",
      start_date: "",
      end_date: "",
    });
    // refresh list
    fetchBatches();

  } catch (err) {
    console.error(err);
  }
};

  // Sidebar menu items
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Manage Companies", path: "/manage-companies" },
    { name: "Manage Students", path: "/manage-students" },
    { name: "Manage Customers", path: "/manage-customers" },
    { name: "Create New Batches", path: "/create-batches" },
    { name: "Upload Data", path: "/upload-data" },
    { name: "Manage Courses", path: "/manage-courses" },
    { name: "Manage Trainers", path: "/manage-trainers" },
    { name: "Placement Drives", path: "/placement-drives" },
    { name: "View Reports", path: "/view-reports" },
    { name: "Settings", path: "/settings" },
    { name: "Audit Logs", path: "/audit-logs" },
    { name: "Notifications", path: "/notifications" },
    { name: "Email Creation", path: "/email-creation" },
    { name: "Identity Management", path: "/identity-management" },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="header">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <h1>Admin Dashboard</h1>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Layout */}
      <div className="main-layout">
        {/* Sidebar */}
        <aside className={`sidebar-menu ${menuOpen ? "show" : ""}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </aside>

        {/* Content */}
        <main className="dashboard-content">
          <h2>Create New Batches</h2>
          <p>Here you can create new batches for your courses.</p>

          {/* Form to create new batches */}
          <form className="batch-form" onSubmit={createBatch}>
            <div className="form-group">
              <label htmlFor="course">Course Name:</label>
              <input
                type="text"
                id="course"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                required
              />
              <label htmlFor="trainer">Trainer Name:</label>
              <input
                type="text"
                id="trainer"
                name="trainer_name"
                value={formData.trainer_name}
                onChange={handleChange}
                required
              />
              <label htmlFor="start-date">Start Date:</label>
              <input
                type="date"
                id="start-date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
              <label htmlFor="end-date">End Date:</label>
              <input
                type="date"
                id="end-date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Create Batch</button>
          </form>

          {/* Existing batches */}
          <section className="batches-list">
            <h3>Existing Batches</h3>
            {batches.length === 0 ? (
              <p>No batches found.</p>
            ) : (
              <table className="batches-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course</th>
                    <th>Trainer</th>
                    <th>Start</th>
                    <th>End</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((b) => (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.course_name}</td>
                      <td>{b.trainer_name}</td>
                      <td>{new Date(b.start_date).toLocaleDateString()}</td>
                      <td>{new Date(b.end_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default CreateBatchesComp;