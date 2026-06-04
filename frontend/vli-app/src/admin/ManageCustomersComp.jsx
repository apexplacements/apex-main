import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardComp.css";
import "./ManageCoursesComp.css";
import { NavLink, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Get data from RDS
const ManageCustomersComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get("/api/customer-requests");

      setEnquiries(response.data.data);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    }
  };

{/* Edit customer details in RDS and send updated data to frontend */}
const [editingId, setEditingId] = useState(null);

const [editForm, setEditForm] = useState({
  full_name: "",
  phone: "",
  email: "",
  support_type: "",
});

const [selectedDate, setSelectedDate] = useState("");
const [selectedMonth, setSelectedMonth] = useState("");

{/*Delete customer request from RDS and send updated data to frontend*/}
const deleteEnquiry = async (id) => {
  if (!window.confirm("Delete this record?")) return;

  await axios.delete(`/api/customer-requests/${id}`);

  fetchEnquiries();
};

{/*Edit customer request in RDS and send updated data to frontend*/}
const editEnquiry = (item) => {
  setEditingId(item.id);

  setEditForm({
    full_name: item.full_name,
    phone: item.phone,
    email: item.email,
    support_type: item.support_type,
  });
};

{/*Update customer request in RDS and send updated data to frontend*/}
const updateEnquiry = async () => {
  await axios.put(
    `/api/customer-requests/${editingId}`,
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
    "Customer Requests"
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
  const res = await axios.get(
    `/api/customer-requests/date/${selectedDate}`
  );

  exportExcel(
    res.data,
    `CustomerRequests_${selectedDate}`
  );
};

{/*Monthwise filter or download*/}
const downloadByMonth = async () => {
  const res = await axios.get(
    `/api/customer-requests/month/${selectedMonth}`
  );

  exportExcel(
    res.data,
    `CustomerRequests_${selectedMonth}`
  );
};

{/*Pagination*/}
const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 10;
// Pagination Logic
const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

const currentRecords = enquiries.slice(
  indexOfFirstRecord,
  indexOfLastRecord
);

const totalPages = Math.ceil(
  enquiries.length / recordsPerPage
);

const nextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

{/*sidebar menu items*/}
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
                      {/* Content */}
<main className="dashboard-content">
  <div>
    <h2>Customer Requests</h2>

    <div className="report-filters">
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
            <th>Support Type</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((item) => (
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
                      value={editForm.support_type}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          support_type: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.support_type
                  )}
                </td>

                <td>
                  {editingId === item.id ? (
                    <input
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    item.description
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
              <td colSpan="7">No data found</td>
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
    Page {currentPage} of {totalPages}
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

export default ManageCustomersComp;