import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import "./DashboardComp.css";
import "./UploadDataComp.css";
import { NavLink, useNavigate } from "react-router-dom";

const UploadDataComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [resourceType, setResourceType] = useState("");
  const [file, setFile] = useState(null);
  const [resources, setResources] = useState([]);

  {/* Upload Data Content */}
  const uploadFile = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("resourceType", resourceType);
    formData.append("file", file);

    try {
      await apiClient.post(
        "/api/upload-resource",
        formData
      );

      alert("File uploaded successfully");

      setTitle("");
      setResourceType("");
      setFile(null);
      fetchResources();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const fetchResources = async () => {
    try {
      const res = await apiClient.get("/api/upload-resource");
      if (res.data && res.data.data) {
        setResources(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load resources", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

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

        {/* Upload Data Content */}
        <main className="dashboard-content">
          <div className="upload-container">
            <h2>Upload Learning Resource</h2>

            <form onSubmit={uploadFile}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                required
              >
                <option value="">Select Resource Type</option>
                <option value="Video">Video</option>
                <option value="Notes">Notes</option>
                <option value="Image">Image</option>
                <option value="Excel">Excel</option>
              </select>

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />

              <button type="submit">Upload</button>
            </form>

            <section className="uploaded-resources">
              <h3>Uploaded Resources</h3>
              {resources.length === 0 ? (
                <p>No resources uploaded yet.</p>
              ) : (
                resources.map((item) => (
                  <div key={item.id} className="resource-card">
                    <h4>{item.title}</h4>

                    {item.resource_type === "Image" && (
                      <img
                        src={item.file_url}
                        alt={item.title}
                        width="200"
                      />
                    )}

                    {item.resource_type === "Video" && (
                      <video width="300" controls>
                        <source src={item.file_url} />
                      </video>
                    )}

                    {(item.resource_type === "Notes" ||
                      item.resource_type === "Excel") && (
                      <a
                        href={item.file_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    )}
                  </div>
                ))
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UploadDataComp;