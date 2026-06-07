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
    batchId: "",
    course: "",
    validUpto: "",
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
        idNo: `APEX10${selectedRecord.id}`,
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
      payload.append("batchId", formData.batchId);
      payload.append("course", formData.course);
      payload.append("validUpto", formData.validUpto);
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
          name="batchId"
          placeholder="Batch ID"
          value={formData.batchId}
          onChange={handleChange}
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
        />

        <input
          type="date"
          name="validUpto"
          value={formData.validUpto}
          onChange={handleChange}
        />

        <label htmlFor="photoUpload">Upload Photo</label>
        <input
          type="file"
          id="photoUpload"
          accept="image/*"
          onChange={handlePhotoChange}
        />

        <input
          type="text"
          name="expiryMonth"
          placeholder="Expiry Month"
          value={expirationMonth}
          readOnly
        />

        <input
          type="text"
          name="expiryYear"
          placeholder="Expiry Year"
          value={expirationYear}
          readOnly
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
            <img src="/apex-logo.png" alt="Apex Logo" className="id-logo" />
            <div className="card-header-title">
              <h3>Apex Skills & Placement Center</h3>
              <p>www.apexplacements.in</p>
            </div>
          </div>
        </div>

        <div className="card-body">
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Photo Preview" />
            </div>
          )}

  <div className="card-row">
    <span className="label">ID No</span>
    <span className="colon">:</span>
    <span className="value">{formData.idNo}</span>
  </div>

  <div className="card-row">
    <span className="label">Name</span>
    <span className="colon">:</span>
    <span className="value">{formData.fullName}</span>
  </div>

  <div className="card-row">
    <span className="label">Email</span>
    <span className="colon">:</span>
    <span className="value">{email}</span>
  </div>

  <div className="card-row">
    <span className="label">Role</span>
    <span className="colon">:</span>
    <span className="value">{formData.role}</span>
  </div>

  <div className="card-row">
    <span className="label">Batch ID</span>
    <span className="colon">:</span>
    <span className="value">{formData.batchId}</span>
  </div>

  <div className="card-row">
    <span className="label">Course</span>
    <span className="colon">:</span>
    <span className="value">{formData.course}</span>
  </div>

  <div className="card-row">
    <span className="label">Valid Upto</span>
    <span className="colon">:</span>
    <span className="value">{formData.validUpto}</span>
  </div>
  {expirationMonth && (
    <div className="card-row">
      <span className="label">Expiry Month</span>
      <span className="colon">:</span>
      <span className="value">{expirationMonth}</span>
    </div>
  )}
  {expirationYear && (
    <div className="card-row">
      <span className="label">Expiry Year</span>
      <span className="colon">:</span>
      <span className="value">{expirationYear}</span>
    </div>
  )}

</div>

        <div className="signature">
          Authorized Signature
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