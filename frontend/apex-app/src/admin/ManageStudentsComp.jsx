import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import "./DashboardComp.css";
import "./ManageStudentsComp.css";
import { NavLink, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Get data from RDS
const ManageStudentsComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, jobTypeFilter, selectedDate]);

  useEffect(() => {
    fetchEnquiries();
  }, [searchTerm, currentPage, jobTypeFilter, selectedDate]);

  const recordsPerPage = 10;

  const fetchEnquiries = async () => {
    try {
      const params = {
        q: searchTerm || undefined,
        page: currentPage,
        perPage: recordsPerPage,
      };

      if (jobTypeFilter) params.job_type = jobTypeFilter;
      if (selectedDate) params.createdAt = selectedDate;

      const response = await apiClient.get("/api/student-enquiry", { params });

      // response: { success, data, page, perPage, total }
      const payload = response.data || {};
      setEnquiries(payload.data || []);
      setTotalCount(payload.total || 0);
    } catch (error) {
      console.error("Error fetching enquiries:", error, error.response && error.response.data ? error.response.data : null);
    }
  };

{/* Edit user details in RDS and send updated data to frontend */}
const [editingId, setEditingId] = useState(null);

const [editForm, setEditForm] = useState({
  full_name: "",
  phone: "",
  email: "",
  job_type: "",
  career_option: "",
});

{/*Delete user request from RDS and send updated data to frontend*/}
const deleteEnquiry = async (id) => {
  if (!window.confirm("Delete this record?")) return;

  await apiClient.delete(`/api/student-enquiry/${id}`);

  fetchEnquiries();
};

{/*Edit user request in RDS and send updated data to frontend*/}
const editEnquiry = (item) => {
  setEditingId(item.id);

  setEditForm({
    full_name: item.full_name,
    phone: item.phone,
    email: item.email,
    job_type: item.job_type,
    career_option: item.career_option,
  });
};

{/*Update user request in RDS and send updated data to frontend*/}
const updateEnquiry = async () => {
  await apiClient.put(
    `/api/student-enquiry/${editingId}`,
    editForm
  );

  setEditingId(null);

  fetchEnquiries();
};

{/*Excel export*/}
const exportExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Enquiries"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  const file = new Blob(
    [excelBuffer],
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  saveAs(file, `${fileName}.xlsx`);
};

{/*Datewise filter or download*/}
const downloadByDate = async () => {
  const res = await apiClient.get(
    `/api/student-enquiry/date/${selectedDate}`
  );

  exportExcel(
    res.data,
    `Enquiries_${selectedDate}`
  );
};

{/*Monthwise filter or download*/}
const downloadByMonth = async () => {
  const res = await apiClient.get(
    `/api/student-enquiry/month/${selectedMonth}`
  );

  exportExcel(
    res.data,
    `Enquiries_${selectedMonth}`
  );
};

{/*Pagination*/}
const totalPages = Math.max(1, Math.ceil(totalCount / recordsPerPage));

const nextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

const prevPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};

{/*sidebar menu items*/}
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
                      {/* Content */}
<main className="dashboard-content">
  <div>
    <h2>Student Enquiries</h2>

    <div className="report-filters">
      <input
        type="text"
        placeholder="Search name, email, phone, job type or career..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '6px', marginRight: 8, minWidth: 260 }}
      />
        <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)} style={{ padding: '6px', marginRight: 8 }}>
          <option value="">All Job Types</option>
          <option value="IT">IT</option>
          <option value="Non-IT">Non-IT</option>
        </select>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <button onClick={downloadByDate}>
        Download Date Report
      </button>

      <input
        type="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      />

      <button onClick={downloadByMonth}>
        Download Monthly Report
      </button>
    </div>

    <div className="table-container">
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Job Type</th>
            <th>Career Option</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {enquiries.length > 0 ? (
            enquiries.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>
                  {editingId === item.id ? (
                    <input
                      value={editForm.full_name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          full_name: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.full_name
                  )}
                </td>

                <td>
                  {editingId === item.id ? (
                    <input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.phone
                  )}
                </td>

                <td>
                  {editingId === item.id ? (
                    <input
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.email
                  )}
                </td>

                <td>
                  {editingId === item.id ? (
                    <input
                      value={editForm.job_type}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          job_type: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.job_type
                  )}
                </td>

                <td>
                  {editingId === item.id ? (
                    <input
                      value={editForm.career_option}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          career_option: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.career_option
                  )}
                </td>

                <td>
                  {new Date(item.created_at).toLocaleDateString()}
                </td>

                <td>
                  {editingId === item.id ? (
                    <>
                      <button onClick={updateEnquiry}>
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => editEnquiry(item)}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteEnquiry(item.id)
                        }
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
              ))
          ) : (
            <tr>
              <td colSpan="8">No data found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</main>

      </div>
      <div className="pagination-container">
  <button
    onClick={prevPage}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  <span>
    Page {currentPage} of {totalPages} ({enquiries.length} records shown, {totalCount} total)
  </span>

  <button
    onClick={nextPage}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>
    </div>
  );
};

export default ManageStudentsComp;