import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import "./DashboardComp.css";
import "./EmailCreationComp.css";
import { NavLink, useNavigate } from "react-router-dom";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "hr", label: "HR" },
  { value: "trainer", label: "Trainer" },
  { value: "student", label: "Student" },
  { value: "placementofficer", label: "Placement Officer" },
];

const EmailCreationComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [generatedEmails, setGeneratedEmails] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    alert("Email copied successfully");
  };

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/api/email-creation/users");
      if (res.data && res.data.data) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const fetchGeneratedEmails = async () => {
    try {
      const res = await apiClient.get("/api/email-creation");
      if (res.data && res.data.data) {
        setGeneratedEmails(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load generated emails", err);
    }
  };

  // Listen for password reset events from other tabs/components
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'generatedEmailsUpdatedAt') {
        fetchGeneratedEmails();
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchGeneratedEmails();
  }, []);

  const toggleRole = (roleValue) => {
    setSelectedRoles((prev) =>
      prev.includes(roleValue)
        ? prev.filter((item) => item !== roleValue)
        : [...prev, roleValue]
    );
  };

  const generateEmail = async () => {
    if (!selectedUserId || selectedRoles.length === 0) {
      alert("Please select a user and at least one role.");
      return;
    }

    try {
      const res = await apiClient.post("/api/email-creation", {
        userId: selectedUserId,
        roles: selectedRoles,
      });

      if (res.data && res.data.data) {
        setGeneratedEmails(res.data.data);
        setStatusMessage("Email addresses generated successfully.");
      }
    } catch (err) {
      console.error("Failed to generate emails", err);
      setStatusMessage("Failed to generate emails.");
    }
  };

  const deleteEntry = async (id) => {
    try {
      const res = await apiClient.delete(`/api/email-creation/${id}`);
      if (res.data && res.data.success) {
        setGeneratedEmails((prev) => prev.filter((item) => item.id !== id));
        setStatusMessage("Deleted generated email entry successfully.");
      }
    } catch (err) {
      console.error("Failed to delete generated email", err);
      setStatusMessage("Failed to delete generated email entry.");
    }
  };

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

        {/* Email Creation Content */}
        <main className="dashboard-content">
          <div className="email-container">

            <h2>Email Creation</h2>

            <div className="email-form">
              <label>Select Registered User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <label>Select Roles</label>
              <div className="role-checkboxes">
                {roleOptions.map((roleOption) => (
                  <label key={roleOption.value} className="role-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(roleOption.value)}
                      onChange={() => toggleRole(roleOption.value)}
                    />
                    {roleOption.label}
                  </label>
                ))}
              </div>

              <button onClick={generateEmail}>Generate Emails</button>
            </div>

            {statusMessage && (
              <p className="status-message">{statusMessage}</p>
            )}

            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by user, role, email, or password"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="generated-results">
              <h3>Generated Emails</h3>
              {generatedEmails.length === 0 ? (
                <p>No generated emails yet.</p>
              ) : (
                <table className="generated-email-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Default Password</th>
                      <th>Password</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedEmails
                      .filter((item) => {
                        const term = searchTerm.trim().toLowerCase();
                        if (!term) return true;
                        return (
                          item.user_name.toLowerCase().includes(term) ||
                          item.role.toLowerCase().includes(term) ||
                          item.email.toLowerCase().includes(term) ||
                          item.default_password.toLowerCase().includes(term)
                        );
                      })
                      .map((item) => (
                        <tr key={item.id}>
                          <td>{item.user_name}</td>
                          <td>{item.role}</td>
                          <td>{item.email}</td>
                          <td>{item.default_password}</td>
                          <td>{item.password || ""}</td>
                          <td>
                            <button
                              onClick={() => copyEmail(item.email)}
                            >
                              Copy
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => deleteEntry(item.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </main>

      </div>

    </div>
  );
};

export default EmailCreationComp;