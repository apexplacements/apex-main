import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DashboardComp.css";
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
  });

  const recordsPerPage = 10;

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Add Course
  const addCourse = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/courses", courseForm);

      fetchCourses();

      setCourseForm({
        course_name: "",
        duration: "",
        fee: "",
        trainer_name: "",
        description: "",
        image_url: "",
      });
    } catch (error) {
      console.error("Error adding course:", error);
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
    { name: "Manage Users", path: "/manage-users" },
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

          <form onSubmit={addCourse} className="course-form">

            <input
              type="text"
              placeholder="Course Name"
              value={courseForm.course_name}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  course_name: e.target.value,
                })
              }
              required
            />

            <input
              type="text"
              placeholder="Duration"
              value={courseForm.duration}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  duration: e.target.value,
                })
              }
              required
            />

            <input
              type="number"
              placeholder="Fee"
              value={courseForm.fee}
              onChange={(e) =>
                setCourseForm({
                  ...courseForm,
                  fee: e.target.value,
                })
              }
              required
            />

            <button type="submit">
              Add Course
            </button>

          </form>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Course</th>
                  <th>Duration</th>
                  <th>Fee</th>
                  <th>Trainer</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentCourses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.id}</td>
                    <td>{course.course_name}</td>
                    <td>{course.duration}</td>
                    <td>{course.fee}</td>
                    <td>{course.trainer_name}</td>

                    <td>
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
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