import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";
import "./DashboardComp.css";
import "./NotificationsComp.css";
import { NavLink, useNavigate } from "react-router-dom";

const NotificationsComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

 
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
    { name: "Notifications", path: "/notifications" },
    { name: "Email Creation", path: "/email-creation" },
    { name: "Identity Management", path: "/identity-management" }
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

        {/* Notifications Content */}
        <main className="dashboard-content">
          <h2>Notifications</h2>

          <NotificationComposer />

        </main>

      </div>

    </div>
  );
};

const NotificationComposer = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    notification_type: "Placement",
    recipients: [],
    student_id: "",
    company_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notifications, setNotifications] = useState([]);

  const roleOptions = [
    { key: "students", label: "Students" },
    { key: "trainers", label: "Trainers" },
    { key: "hr", label: "HR" },
    { key: "placement_officers", label: "Placement Officers" },
  ];

  const typeOptions = [
    "Placement",
    "New Batch",
    "Attendance",
    "Openings",
    "Mock Interviews",
    "General",
  ];

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get("/api/notifications");
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleRecipient = (key) => {
    setForm((p) => {
      const next = new Set(p.recipients || []);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...p, recipients: Array.from(next) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!form.title || !form.message) {
      setError("Title and message are required");
      setLoading(false);
      return;
    }
    if (!form.recipients || form.recipients.length === 0) {
      setError("Select at least one recipient group.");
      setLoading(false);
      return;
    }

    try {
      await apiClient.post("/api/notifications", form);
      setSuccess("Notification sent successfully!");
      setForm({ title: "", message: "", notification_type: "Placement", recipients: [], student_id: "", company_id: "" });
      fetchNotifications();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Notification Title" required />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={4} required />

        <label>Notification Type</label>
        <select name="notification_type" value={form.notification_type} onChange={handleChange}>
          {typeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <div style={{ marginTop: 8 }}>
          <label>Recipients</label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {roleOptions.map((r) => (
              <label key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" checked={(form.recipients || []).includes(r.key)} onChange={() => toggleRecipient(r.key)} /> {r.label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <input name="student_id" value={form.student_id} onChange={handleChange} placeholder="Student ID (optional)" />
          <input name="company_id" value={form.company_id} onChange={handleChange} placeholder="Company ID (optional)" />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Sending...' : 'Send Notification'}
        </button>
      </form>

      <div className="table-container" style={{ marginTop: 16 }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Recipients</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id}>
                <td>{n.id}</td>
                <td>{n.title}</td>
                <td>{n.notification_type}</td>
                <td>{n.recipients || '-'}</td>
                <td>{n.message?.substring(0, 60)}{n.message && n.message.length > 60 ? '...' : ''}</td>
                <td>{new Date(n.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsComp;