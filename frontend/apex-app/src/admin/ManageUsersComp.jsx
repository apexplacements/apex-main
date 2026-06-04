import React, { useState } from "react";
import "./DashboardComp.css";
import { NavLink, useNavigate } from "react-router-dom";

const ManageUsersComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  {/*Manage Users Content */}
const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@apex.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "John Trainer",
      email: "john@apex.com",
      role: "Trainer",
      status: "Active",
    },
    {
      id: 3,
      name: "Rahul Student",
      email: "rahul@apex.com",
      role: "Student",
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };
  
{/* Sidebar Menu Items */}
  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Manage Users", path: "/manage-users" },
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

        {/* Manage Users Content */}
        <main className="dashboard-content">
          <div className="users-container">

            <div className="users-header">
              <h2>User Management</h2>

              <button className="add-btn">
                Add User
              </button>
            </div>

            <div className="search-section">
              <input
                type="text"
                placeholder="Search User..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="table-container">
              <table>

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>

                      <td>
                        <button className="edit-btn">
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(user.id)}
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
        </main>

      </div>

    </div>
  );
};

export default ManageUsersComp;