import React, { useState, useEffect } from "react";
import "./DashboardComp.css";
import { NavLink, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";

const DashboardComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Style definitions
  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, boxShadow 0.2s",
  };

  const cardNumberStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: "10px",
  };

  const cardLabelStyle = {
    fontSize: "14px",
    color: "#666",
    fontWeight: "500",
  };

  const tableContainerStyle = {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "4px",
    overflow: "hidden",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  };

  const thStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    color: "#333",
  };

  const tdStyle = {
    padding: "12px",
    color: "#555",
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      console.log("[DASHBOARD] Fetching stats...");
      const res = await apiClient.get("/api/dashboard/stats");
      if (res.data.success) {
        console.log("[DASHBOARD] Stats loaded:", res.data.data);
        setDashboardData(res.data.data);
      } else {
        setDashboardData({
          summary: {},
          recent_placements: [],
          top_companies: [],
          recent_students: [],
          active_batches: []
        });
      }
    } catch (err) {
      console.error("[DASHBOARD] Fetch error:", err.message);
      setDashboardData({
        summary: {},
        recent_placements: [],
        top_companies: [],
        recent_students: [],
        active_batches: []
      });
    } finally {
      setLoading(false);
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

  if (loading && !dashboardData) {
    return (
      <div className="dashboard-page">
        <header className="header">
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <h1>Admin Dashboard</h1>
          <button className="logout-btn" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>Logout</button>
        </header>
        <div style={{ padding: "40px", textAlign: "center" }}>Loading dashboard...</div>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  const recentPlacements = dashboardData?.recent_placements || [];
  const topCompanies = dashboardData?.top_companies || [];
  const recentStudents = dashboardData?.recent_students || [];
  const activeBatches = dashboardData?.active_batches || [];

  return (
    <div className="dashboard-page">
      <header className="header">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>Logout</button>
      </header>

      <div className="main-layout">
        <aside className={`sidebar-menu ${menuOpen ? "show" : ""}`}>
          {menuItems.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              {item.name}
            </NavLink>
          ))}
        </aside>

        <main className="dashboard-content">
          <div style={{ marginBottom: "30px" }}>
            <h2>Summary Statistics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginTop: "15px" }}>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_students || 0}</div>
                <div style={cardLabelStyle}>Students</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_trainers || 0}</div>
                <div style={cardLabelStyle}>Trainers</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_companies || 0}</div>
                <div style={cardLabelStyle}>Companies</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_placements || 0}</div>
                <div style={cardLabelStyle}>Placements</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_jobs || 0}</div>
                <div style={cardLabelStyle}>Jobs</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_courses || 0}</div>
                <div style={cardLabelStyle}>Courses</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_batches || 0}</div>
                <div style={cardLabelStyle}>Batches</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_interviews || 0}</div>
                <div style={cardLabelStyle}>Interviews</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_offers || 0}</div>
                <div style={cardLabelStyle}>Offers</div>
              </div>
              <div style={cardStyle}>
                <div style={cardNumberStyle}>{summary.total_customers || 0}</div>
                <div style={cardLabelStyle}>Customer Requests</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
            <div>
              <h3>Recent Placements</h3>
              <div style={tableContainerStyle}>
                {recentPlacements.length > 0 ? (
                  <table style={tableStyle}>
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={thStyle}>Student</th>
                        <th style={thStyle}>Company</th>
                        <th style={thStyle}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPlacements.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={tdStyle}>{p.student_name || "N/A"}</td>
                          <td style={tdStyle}>{p.company_name || "N/A"}</td>
                          <td style={tdStyle}>{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>No recent placements</div>
                )}
              </div>
            </div>

            <div>
              <h3>Top Companies</h3>
              <div style={tableContainerStyle}>
                {topCompanies.length > 0 ? (
                  <table style={tableStyle}>
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={thStyle}>Company</th>
                        <th style={thStyle}>Placements</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCompanies.map((c, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={tdStyle}>{c.company_name || "N/A"}</td>
                          <td style={tdStyle}><strong>{c.placement_count || 0}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>No company data</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <h3>Recent Students</h3>
              <div style={tableContainerStyle}>
                {recentStudents.length > 0 ? (
                  <table style={tableStyle}>
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Email</th>
                        <th style={thStyle}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentStudents.map((s, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={tdStyle}>{s.name || "N/A"}</td>
                          <td style={tdStyle}>{s.email || "N/A"}</td>
                          <td style={tdStyle}>{new Date(s.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>No recent students</div>
                )}
              </div>
            </div>

            <div>
              <h3>Active Batches</h3>
              <div style={tableContainerStyle}>
                {activeBatches.length > 0 ? (
                  <table style={tableStyle}>
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={thStyle}>Batch Name</th>
                        <th style={thStyle}>Start Date</th>
                        <th style={thStyle}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBatches.map((b, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={tdStyle}>{b.batch_name || "N/A"}</td>
                          <td style={tdStyle}>{new Date(b.start_date).toLocaleDateString()}</td>
                          <td style={tdStyle}><span style={{ padding: "4px 8px", backgroundColor: "#c8e6c9", borderRadius: "4px", fontSize: "12px" }}>{b.status || "N/A"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: "20px", textAlign: "center", color: "#999" }}>No active batches</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardComp;