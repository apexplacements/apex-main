import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import useSiteSummary from "../hooks/useSiteSummary";
import "./StudentDashboard.css";
import MyCoursesComp from "./MyCoursesComp";
import CoursePlayerComp from "./CoursePlayerComp";
import AssignmentsComp from "./AssignmentsComp";
import AttendanceComp from "./AttendanceComp";
import CertificatesComp from "./CertificatesComp";
import MockTestsComp from "./MockTestsComp";
import ProgressComp from "./ProgressComp";
import AnnouncementsComp from "./AnnouncementsComp";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [studentData, setStudentData] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { summary: siteSummary } = useSiteSummary();

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    // Accept both legacy and full role values for student
    const role = currentUser?.role;
    if (!currentUser || (role !== "std" && role !== "student")) {
      navigate("/");
      return;
    }
    setStudentId(currentUser.id);
    setStudentData(currentUser);
    setLoading(false);
  }, [navigate]);

  

  if (loading) {
    return <div className="student-dashboard-loading">Loading...</div>;
  }

  if (!studentId) {
    return <div className="student-dashboard-error">Unauthorized access</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "courses":
        return <MyCoursesComp studentId={studentId} onSelectCourse={(course) => {
          setSelectedCourse(course);
          setActiveTab("player");
        }} />;
      case "player":
        return selectedCourse ? <CoursePlayerComp studentId={studentId} course={selectedCourse} /> : <MyCoursesComp studentId={studentId} />;
      case "assignments":
        return <AssignmentsComp studentId={studentId} />;
      case "attendance":
        return <AttendanceComp studentId={studentId} />;
      case "tests":
        return <MockTestsComp studentId={studentId} />;
      case "progress":
        return <ProgressComp studentId={studentId} />;
      case "certificates":
        return <CertificatesComp studentId={studentId} />;
      case "announcements":
        return <AnnouncementsComp studentId={studentId} />;
      default:
        return <MyCoursesComp studentId={studentId} />;
    }
  };

  return (
    <div className="student-dashboard">
      <div className="student-dashboard-container">
        {/* Sidebar */}
        <aside className={`student-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h2>Student Hub</h2>
            <button className="sidebar-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              ✕
            </button>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === "courses" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("courses");
                setIsMobileMenuOpen(false);
              }}
            >
              📚 My Courses
            </button>
            <button
              className={`nav-item ${activeTab === "player" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("player");
                setIsMobileMenuOpen(false);
              }}
            >
              ▶️ Course Player
            </button>
            <button
              className={`nav-item ${activeTab === "assignments" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("assignments");
                setIsMobileMenuOpen(false);
              }}
            >
              📝 Assignments
            </button>
            <button
              className={`nav-item ${activeTab === "attendance" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("attendance");
                setIsMobileMenuOpen(false);
              }}
            >
              ✓ Attendance
            </button>
            <button
              className={`nav-item ${activeTab === "tests" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("tests");
                setIsMobileMenuOpen(false);
              }}
            >
              🧪 Mock Tests
            </button>
            <button
              className={`nav-item ${activeTab === "progress" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("progress");
                setIsMobileMenuOpen(false);
              }}
            >
              📊 Progress
            </button>
            <button
              className={`nav-item ${activeTab === "certificates" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("certificates");
                setIsMobileMenuOpen(false);
              }}
            >
              🎓 Certificates
            </button>
            <button
              className={`nav-item ${activeTab === "announcements" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("announcements");
                setIsMobileMenuOpen(false);
              }}
            >
              📢 Announcements
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="student-info">
              <p className="student-name">{studentData?.user_name}</p>
              <p className="student-role">{studentData?.role}</p>
            </div>
            <button className="logout-btn" onClick={() => {
              sessionStorage.removeItem("currentUser");
              navigate("/");
            }}>
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Toggle Button */}
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          ☰
        </button>

        {/* Main Content */}
        <main className="student-main-content">
          <div className="student-header">
            <div className="header-title">
              <h1>Welcome, {studentData?.user_name}!</h1>
              <p className="header-subtitle">Apex Skills & Placement Center</p>
            </div>
            <div className="header-user">
              <span className="user-badge">{studentData?.role?.toUpperCase()}</span>
            </div>
          </div>
          {siteSummary && (
            <div style={{ margin: '12px 0', padding: '8px', background: '#fff', borderRadius: 6, display: 'flex', gap: 12 }}>
              <div>Students: {siteSummary.total_students || 0}</div>
              <div>Placements: {siteSummary.total_placements || 0}</div>
              <div>Companies: {siteSummary.total_companies || 0}</div>
              <div>Jobs: {siteSummary.total_jobs || 0}</div>
            </div>
          )}

          <div className="student-content-area">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
