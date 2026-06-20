import React, { useState, useEffect } from "react";
import "./DashboardComp.css";
import "./PlacementDrivesComp.css";
import { NavLink, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import { isAdmin } from "../utils/auth";

const PlacementDrivesComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadDrives();
    fetchCompanies();
  }, []);

  const sanitizeValue = (v) => {
    if (typeof v === 'function') return '[Function]';
    if (v === null || v === undefined) return '';
    return v;
  };

  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    const out = {};
    Object.keys(obj).forEach(k => {
      const v = obj[k];
      out[k] = typeof v === 'function' ? '' : v;
    });
    return out;
  };

  const loadDrives = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.get('/api/placement-drives');
      if (res.data && res.data.success) setDrives(res.data.data || []);
    } catch (e) {
      console.error('Failed loading placement drives', e);
      setError('Failed to load placement drives');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing({ company_name: '', role_name: '', location: '', ctc: '', interview_date: '', eligibility: '', status: 'Active', _manualCompany: false });
    setFormVisible(true);
  };

  const openEdit = (drive) => {
    setEditing(sanitizeObject(drive));
    setFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this placement drive?')) return;
    try {
      await apiClient.delete(`/api/placement-drives/${id}`);
      setDrives((d) => d.filter((x) => x.id !== id));
    } catch (e) {
      console.error('Delete failed', e);
      setError('Failed to delete');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // client-side validation
    const ve = {};
    if (!editing || !(editing.company_name && String(editing.company_name).trim())) ve.company_name = 'Company is required';
    if (!editing || !(editing.role_name && String(editing.role_name).trim())) ve.role_name = 'Role is required';
    setValidationErrors(ve);
    if (Object.keys(ve).length) return;

    try {
      console.log('[PlacementDrives] submitting', editing);
      if (editing.id) {
        const res = await apiClient.put(`/api/placement-drives/${editing.id}`, editing);
        console.log('[PlacementDrives] update response', res && res.data);
      } else {
        const res = await apiClient.post('/api/placement-drives', editing);
        console.log('[PlacementDrives] create response', res && res.data);
        if (res && res.data && res.data.id) editing.id = res.data.id;
        // show success toast and keep admin UI on page
        setSuccessMessage('Placement drive created');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
      // refresh admin list
      await loadDrives();
      setFormVisible(false);
      setEditing(null);
    } catch (err) {
      console.error('Save failed', err.response || err.message || err);
      setError('Failed to save placement drive: ' + (err.response?.data?.message || err.message || ''));
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await apiClient.get('/api/companies');
      if (res.data && res.data.success) setCompanies(res.data.data || []);
    } catch (err) {
      console.error('Failed to load companies', err);
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
            navigate("/");
          }}
        >
          Logout
        </button>

      </header>

      {/* Main Layout */}
      <div className="main-layout">

        {/* Sidebar */}
        {isAdmin() && (
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
        )}

        {/* Placement Drives Content */}
        <main className="dashboard-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Placement Drives</h2>
              <div>
                <button className="btn" onClick={openCreate} style={{ marginRight: 8 }}>New Drive</button>
                <NavLink to="/placement-drives" className="btn">Open Placement UI</NavLink>
              </div>
            </div>

            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            {successMessage && (
              <div style={{ marginTop: 8, padding: 8, background: '#e6ffed', color: '#064e3b', borderRadius: 4 }}>{successMessage}</div>
            )}

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
              <input placeholder="Search company or role" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} style={{ padding: 8, flex: 1 }} />
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Closed">Closed</option>
              </select>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <button className="btn" onClick={() => { setQuery(''); setStatusFilter(''); setPage(1); }}>Clear</button>
            </div>

            {formVisible && editing && (
              <form onSubmit={handleFormSubmit} style={{ marginTop: 12, background: '#fff', padding: 12, borderRadius: 6 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label>Company</label>
                    <div>
                      <select value={editing._manualCompany ? '__other__' : (editing.company_name || '')} onChange={(e) => {
                        const v = e.target.value;
                        if (v === '__other__') {
                          setEditing({ ...editing, company_name: '', _manualCompany: true });
                        } else {
                          setEditing({ ...editing, company_name: v, _manualCompany: false });
                        }
                      }} style={{ width: '100%', padding: 6 }}>
                        <option value="">-- Select Company --</option>
                        {companies.map(c => <option key={c.id} value={c.company_name}>{c.company_name}</option>)}
                        <option value="__other__">Other (enter manually)</option>
                      </select>
                    </div>
                    {editing._manualCompany && (
                      <div>
                        <input placeholder="Enter company name" value={editing.company_name} onChange={(e) => setEditing({ ...editing, company_name: e.target.value })} style={{ marginTop: 6, width: '100%' }} />
                        {validationErrors.company_name && <div style={{ color: 'red', marginTop: 6 }}>{validationErrors.company_name}</div>}
                      </div>
                    )}
                  </div>
                  <div>
                    <input placeholder="Role" value={editing.role_name} onChange={(e) => setEditing({ ...editing, role_name: e.target.value })} />
                    {validationErrors.role_name && <div style={{ color: 'red', marginTop: 6 }}>{validationErrors.role_name}</div>}
                  </div>
                  <input placeholder="Location" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} />
                  <input placeholder="CTC" value={editing.ctc} onChange={(e) => setEditing({ ...editing, ctc: e.target.value })} />
                  <input type="date" placeholder="Interview Date" value={editing.interview_date ? editing.interview_date.split('T')[0] : ''} onChange={(e) => setEditing({ ...editing, interview_date: e.target.value })} />
                  <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                    <option>Active</option>
                    <option>Closed</option>
                    <option>Scheduled</option>
                  </select>
                </div>
                <div style={{ marginTop: 8 }}>
                  <textarea placeholder="Eligibility" value={editing.eligibility} onChange={(e) => setEditing({ ...editing, eligibility: e.target.value })} style={{ width: '100%', minHeight: 60 }} />
                </div>
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button className="btn" type="submit">Save</button>
                  <button className="btn" type="button" onClick={() => { setFormVisible(false); setEditing(null); }}>Cancel</button>
                </div>
              </form>
            )}

            {loading ? <div style={{ padding: 20 }}>Loading...</div> : (
              <div style={{ marginTop: 16 }}>
                {drives.length === 0 ? <div>No placement drives found.</div> : (
                  (() => {
                    const q = query.trim().toLowerCase();
                    const filtered = drives.filter(d => {
                      if (statusFilter && d.status !== statusFilter) return false;
                      if (!q) return true;
                      return (d.company_name || '').toLowerCase().includes(q) || (d.role_name || '').toLowerCase().includes(q) || (d.location || '').toLowerCase().includes(q);
                    });
                    const total = filtered.length;
                    const totalPages = Math.max(1, Math.ceil(total / pageSize));
                    const currentPage = Math.min(page, totalPages);
                    const start = (currentPage - 1) * pageSize;
                    const pageItems = filtered.slice(start, start + pageSize);

                    return (
                      <div>
                        <div style={{ marginBottom: 8, color: '#666' }}>Showing {pageItems.length} of {total} drives</div>
                        <table style={{ width: '100%', background: '#fff', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: 8 }}>Company</th>
                        <th style={{ padding: 8 }}>Role</th>
                        <th style={{ padding: 8 }}>Date</th>
                        <th style={{ padding: 8 }}>Location</th>
                        <th style={{ padding: 8 }}>CTC</th>
                        <th style={{ padding: 8 }}>Status</th>
                        <th style={{ padding: 8 }}>Actions</th>
                      </tr>
                    </thead>
                       <tbody>
                        {pageItems.map((d) => (
                          <tr key={d.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: 8 }}>{String(sanitizeValue(d.company_name) || '-')}</td>
                            <td style={{ padding: 8 }}>{String(sanitizeValue(d.role_name) || '-')}</td>
                            <td style={{ padding: 8 }}>{d.interview_date ? String(new Date(d.interview_date).toLocaleDateString()) : '-'}</td>
                            <td style={{ padding: 8 }}>{String(sanitizeValue(d.location) || '-')}</td>
                            <td style={{ padding: 8 }}>{String(sanitizeValue(d.ctc) || '-')}</td>
                            <td style={{ padding: 8 }}>{String(sanitizeValue(d.status) || '-')}</td>
                            <td style={{ padding: 8 }}>
                              <button className="btn" onClick={() => openEdit(d)} style={{ marginRight: 6 }}>Edit</button>
                              <button className="btn" onClick={() => handleDelete(d.id)} style={{ marginRight: 6 }}>Delete</button>
                              <NavLink to={`/placement/drives`} className="btn">Preview</NavLink>
                            </td>
                          </tr>
                        ))}
                       </tbody>
                      </table>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button className="btn" disabled={currentPage <= 1} onClick={() => setPage(1)}>First</button>
                        <button className="btn" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>Prev</button>
                        <span>Page {currentPage} / {totalPages}</span>
                        <button className="btn" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>Next</button>
                        <button className="btn" disabled={currentPage >= totalPages} onClick={() => setPage(totalPages)}>Last</button>
                      </div>
                    </div>
                    );
                  })()
                )}
              </div>
            )}
        </main>     
              

      </div>

    </div>
  );
};

export default PlacementDrivesComp;