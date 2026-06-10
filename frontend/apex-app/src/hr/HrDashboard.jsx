import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import HrSummaryCard from "./HrSummaryCard";
import "./HrDashboard.css";

// Import all section components
import StudentComp from "./components/StudentComp";
import CompaniesComp from "./components/CompaniesComp";
import JobsComp from "./components/JobsComp";
//import CompanyApplyLinksComp from "./components/CompanyApplyLinksComp";
import PlacementDrivesComp from "./components/PlacementDrivesComp";
import InterviewsComp from "./components/InterviewsComp";
import PlacementsComp from "./components/PlacementsComp";
import PaymentsComp from "./components/PaymentsComp";
import NotificationsComp from "./components/NotificationsComp";
import ResumesComp from "./components/ResumesComp";
import ReportsComp from "./components/ReportsComp";

const HrDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for all data
  const [students, setStudents] = useState([]);
  const [placementDrives, setPlacementDrives] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    totalFeesReceived: 0,
    totalSalariesPaid: 0,
    pendingPayments: 0,
  });
  const [stats, setStats] = useState({
    totalStudents: 0,
    eligibleStudents: 0,
    placedStudents: 0,
    activeJobOpenings: 0,
    scheduledInterviews: 0,
    companiesHiring: 0,
  });

  const sections = [
    { key: "dashboard", label: "Dashboard" },
    { key: "students", label: "Students" },
    { key: "placement-drives", label: "Placement Drives" },
    { key: "jobs", label: "Jobs" },
    { key: "companies", label: "Companies" },
    // { key: "apply-links", label: "Apply Links" },
    { key: "interviews", label: "Interviews" },
    { key: "placements", label: "Placements" },
    { key: "resumes", label: "Resumes" },
    { key: "notifications", label: "Notifications" },
    { key: "payments", label: "Payments" },
    { key: "reports", label: "Reports" },
    { key: "profile", label: "Profile" },
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, placementRes, jobsRes, companiesRes, interviewsRes, placementsRes, notificationsRes, resumesRes, paymentsRes] = await Promise.all([
        apiClient.get("/api/students"),
        apiClient.get("/api/placement-drives"),
        apiClient.get("/api/jobs"),
        apiClient.get("/api/companies"),
        apiClient.get("/api/interviews"),
        apiClient.get("/api/placements"),
        apiClient.get("/api/notifications"),
        apiClient.get("/api/resumes"),
        apiClient.get("/api/payments"),
      ]);

      const newStudents = studentsRes.data?.data || [];
      const activeJobs = jobsRes.data?.data || [];
      const hiringCompanies = [...new Set((companiesRes.data?.data || []).map((company) => company.company_name))].length;
      const scheduledInterviews = interviewsRes.data?.data?.filter((item) => item.status === "Scheduled").length || 0;
      const placedCount = placementsRes.data?.data?.length || 0;
      const eligibleStudents = newStudents.filter((student) => student.status !== "Placed").length;
      const paymentsList = paymentsRes.data?.data || [];
      const totalFeesReceived = paymentsList
        .filter((payment) => payment.payment_type === "Course Fee")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      const totalSalariesPaid = paymentsList
        .filter((payment) => payment.payment_type === "Salary Payment")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      const pendingPayments = paymentsList.filter((payment) => payment.status !== "Completed").length;

      setStudents(newStudents);
      setPlacementDrives(placementRes.data?.data || []);
      setJobs(activeJobs);
      setCompanies(companiesRes.data?.data || []);
      setInterviews(interviewsRes.data?.data || []);
      setPlacements(placementsRes.data?.data || []);
      setNotifications(notificationsRes.data?.data || []);
      setResumes(resumesRes.data?.data || []);
      setPayments(paymentsList);
      setPaymentStats({
        totalFeesReceived,
        totalSalariesPaid,
        pendingPayments,
      });
      setStats({
        totalStudents: newStudents.length,
        eligibleStudents,
        placedStudents: placedCount,
        activeJobOpenings: activeJobs.length,
        scheduledInterviews,
        companiesHiring: hiringCompanies,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load HR portal data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleSectionClick = (sectionKey) => {
    setActiveSection(sectionKey);
    setMenuOpen(false);
  };

  if (loading) {
    return <div className="loading">Loading HR Dashboard...</div>;
  }

  return (
    <div className="hr-dashboard">
      {/* Header */}
      <header className="hr-header">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1>HR Portal</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`hr-sidebar ${menuOpen ? "open" : ""}`}>
        <nav className="nav-menu">
          {sections.map((section) => (
            <button
              key={section.key}
              className={`nav-item ${activeSection === section.key ? "active" : ""}`}
              onClick={() => handleSectionClick(section.key)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="hr-content">
        {error && <div className="error-box">{error}</div>}

        {/* Dashboard Section */}
        {activeSection === "dashboard" && (
          <div className="dashboard-grid">
            <HrSummaryCard title="Total Students" value={stats.totalStudents} />
            <HrSummaryCard title="Eligible Students" value={stats.eligibleStudents} />
            <HrSummaryCard title="Placed Students" value={stats.placedStudents} />
            <HrSummaryCard title="Active Job Openings" value={stats.activeJobOpenings} />
            <HrSummaryCard title="Scheduled Interviews" value={stats.scheduledInterviews} />
            <HrSummaryCard title="Hiring Companies" value={stats.companiesHiring} />
          </div>
        )}

        {/* Students Section */}
        {activeSection === "students" && <StudentComp students={students} onRefresh={loadAllData} />}

        {/* Placement Drives Section */}
        {activeSection === "placement-drives" && <PlacementDrivesComp placementDrives={placementDrives} onRefresh={loadAllData} />}

        {/* Jobs Section */}
        {activeSection === "jobs" && <JobsComp jobs={jobs} onRefresh={loadAllData} />}

        {/* Companies Section */}
        {activeSection === "companies" && <CompaniesComp companies={companies} onRefresh={loadAllData} />}


        {/* Interviews Section */}
        {activeSection === "interviews" && <InterviewsComp interviews={interviews} onRefresh={loadAllData} />}

        {/* Placements Section */}
        {activeSection === "placements" && <PlacementsComp placements={placements} onRefresh={loadAllData} />}

        {/* Resumes Section */}
        {activeSection === "resumes" && <ResumesComp resumes={resumes} onRefresh={loadAllData} />}

        {/* Notifications Section */}
        {activeSection === "notifications" && <NotificationsComp notifications={notifications} onRefresh={loadAllData} />}

        {/* Payments Section */}
        {activeSection === "payments" && <PaymentsComp payments={payments} paymentStats={paymentStats} onRefresh={loadAllData} />}

        {/* Reports Section */}
        {activeSection === "reports" && <ReportsComp stats={stats} students={students} placements={placements} payments={payments} />}

        {/* Profile Section */}
        {activeSection === "profile" && (
          <div className="section-container">
            <h2>Profile</h2>
            <div className="profile-info">
              <p>HR Portal Profile</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HrDashboard;
