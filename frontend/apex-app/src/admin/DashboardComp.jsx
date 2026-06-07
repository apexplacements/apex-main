import React, { useEffect, useState } from "react";
import "./DashboardComp.css";
import { NavLink, useNavigate } from "react-router-dom";

const DashboardComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardData = {
    totalUsers: 150,
    totalStudents: 1200,
    totalCustomers: 30,
    totalTrainers: 25,
    totalCourses: 18,
    totalBatches: 35,
    activePlacements: 12,
    placedStudents: 850,
    pendingApplications: 75,
  };

  
  {/* Sidebar Menu Items */}

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
            sessionStorage.removeItem("currentUser");
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

        {/* Dashboard Content */}
        <main className="dashboard-content">
          <div className="dashboard-grid">

            <div className="dashboard-card">
              <h3>Total Users</h3>
              <p>{dashboardData.totalUsers}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Students</h3>
              <p>{dashboardData.totalStudents}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Customers</h3>
              <p>{dashboardData.totalCustomers}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Trainers</h3>
              <p>{dashboardData.totalTrainers}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Courses</h3>
              <p>{dashboardData.totalCourses}</p>
            </div>

            <div className="dashboard-card">
              <h3>Total Batches</h3>
              <p>{dashboardData.totalBatches}</p>
            </div>

            <div className="dashboard-card">
              <h3>Active Placements</h3>
              <p>{dashboardData.activePlacements}</p>
            </div>

            <div className="dashboard-card">
              <h3>Placed Students</h3>
              <p>{dashboardData.placedStudents}</p>
            </div>

            <div className="dashboard-card">
              <h3>Pending Applications</h3>
              <p>{dashboardData.pendingApplications}</p>
            </div>

          </div>
        </main>

      </div>
      

    </div>
  );
};

export default DashboardComp;