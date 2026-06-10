import React, { useState, useEffect } from "react";
import "./DashboardComp.css";
import { NavLink, useNavigate } from "react-router-dom";
import "./ManageCompaniesComp.css";
import apiClient from "../apiClient";

const ManageCompaniesComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  {/*Manage Companies Content */}
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    company_name: "",
    website: "",
    hr_name: "",
    hr_email: "",
    hr_mobile: "",
    location: "",
    logo_url: "",
  });

  // Fetch companies from database
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("[COMPANIES] Fetching companies...");
      const res = await apiClient.get("/api/companies");
      if (res.data.success) {
        console.log(`[COMPANIES] Fetched ${res.data.data?.length || 0} companies`);
        setCompanies(res.data.data || []);
      } else {
        const errorMsg = "Failed to load companies";
        console.error("[COMPANIES] Fetch failed:", res.data.message);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Error loading companies";
      console.error("[COMPANIES] Fetch error:", {
        status: err.response?.status,
        message: errorMsg,
        fullError: err
      });
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.company_name.trim()) {
      setError("Company name is required");
      return;
    }

    try {
      setError("");
      let res;
      const operation = editingId ? "update" : "create";

      if (editingId) {
        // Update existing company
        console.log(`[COMPANIES] Updating company ID ${editingId}:`, formData);
        res = await apiClient.put(`/api/companies/${editingId}`, formData);
      } else {
        // Create new company
        console.log(`[COMPANIES] Creating new company:`, formData);
        res = await apiClient.post("/api/companies", formData);
      }
      
      if (res.data.success) {
        console.log(`[COMPANIES] ${operation} successful:`, res.data);
        // Reset form
        handleCancel();
        
        // Refresh companies list
        await fetchCompanies();
        alert(editingId ? "Company updated successfully!" : "Company added successfully!");
      } else {
        const errorMsg = res.data.message || (editingId ? "Failed to update company" : "Failed to add company");
        console.error(`[COMPANIES] ${operation} failed:`, errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                       err.message || 
                       (editingId ? "Error updating company" : "Error adding company");
      console.error(`[COMPANIES] ${editingId ? "update" : "create"} error:`, {
        status: err.response?.status,
        message: errorMsg,
        fullError: err
      });
      setError(errorMsg);
    }
  };

  const handleEdit = (company) => {
    setEditingId(company.id);
    setFormData({
      company_name: company.company_name || "",
      website: company.website || "",
      hr_name: company.hr_name || "",
      hr_email: company.hr_email || "",
      hr_mobile: company.hr_mobile || "",
      location: company.location || "",
      logo_url: company.logo_url || "",
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      company_name: "",
      website: "",
      hr_name: "",
      hr_email: "",
      hr_mobile: "",
      location: "",
      logo_url: "",
    });
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        console.log(`[COMPANIES] Deleting company ID ${id}`);
        const res = await apiClient.delete(`/api/companies/${id}`);
        if (res.data.success) {
          console.log(`[COMPANIES] Delete successful: ID ${id}`);
          setCompanies(companies.filter((company) => company.id !== id));
          alert("Company deleted successfully!");
        } else {
          const errorMsg = res.data.message || "Failed to delete company";
          console.error("[COMPANIES] Delete failed:", errorMsg);
          setError(errorMsg);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || "Error deleting company";
        console.error("[COMPANIES] Delete error:", {
          id: id,
          status: err.response?.status,
          message: errorMsg,
          fullError: err
        });
        setError(errorMsg);
      }
    }
  };

  // Search by company name (primary) and location (secondary)
  const filteredCompanies = companies.filter(
    (company) => {
      const searchTerm = search.toLowerCase();
      return (
        company.company_name?.toLowerCase().includes(searchTerm) ||
        company.location?.toLowerCase().includes(searchTerm) ||
        company.hr_name?.toLowerCase().includes(searchTerm) ||
        company.hr_email?.toLowerCase().includes(searchTerm)
      );
    }
  );
  
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

        {/* Manage Companies Content */}
        <main className="dashboard-content">
          <div className="companies-container">

            <div className="companies-header">
                  <h2>Company Management</h2>
                </div>

                <div className="companies-actions">
                  <form onSubmit={handleSubmit}>
                    {editingId && (
                      <div style={{ marginBottom: "10px", padding: "10px", backgroundColor: "#e3f2fd", borderRadius: "4px", color: "#1976d2" }}>
                        ✎ Editing Company ID: {editingId}
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Enter Company Name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                    />

                    <input
                      type="text"
                      placeholder="HR Name"
                      name="hr_name"
                      value={formData.hr_name}
                      onChange={handleInputChange}
                    />

                    <input
                      type="email"
                      placeholder="HR Email"
                      name="hr_email"
                      value={formData.hr_email}
                      onChange={handleInputChange}
                    />

                    <input
                      type="text"
                      placeholder="HR Mobile"
                      name="hr_mobile"
                      value={formData.hr_mobile}
                      onChange={handleInputChange}
                    />

                    <input
                      type="text"
                      placeholder="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />

                    <input
                      type="url"
                      placeholder="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />

                    <button type="submit" className="add-btn">
                      {editingId ? "Update Company" : "Add Company"}
                    </button>
                    {editingId && (
                      <button type="button" className="cancel-btn" onClick={handleCancel} style={{ marginLeft: "10px", backgroundColor: "#d32f2f" }}>
                        Cancel
                      </button>
                    )}
                  </form>
                </div>

                <div className="search-section">
                  <input
                    type="text"
                    placeholder="🔍 Search by company name, location, HR name, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "4px", border: "1px solid #ddd" }}
                  />
                </div>

                {error && <div className="error-message" style={{ color: "red", padding: "10px", marginBottom: "10px", borderRadius: "4px", backgroundColor: "#ffebee" }}>{error}</div>}

                {loading ? (
                  <div style={{ padding: "20px", textAlign: "center" }}>Loading companies...</div>
                ) : companies.length === 0 ? (
                  <div style={{ padding: "20px", textAlign: "center" }}>No companies found. Add one to get started!</div>
                ) : (
                  <>
                    <div style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
                      Showing {filteredCompanies.length} of {companies.length} companies
                    </div>
            <div className="table-container">
              <table>
              <thead>
                  <tr>
                    <th>ID</th>
                    <th>Company Name</th>
                    <th>HR Name</th>
                    <th>HR Email</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
              </thead>

                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr key={company.id}>
                      <td>{company.id}</td>
                      <td>{company.company_name}</td>
                      <td>{company.hr_name || "—"}</td>
                      <td>{company.hr_email || "—"}</td>
                      <td>{company.location || "—"}</td>

                      <td>
                        <button type="button" className="edit-btn" onClick={() => handleEdit(company)}>
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(company.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
                  </>
                )}

          </div>
        </main>

      </div>

    </div>
  );
};

export default ManageCompaniesComp;