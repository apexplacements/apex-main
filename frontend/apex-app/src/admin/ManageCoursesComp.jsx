import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";
import "./DashboardComp.css";
import "./ManageCoursesComp.css";
import { NavLink, useNavigate } from "react-router-dom";

const ManageCoursesComp = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [courseForm, setCourseForm] = useState({
    course_name: "",
    duration: "",
    fee: "",
    trainer_name: "",
    description: "",
    image_url: "",
    course_type: "",
  });
  const [jobTypes, setJobTypes] = useState([]);
  const [careerOptions, setCareerOptions] = useState([]);
  const [studentEnquiries, setStudentEnquiries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const recordsPerPage = 10;

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const response = await apiClient.get("/api/courses");
      setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchEnquiryJobTypes = async () => {
    try {
      const res = await apiClient.get('/api/student-enquiry', { params: { page: 1, perPage: 1000 } });
      const rows = (res.data && res.data.data) || [];
      setStudentEnquiries(rows);
      const types = Array.from(new Set(rows.map(r => r.job_type).filter(Boolean)));
      setJobTypes(types);
      const careers = Array.from(new Set(rows.map(r => r.career_option).filter(Boolean)));
      setCareerOptions(careers);
    } catch (err) {
      console.error('Failed to fetch enquiry job types', err);
    }
  };

  const normalizeType = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const getCourseOptions = (type) => {
    const normalizedSelected = normalizeType(type);
    const filtered = studentEnquiries.filter((se) => {
      if (!normalizedSelected) return true;
      return normalizeType(se.job_type) === normalizedSelected;
    });
    const opts = Array.from(new Set(filtered.map((se) => se.career_option).filter(Boolean)));
    return opts;
  };

  useEffect(() => {
    fetchCourses();
    fetchEnquiryJobTypes();
  }, []);

  // Add Course
  const addCourse = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...courseForm };
      if (payload.course_name === '__other') {
        payload.course_name = payload.course_name_manual || '';
      }
      // remove temporary manual field
      delete payload.course_name_manual;

      await apiClient.post("/api/courses", payload);
      fetchCourses();
      setCourseForm({
        course_name: "",
        course_name_manual: "",
        duration: "",
        fee: "",
        trainer_name: "",
        description: "",
        image_url: "",
        course_type: "",
      });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const editCourse = (c) => {
    setEditingId(c.id);
    setEditForm({
      course_name: c.course_name || '',
      duration: c.duration || '',
      fee: c.fee || '',
      trainer_name: c.trainer_name || '',
      description: c.description || '',
      image_url: c.image_url || '',
      course_type: c.course_type || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      await apiClient.put(`/api/courses/${id}`, editForm);
      setEditingId(null);
      fetchCourses();
    } catch (err) {
      console.error('Error updating course', err);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await apiClient.delete(`/api/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error('Error deleting course', err);
    }
  };

  // Search Logic
  const filteredCourses = courses.filter((course) =>
    Object.values(course)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Pagination Logic
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;

  const currentCourses = filteredCourses.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredCourses.length / recordsPerPage
  );

  // Sidebar Menu Items
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
        <main className="course-content">

          <h2>Manage Courses</h2>

          <input
            type="text"
            placeholder="Search Courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <form onSubmit={addCourse} className="add-course-form">
            <label>Industry Type</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={courseForm.course_type}
                onChange={(e) => setCourseForm({ ...courseForm, course_type: e.target.value, course_name: '' })}
                required
              >
                <option value="">Select industry type</option>
                <option value="IT">IT</option>
                <option value="Non-IT">Non-IT</option>
                {jobTypes
                  .filter((t) => !['IT', 'Non-IT'].includes(t))
                  .map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
              </select>
            </div>

            <label>Course Name</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={courseForm.course_name}
                onChange={(e) => setCourseForm({ ...courseForm, course_name: e.target.value })}
                required
              >
                <option value="">Select course</option>
                {getCourseOptions(courseForm.course_type).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="__other">Other (enter manually)</option>
              </select>
              {courseForm.course_name === '__other' && (
                <input
                  type="text"
                  placeholder="Enter course name"
                  value={courseForm.course_name_manual || ''}
                  onChange={(e) => setCourseForm({ ...courseForm, course_name_manual: e.target.value })}
                  required
                />
              )}
            </div>

            <label>Duration</label>
            <input
              type="text"
              name="duration"
              placeholder="Enter Duration"
              value={courseForm.duration}
              onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
              required
            />

            <label>Fee</label>
            <input
              type="text"
              name="fee"
              placeholder="Enter Fee"
              value={courseForm.fee}
              onChange={(e) => setCourseForm({ ...courseForm, fee: e.target.value })}
              required
            />

            <button type="submit">Add Course</button>
          </form>

          

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course-IT</th>
                  <th>Course-Non-IT</th>
                  <th>Duration</th>
                  <th>Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    {editingId === course.id ? (
                      <>
                        <td>
                          {editForm.course_type === 'IT' ? (
                            <input
                              value={editForm.course_name}
                              onChange={(e) => setEditForm({ ...editForm, course_name: e.target.value })}
                            />
                          ) : (
                            <input disabled placeholder="-" />
                          )}
                        </td>

                        <td>
                          {editForm.course_type === 'Non-IT' ? (
                            <input
                              value={editForm.course_name}
                              onChange={(e) => setEditForm({ ...editForm, course_name: e.target.value })}
                            />
                          ) : (
                            <input disabled placeholder="-" />
                          )}
                        </td>

                        <td>
                          <input value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} />
                        </td>

                        <td>
                          <input value={editForm.fee} onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })} />
                        </td>

                        <td>
                          <input value={editForm.trainer_name} onChange={(e) => setEditForm({ ...editForm, trainer_name: e.target.value })} />
                        </td>

                        <td>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <select value={editForm.course_type} onChange={(e) => setEditForm({ ...editForm, course_type: e.target.value })}>
                              <option value="">Select</option>
                              <option value="IT">IT</option>
                              <option value="Non-IT">Non-IT</option>
                            </select>
                            <button onClick={() => saveEdit(course.id)}>Save</button>
                            <button onClick={cancelEdit}>Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{course.course_type === 'IT' ? course.course_name : '-'}</td>
                        <td>{course.course_type === 'Non-IT' ? course.course_name : '-'}</td>
                        <td>{course.duration}</td>
                        <td>{course.fee}</td>
                        <td>
                          <button onClick={() => editCourse(course)}>Edit</button>
                          <button onClick={() => deleteCourse(course.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            {Array.from(
              { length: totalPages },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>

        </main>
      </div>
    </div>
    
  );
};

export default ManageCoursesComp;