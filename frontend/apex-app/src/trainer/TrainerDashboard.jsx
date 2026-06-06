import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TrainerDashboard.css";
import TrainerProfileComp from "./TrainerProfileComp";
import BatchManagementComp from "./BatchManagementComp";
import StudentManagementComp from "./StudentManagementComp";
import AttendanceMarkingComp from "./AttendanceMarkingComp";
import AssignmentReviewComp from "./AssignmentReviewComp";
import TrainerAnnouncementsComp from "./TrainerAnnouncementsComp";
import AnalyticsComp from "./AnalyticsComp";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [trainerId, setTrainerId] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser || (currentUser.role !== "tr" && currentUser.role !== "trainer")) {
      navigate("/login");
    } else {
      setTrainerId(currentUser.id);
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <TrainerProfileComp trainerId={trainerId} />;
      case "batches":
        return <BatchManagementComp trainerId={trainerId} />;
      case "students":
        return <StudentManagementComp trainerId={trainerId} />;
      case "attendance":
        return <AttendanceMarkingComp trainerId={trainerId} />;
      case "assignments":
        return <AssignmentReviewComp trainerId={trainerId} />;
      case "announcements":
        return <TrainerAnnouncementsComp trainerId={trainerId} />;
      case "analytics":
        return <AnalyticsComp trainerId={trainerId} />;
      default:
        return <TrainerProfileComp trainerId={trainerId} />;
    }
  };

  return (
    <div className="trainer-dashboard-container">
      {/* Header */}
      <header className="trainer-header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>Trainer Dashboard</h1>
        </div>
        <div className="header-right">
          <span className="role-badge">Trainer</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`trainer-sidebar ${sidebarOpen ? "open" : ""}`}>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
          <button
            className={`nav-item ${activeTab === "batches" ? "active" : ""}`}
            onClick={() => setActiveTab("batches")}
          >
            📚 My Batches
          </button>
          <button
            className={`nav-item ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            👥 Manage Students
          </button>
          <button
            className={`nav-item ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            📋 Mark Attendance
          </button>
          <button
            className={`nav-item ${activeTab === "assignments" ? "active" : ""}`}
            onClick={() => setActiveTab("assignments")}
          >
            ✏️ Grade Assignments
          </button>
          <button
            className={`nav-item ${activeTab === "announcements" ? "active" : ""}`}
            onClick={() => setActiveTab("announcements")}
          >
            📢 Announcements
          </button>
          <button
            className={`nav-item ${activeTab === "analytics" ? "active" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            📊 Analytics
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="trainer-main-content">
        <div className="content-header">
          <h2>{activeTab.replace(/([A-Z])/g, " $1").toUpperCase()}</h2>
        </div>
        <div className="content-body">
          {trainerId ? renderContent() : <div className="loading-spinner"></div>}
        </div>
      </main>
    </div>
  );
};

export default TrainerDashboard;
