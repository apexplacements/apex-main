import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const CompaniesComp = ({ companies, onRefresh }) => {
  const [form, setForm] = useState({
    company_id: "",
    apply_link: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        // Update existing apply link
        await apiClient.put(`/api/companies/${editingId}`, {
          apply_link: form.apply_link,
        });
        setSuccess("Apply link updated successfully!");
        setEditingId(null);
      } else {
        // Create new apply link entry
        const companyId = form.company_id;
        const selectedCompany = companies.find((c) => c.id === parseInt(companyId));
        
        if (!selectedCompany) {
          setError("Please select a company");
          setLoading(false);
          return;
        }

        // Update company with apply link
        await apiClient.put(`/api/companies/${companyId}`, {
          apply_link: form.apply_link,
        });
        setSuccess("Apply link added successfully!");
      }

      setForm({ company_id: "", apply_link: "" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save apply link");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (companyId, link) => {
    setEditingId(companyId);
    setForm({ company_id: companyId, apply_link: link });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ company_id: "", apply_link: "" });
    setError("");
  };

  // Filter companies by search
  const filteredCompanies = companies.filter(
    (company) =>
      (company.company_name && company.company_name.toLowerCase().includes(search.toLowerCase())) ||
      (company.hr_email && company.hr_email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="section-container">
      <h2>Companies Management</h2>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by company name or HR email..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-grid">
          <div>
            <label htmlFor="company_id">Select Company</label>
            <select
              id="company_id"
              name="company_id"
              value={form.company_id}
              onChange={handleInputChange}
              required
              disabled={editingId !== null}
            >
              <option value="">Choose a company...</option>
              {filteredCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.company_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="apply_link">Apply Link</label>
            <input
              id="apply_link"
              type="url"
              name="apply_link"
              placeholder="https://example.com/careers"
              value={form.apply_link}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? (editingId ? "Updating..." : "Adding...") : editingId ? "Update Link" : "Add Link"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table Section */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>HR Name</th>
              <th>HR Email</th>
              <th>HR Mobile</th>
              <th>Apply Link</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <tr key={company.id}>
                  <td>
                    <strong>{company.company_name}</strong>
                  </td>
                  <td>{company.hr_name}</td>
                  <td>{company.hr_email}</td>
                  <td>{company.hr_mobile}</td>
                  <td>
                    {company.apply_link ? (
                      <a href={company.apply_link} target="_blank" rel="noopener noreferrer" className="link-badge">
                        View Link
                      </a>
                    ) : (
                      <span className="no-link">No link</span>
                    )}
                  </td>
                  <td>{company.location}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(company.id, company.apply_link || "")}
                      disabled={loading}
                    >
                      {editingId === company.id ? "Editing..." : "Edit"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No companies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-info">
        Showing {filteredCompanies.length} of {companies.length} companies
      </div>
    </div>
  );
};

export default CompaniesComp;
