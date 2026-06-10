import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import "./DashboardComp.css";
import "./CreateBatches.css";
import { NavLink, useNavigate } from "react-router-dom";

const CreateBatchesComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  {/* Content for Create New Batches can be added here */ }
  const [formData, setFormData] = useState({
  course_name: "",
  trainer_name: "",
  course_type: "",
  start_date: "",
  end_date: "",
  course_duration: "",
});
const [selectedCourseType, setSelectedCourseType] = useState("");
const [batches, setBatches] = useState([]);
const [jobTypes, setJobTypes] = useState([]);
const [courses, setCourses] = useState([]);
const [trainers, setTrainers] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 5;
const [totalCount, setTotalCount] = useState(0);
const [editingId, setEditingId] = useState(null);
const [editForm, setEditForm] = useState({});

const fetchBatches = async (page = currentPage, q = searchTerm) => {
  try {
    const params = { page, perPage: recordsPerPage };
    if (q) params.q = q;
    const res = await apiClient.get('/api/batches', { params });
    if (res.data) {
      setBatches(res.data.data || []);
      setTotalCount(res.data.total || 0);
      setCurrentPage(res.data.page || page);
    }
  } catch (err) {
    console.error('Failed to fetch batches', err, err.response && err.response.data ? err.response.data : null);
  }
};

