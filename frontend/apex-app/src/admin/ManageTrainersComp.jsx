import React, { useState, useEffect } from "react";
import "./DashboardComp.css";
import "./ManageTrainersComp.css";
import { NavLink, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ManageTrainersComp = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Trainers data and form state
  const [trainers, setTrainers] = useState([]);
  const [trainerForm, setTrainerForm] = useState({
    trainer_name: "",
    mobile: "",
    course: "",
    experience: "",
    info: "",
    key_points: "",
    photo_url: "",
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleTrainerInputChange = (e) => {
    const { name, value } = e.target;
    setTrainerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchTrainers = async () => {
    try {
      const res = await apiClient.get("/api/trainers");
      if (res.data && res.data.data) setTrainers(res.data.data);
    } catch (err) {
      console.error("Failed to load trainers", err);
    }
  };

useEffect(() => {
  fetchTrainers();
}, []);

// Add trainer
const addTrainer = async (e) => {
  e.preventDefault();

  try {
    await apiClient.post("/api/trainers", trainerForm);
    setTrainerForm({
      trainer_name: "",
      mobile: "",
      course: "",
      experience: "",
      info: "",
      key_points: "",
      photo_url: "",
    });
    fetchTrainers();
  } catch (err) {
    console.error("Failed to add trainer", err);
  }
};

const updateTrainer = async () => {
  try {
    await apiClient.put(`/api/trainers/${editingId}`, trainerForm);
    setEditingId(null);
    setTrainerForm({
      trainer_name: "",
      mobile: "",
      course: "",
      experience: "",
      info: "",
      key_points: "",
      photo_url: "",
    });
    fetchTrainers();
  } catch (err) {
    console.error("Failed to update trainer", err);
  }
};

const handleTrainerSubmit = async (e) => {
  if (editingId) {
    e.preventDefault();
    await updateTrainer();
  } else {
    await addTrainer(e);
  }
};

const editTrainer = (trainer) => {
  setEditingId(trainer.id);
  setTrainerForm({
    trainer_name: trainer.trainer_name || "",
    mobile: trainer.mobile || "",
    course: trainer.course || "",
    experience: trainer.experience || "",
    info: trainer.info || "",
    key_points: trainer.key_points || "",
    photo_url: trainer.photo_url || "",
  });
};

const deleteTrainer = async (id) => {
  if (typeof window !== "undefined" && window.confirm("Delete this trainer?")) {
    try {
      await apiClient.delete(`/api/trainers/${id}`);
      fetchTrainers();
    } catch (err) {
      console.error("Failed to delete trainer", err);
    }
  }
};

// Download Excel
const downloadExcel = () => {
  const worksheet =
    XLSX.utils.json_to_sheet(
      trainers
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Trainers"
  );

  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  saveAs(
    new Blob([excelBuffer]),
    "Trainers.xlsx"
  );
};

// PDF Download
const downloadPDF = () => {
  const doc = new jsPDF();

  autoTable(doc, {
    head: [
      [
        "ID",
        "Name",
        "Mobile",
        "Course",
        "Experience",
      ],
    ],

    body: trainers.map(
      (trainer) => [
        trainer.id,
        trainer.trainer_name,
        trainer.mobile,
        trainer.course,
        trainer.experience,
      ]
    ),
  });

  doc.save("Trainers.pdf");
};



  // Pagination and Search State
  const recordsPerPage = 10;

const indexOfLast = currentPage * recordsPerPage;
const indexOfFirst = indexOfLast - recordsPerPage;

// Filter trainers by search
const filteredTrainers = trainers.filter((trainer) =>
  Object.values(trainer).join(" ").toLowerCase().includes(search.toLowerCase())
);

const currentTrainers = filteredTrainers.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(filteredTrainers.length / recordsPerPage);

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

        {/* Manage Trainers Content */}
        <main className="dashboard-content">
          <h2>Manage Trainers</h2>

          <form className="trainer-form" onSubmit={handleTrainerSubmit}>
            <div>
              <label>Trainer Name</label>
              <input
                type="text"
                name="trainer_name"
                value={trainerForm.trainer_name}
                onChange={handleTrainerInputChange}
                required
              />
            </div>
            <div>
              <label>Mobile</label>
              <input
                type="text"
                name="mobile"
                value={trainerForm.mobile}
                onChange={handleTrainerInputChange}
              />
            </div>
            <div>
              <label>Course</label>
              <input
                type="text"
                name="course"
                value={trainerForm.course}
                onChange={handleTrainerInputChange}
              />
            </div>
            <div>
              <label>Experience</label>
              <input
                type="text"
                name="experience"
                value={trainerForm.experience}
                onChange={handleTrainerInputChange}
              />
            </div>
            <div>
              <label>Info</label>
              <textarea
                name="info"
                value={trainerForm.info}
                onChange={handleTrainerInputChange}
              />
            </div>
            <div>
              <label>Key Points</label>
              <textarea
                name="key_points"
                value={trainerForm.key_points}
                onChange={handleTrainerInputChange}
                placeholder="Comma-separated key points"
              />
            </div>
            <div>
              <label>Photo URL</label>
              <input
                type="text"
                name="photo_url"
                value={trainerForm.photo_url}
                onChange={handleTrainerInputChange}
              />
            </div>
            <div className="trainer-form-actions">
              <button type="submit">
                {editingId ? "Update Trainer" : "Add Trainer"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTrainerForm({
                      trainer_name: "",
                      mobile: "",
                      course: "",
                      experience: "",
                      info: "",
                      key_points: "",
                      photo_url: "",
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <button onClick={downloadExcel}>
            Download Excel
          </button>
          <button onClick={downloadPDF}>
            Download PDF
          </button>

          <input
            type="text"
            className="search-box"
            placeholder="Search Trainer..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <div className="trainer-table-container">
            <table className="trainer-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Course</th>
                  <th>Experience</th>
                  <th>Info</th>
                  <th>Key Points</th>
                  <th>Photo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTrainers.map((trainer) => (
                  <tr key={trainer.id}>
                    <td>{trainer.trainer_name}</td>
                    <td>{trainer.mobile}</td>
                    <td>{trainer.course}</td>
                    <td>{trainer.experience}</td>
                    <td>{trainer.info}</td>
                    <td>{trainer.key_points}</td>
                    <td>
                      {trainer.photo_url ? (
                        <img
                          src={trainer.photo_url}
                          alt={trainer.trainer_name}
                          className="trainer-photo-small"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <button onClick={() => editTrainer(trainer)}>
                        Edit
                      </button>
                      <button onClick={() => deleteTrainer(trainer.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            {Array.from(
              { length: totalPages },
              (_, i) => (
                <button
                  key={i + 1}
                  onClick={() =>
                    setCurrentPage(i + 1)
                  }
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

export default ManageTrainersComp;