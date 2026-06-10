import React, { useState, useEffect, useRef } from "react";
import apiClient from "../apiClient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./IdentityManagementComp.css";
import "./DashboardComp.css";
import { NavLink, useNavigate } from "react-router-dom";

const IdentityManagementComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const cardRef = useRef();
  const [generatedEmails, setGeneratedEmails] = useState([]);
  const [selectedEmailId, setSelectedEmailId] = useState("");

  const [formData, setFormData] = useState({
    idNo: "",
    fullName: "",
    role: "",
    email: "",
    blood_group: "",

  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");
  const [loading, setLoading] = useState(false);

  const email = formData.email;
  const expirationMonth = formData.validUpto
    ? new Date(formData.validUpto).toLocaleString("default", {
        month: "long",
      })
    : "";
   const expirationYear = formData.validUpto
     ? new Date(formData.validUpto).getFullYear()
     : "";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchGeneratedEmails = async () => {
    try {
      const res = await apiClient.get("/api/email-creation");
      if (res.data?.success) {
        setGeneratedEmails(res.data.data);
      } else {
        console.error("Failed to load generated emails", res.data?.message);
      }
    } catch (err) {
      console.error("Failed to load generated emails", err);
    }
  };

  useEffect(() => {
    fetchGeneratedEmails();
  }, []);

  const handleGeneratedEmailSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedEmailId(selectedId);

    if (!selectedId) {
      setFormData((prev) => ({
        ...prev,
        idNo: "",
        fullName: "",
        role: "",
        email: "",
      }));
      return;
    }

    const selectedRecord = generatedEmails.find(
      (item) => String(item.id) === String(selectedId)
    );

    if (selectedRecord) {
      setFormData((prev) => ({
        ...prev,
        idNo: `APEX00${selectedRecord.id}`,
        fullName: selectedRecord.user_name || "",
        role: selectedRecord.role || "",
        email: selectedRecord.email || "",
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result || "");
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setStatusType("");

    if (!formData.fullName || !formData.email) {
      setStatusMessage("Full name and email are required.");
      setStatusType("error");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("selectedEmailId", selectedEmailId);
      payload.append("idNo", formData.idNo);
      payload.append("fullName", formData.fullName);
      payload.append("role", formData.role);
      payload.append("email", formData.email);
      payload.append("blood_group", formData.blood_group);
      if (photoFile) {
        payload.append("photo", photoFile);
      }

      const res = await apiClient.post("/api/identity-management", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        setStatusMessage(res.data.message || "Identity record saved.");
        setStatusType("success");
      } else {
        setStatusMessage(res.data?.message || "Failed to save identity record.");
        setStatusType("error");
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to save identity record.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = cardRef.current;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.addImage(imgData, "PNG", 15, 20, 180, 90);

    pdf.save(`${formData.idNo || "IDCard"}.pdf`);
  };

 /* Sidebar Menu Items */
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

        {/* Identity Management Content */}
        <main className="dashboard-content">
           <div className="identity-container">

      <h2>Identity Management</h2>

      <form className="form-section" onSubmit={handleSubmit}>

        <label htmlFor="generatedEmailSelect">Select Generated Email</label>
        <select
          id="generatedEmailSelect"
          name="generatedEmail"
          value={selectedEmailId}
          onChange={handleGeneratedEmailSelect}
        >
          <option value="">Choose generated email</option>
          {generatedEmails.map((item) => (
            <option key={item.id} value={item.id}>
              {item.user_name} ({item.role}) — {item.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="idNo"
          placeholder="ID Number"
          value={formData.idNo}
          readOnly={Boolean(selectedEmailId)}
          onChange={handleChange}
        />

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
          <option value="hr">HR</option>
          <option value="placementofficer">
            Placement Officer
          </option>
        </select>

        <input
          type="text"
          name="blood_group"
          placeholder="Blood Group"
          value={formData.blood_group}
          onChange={handleChange}
        />

        <label htmlFor="photoUpload">Upload Photo</label>
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          onChange={handlePhotoChange}
        />

    

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Identity"}
        </button>

        {statusMessage && (
          <div className={`status-message ${statusType}`}>
            {statusMessage}
          </div>
        )}

      </form>

      <div
        className="id-card"
        ref={cardRef}
      >
        <div className="card-header">
          <div className="card-header-top">
            <img src="/ImageBox/apex-logo.jpeg" alt="Apex Logo" className="id-logo" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <div className="card-header-title">
              <h3>Apex Skills & Placement Center</h3>
              <p>www.apexplacements.in</p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="id-main">
            <div className="photo-column">
              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Photo Preview" />
                </div>
              ) : (
                <div className="photo-preview" />
              )}
            </div>

            <div className="info-column">
              <div className="top-info">
                <div className="info-line">
                  <div className="info-label">ID No</div>
                  <div className="info-value">{formData.idNo || '-'}</div>
                </div>
                <div className="info-line">
                  <div className="info-label">Name</div>
                  <div className="info-value">{formData.fullName || '-'}</div>
                </div>
              </div>

              <div className="below-photo-info">
                <div className="info-line">
                  <div className="info-label">Email</div>
                  <div className="info-value">{email || '-'}</div>
                </div>
                <div className="info-line">
                  <div className="info-label">Role</div>
                  <div className="info-value">{formData.role || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <div className="blood-left">Blood Group: <strong>{formData.blood_group || '-'}</strong></div>
            <div className="signature">Authorized Signature</div>
          </div>
        </div>
      </div>

      <button
        className="download-btn"
        onClick={downloadPDF}
      >
        Download PDF
      </button>

    </div>
        </main>

      </div>

    </div>
  );
};

export default IdentityManagementComp;