useEffect(() => {
  fetchBatches(1, searchTerm);
  fetchEnquiryJobTypes();
  fetchCourses();
  fetchTrainers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

useEffect(() => {
  // when search term changes, reset to first page
  setCurrentPage(1);
  fetchBatches(1, searchTerm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchTerm]);

useEffect(() => {
  fetchBatches(currentPage, searchTerm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentPage]);

const fetchEnquiryJobTypes = async () => {
  try {
    // fetch a reasonable number of enquiries and extract unique job_type values
    const res = await apiClient.get('/api/student-enquiry', { params: { page: 1, perPage: 1000 } });
    const rows = (res.data && res.data.data) || [];
    const types = Array.from(new Set(rows.map(r => r.job_type).filter(Boolean)));
    setJobTypes(types);
  } catch (err) {
    console.error('Failed to fetch enquiry job types', err);
  }
};

const fetchCourses = async () => {
  try {
    const res = await apiClient.get('/api/courses');
    if (res.data && res.data.data) setCourses(res.data.data);
  } catch (err) {
    console.error('Failed to fetch courses', err);
  }
};

const fetchTrainers = async () => {
  try {
    const res = await apiClient.get('/api/trainers');
    if (res.data && res.data.data) setTrainers(res.data.data);
  } catch (err) {
    console.error('Failed to fetch trainers', err);
  }
};

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

{/* Form submission handler */}
const createBatch = async (e) => {
  e.preventDefault();

  try {
    await apiClient.post("/api/batches", formData);

    alert("Batch Created Successfully");

    setFormData({
      course_name: "",
      trainer_name: "",
      course_type: "",
      start_date: "",
      end_date: "",
    });
    // refresh list
    fetchBatches(1, searchTerm);

  } catch (err) {
    console.error(err);
  }
};

const editBatch = (b) => {
  setEditingId(b.id);
  setEditForm({
    course_name: b.course_name || '',
    trainer_name: b.trainer_name || '',
    start_date: b.start_date ? b.start_date.split('T')[0] : '',
    end_date: b.end_date ? b.end_date.split('T')[0] : '',
  });
};

const cancelEdit = () => {
  setEditingId(null);
  setEditForm({});
};

const saveEdit = async (id) => {
  try {
    await apiClient.put(`/api/batches/${id}`, editForm);
    setEditingId(null);
    fetchBatches(currentPage, searchTerm);
  } catch (err) {
    console.error('Failed to update batch', err);
  }
};

const deleteBatch = async (id) => {
  if (!window.confirm('Delete this batch?')) return;
  try {
    await apiClient.delete(`/api/batches/${id}`);
    // reload page (ensure valid currentPage)
    fetchBatches(currentPage, searchTerm);
  } catch (err) {
    console.error('Failed to delete batch', err);
  }
};

  // Sidebar menu items
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

        {/* Content */}
        <main className="dashboard-content">
          <h2>Create New Batches</h2>
          <p>Here you can create new batches for your courses.</p>

          {/* Form to create new batches */}
          <form className="batch-form" onSubmit={createBatch}>
            <div className="form-group">
              <label htmlFor="course-type">Course Type:</label>
              <select
                id="course-type"
                name="course_type"
                value={formData.course_type}
                onChange={(e) => {
                  const val = e.target.value;
                  // set both formData and selectedCourseType for filtering
                  setFormData({ ...formData, course_type: val, course_name: '', trainer_name: '' });
                  setSelectedCourseType(val);
                }}
                required
              >
                <option value="">Select course type</option>
                <option value="IT">IT</option>
                <option value="Non-IT">Non-IT</option>
              </select>

              <label htmlFor="course">Course Name:</label>
              <select
                id="course"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                required
              >
                <option value="">Select course</option>
                {courses
                  .filter((c) => {
                    if (!selectedCourseType) return true;
                    // some rows may have course_type field, match case-insensitive
                    return String(c.course_type || '').toLowerCase() === String(selectedCourseType).toLowerCase();
                  })
                  .map((c) => (
                    <option key={c.id} value={c.course_name}>{c.course_name}</option>
                  ))}
              </select>
              <label htmlFor="trainer">Trainer Name:</label>
              <select
                id="trainer"
                name="trainer_name"
                value={formData.trainer_name}
                onChange={handleChange}
                required
              >
                <option value="">Select trainer</option>
                {trainers
                  .filter((t) => {
                    if (!selectedCourseType) return true;
                    // match trainer.course (which stores course name or type) against the selected course_type
                    // if trainer.course equals a course_name, ensure that course has matching course_type
                    // build a set of allowed course names
                    const allowedCourseNames = new Set(courses.filter(c => String(c.course_type || '').toLowerCase() === String(selectedCourseType).toLowerCase()).map(c => c.course_name));
                    // trainer.course may be a course name
                    if (allowedCourseNames.has(t.course)) return true;
                    // fallback: if trainer.course equals the course type string itself
                    return String(t.course || '').toLowerCase() === String(selectedCourseType).toLowerCase();
                  })
                  .map((t) => (
                    <option key={t.id} value={t.trainer_name}>{t.trainer_name}</option>
                  ))}
              </select>
              
              <label htmlFor="start-date">Start Date:</label>
              <input
                type="date"
                id="start-date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
              <label htmlFor="end-date">End Date:</label>
              <input
                type="date"
                id="end-date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
              
            </div>
            <button type="submit">Create Batch</button>
          </form>

          {/* Existing batches */}
          <section className="batches-list">
          <h3>Existing Batches</h3>

  <div style={{ marginBottom: 12 }}>
    <input
      type="text"
      placeholder="Search course or trainer..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ padding: 6, minWidth: 260 }}
    />
  </div>

  {batches.length === 0 ? (
    <p>No batches found.</p>
  ) : (
    <div className="table-responsive">
      <table className="batches-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Course</th>
            <th>Trainer</th>
            <th>Course Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>

              {editingId === b.id ? (
                <>
                  <td>
                    <input value={editForm.course_name} onChange={(e) => setEditForm({ ...editForm, course_name: e.target.value })} />
                  </td>
                  <td>
                    <input value={editForm.trainer_name} onChange={(e) => setEditForm({ ...editForm, trainer_name: e.target.value })} />
                  </td>
                  <td>{b.course_type}</td>
                  <td>
                    <input type="date" value={editForm.start_date} onChange={(e) => setEditForm({ ...editForm, start_date: e.target.value })} />
                  </td>
                  <td>
                    <input type="date" value={editForm.end_date} onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })} />
                  </td>
                  <td>{(() => {
                      try {
                        if (!editForm.start_date || !editForm.end_date) return '-';
                        const s = new Date(editForm.start_date);
                        const e = new Date(editForm.end_date);
                        const msPerDay = 1000 * 60 * 60 * 24;
                        const diff = Math.round((e - s) / msPerDay) + 1;
                        return diff >= 0 ? diff : '-';
                      } catch (err) { return '-'; }
                    })()}</td>
                  <td className="action-cell">
                        <button
                          className="save-btn"
                          onClick={() => saveEdit(b.id)}
                        >
                          Save
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </td>
                </>
              ) : (
                <>
                  <td>{b.course_name}</td>
                  <td>{b.trainer_name}</td>
                  <td>{b.course_type}</td>
                  <td>{b.start_date ? new Date(b.start_date).toLocaleDateString() : '-'}</td>
                  <td>{b.end_date ? new Date(b.end_date).toLocaleDateString() : '-'}</td>
                  <td>{(() => {
                    try {
                      if (!b.start_date || !b.end_date) return '-';
                      const s = new Date(b.start_date);
                      const e = new Date(b.end_date);
                      const msPerDay = 1000 * 60 * 60 * 24;
                      const diff = Math.round((e - s) / msPerDay) + 1; // inclusive
                      return diff >= 0 ? diff : '-';
                    } catch (err) {
                      return '-';
                    }
                  })()}</td>
                  <td className="action-cell">
                  <button
                    className="edit-btn"
                    onClick={() => editBatch(b)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteBatch(b.id)}
                  >
                    Delete
                  </button>
                </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 12 }}>
    <button onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
    <div style={{ alignSelf: 'center' }}>
      Page {currentPage} of {Math.max(1, Math.ceil(totalCount / recordsPerPage))} ({batches.length} shown, {totalCount} total)
    </div>
    <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= Math.ceil(totalCount / recordsPerPage)}>Next</button>
  </div>
</section>
        </main>
      </div>
    </div>
  );
};

export default CreateBatchesComp;