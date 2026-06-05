import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
import HrSummaryCard from "./HrSummaryCard";
import HrSectionCard from "./HrSectionCard";
import "./HrDashboard.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HrDashboard = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [students, setStudents] = useState([]);
  const [placementDrives, setPlacementDrives] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({
    totalFeesReceived: 0,
    totalSalariesPaid: 0,
    pendingPayments: 0,
  });
  const [stats, setStats] = useState({
    totalStudents: 0,
    eligibleStudents: 0,
    placedStudents: 0,
    activeJobOpenings: 0,
    scheduledInterviews: 0,
    companiesHiring: 0,
  });

  const [studentForm, setStudentForm] = useState({
    name: "",
    mobile: "",
    email: "",
    course: "",
    batch: "",
    status: "Active",
  });
  const [placementDriveForm, setPlacementDriveForm] = useState({
    company_name: "",
    role_name: "",
    location: "",
    ctc: "",
    interview_date: "",
    eligibility: "",
    status: "Active",
  });
  const [jobForm, setJobForm] = useState({
    company_name: "",
    role_name: "",
    experience: "",
    location: "",
    salary: "",
    description: "",
    apply_link: "",
    last_date: "",
  });
  const [companyForm, setCompanyForm] = useState({
    company_name: "",
    website: "",
    hr_name: "",
    hr_email: "",
    hr_mobile: "",
    location: "",
    logo_url: "",
  });
  const [interviewForm, setInterviewForm] = useState({
    student_id: "",
    company_id: "",
    interview_date: "",
    interview_time: "",
    round_name: "Technical",
    mode: "Online",
    status: "Scheduled",
  });
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: "",
    notification_type: "Interview Schedule",
    student_id: "",
    company_id: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    payment_type: "Course Fee",
    payer_name: "",
    payee_name: "",
    amount: "",
    currency: "INR",
    category: "",
    reference: "",
    status: "Completed",
    payment_date: "",
    notes: "",
  });

  const [placementRecordForm, setPlacementRecordForm] = useState({
    student_id: "",
    company_name: "",
    role_name: "",
    package: "",
    placement_status: "Placed",
  });

  const [resumeForm, setResumeForm] = useState({
    student_id: "",
    resume_url: "",
    status: "Pending",
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState({});

  const sections = [
    { key: "dashboard", label: "Dashboard" },
    { key: "students", label: "Students" },
    { key: "placement-drives", label: "Placement Drives" },
    { key: "jobs", label: "Jobs" },
    { key: "companies", label: "Companies" },
    { key: "interviews", label: "Interviews" },
    { key: "placements", label: "Placements" },
    { key: "resumes", label: "Resumes" },
    { key: "notifications", label: "Notifications" },
    { key: "payments", label: "Payments" },
    { key: "reports", label: "Reports" },
    { key: "profile", label: "Profile" },
  ];

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const [studentsRes, placementRes, jobsRes, companiesRes, interviewsRes, placementsRes, notificationsRes, resumesRes, paymentsRes] = await Promise.all([
        apiClient.get("/api/students"),
        apiClient.get("/api/placement-drives"),
        apiClient.get("/api/jobs"),
        apiClient.get("/api/companies"),
        apiClient.get("/api/interviews"),
        apiClient.get("/api/placements"),
        apiClient.get("/api/notifications"),
        apiClient.get("/api/resumes"),
        apiClient.get("/api/payments"),
      ]);

      const newStudents = studentsRes.data?.data || [];
      const activeJobs = jobsRes.data?.data || [];
      const hiringCompanies = [...new Set((companiesRes.data?.data || []).map((company) => company.company_name))].length;
      const scheduledInterviews = interviewsRes.data?.data?.filter((item) => item.status === "Scheduled").length || 0;
      const placedCount = placementsRes.data?.data?.length || 0;
      const eligibleStudents = newStudents.filter((student) => student.status !== "Placed").length;
      const paymentsList = paymentsRes.data?.data || [];
      const totalFeesReceived = paymentsList
        .filter((payment) => payment.payment_type === "Course Fee")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      const totalSalariesPaid = paymentsList
        .filter((payment) => payment.payment_type === "Salary Payment")
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      const pendingPayments = paymentsList.filter((payment) => payment.status !== "Completed").length;

      setStudents(newStudents);
      setPlacementDrives(placementRes.data?.data || []);
      setJobs(activeJobs);
      setCompanies(companiesRes.data?.data || []);
      setInterviews(interviewsRes.data?.data || []);
      setPlacements(placementsRes.data?.data || []);
      setNotifications(notificationsRes.data?.data || []);
      setResumes(resumesRes.data?.data || []);
      setPayments(paymentsList);
      setPaymentStats({
        totalFeesReceived,
        totalSalariesPaid,
        pendingPayments,
      });
      setStats({
        totalStudents: newStudents.length,
        eligibleStudents,
        placedStudents: placedCount,
        activeJobOpenings: activeJobs.length,
        scheduledInterviews,
        companiesHiring,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load HR portal data.");
    } finally {
      setLoading(false);
    }
  };

  const updateStudentField = (field, value) => {
    setStudentForm((current) => ({ ...current, [field]: value }));
  };

  const updatePlacementDriveField = (field, value) => {
    setPlacementDriveForm((current) => ({ ...current, [field]: value }));
  };

  const updateJobField = (field, value) => {
    setJobForm((current) => ({ ...current, [field]: value }));
  };

  const updateCompanyField = (field, value) => {
    setCompanyForm((current) => ({ ...current, [field]: value }));
  };

  const updateInterviewField = (field, value) => {
    setInterviewForm((current) => ({ ...current, [field]: value }));
  };

  const updateNotificationField = (field, value) => {
    setNotificationForm((current) => ({ ...current, [field]: value }));
  };

  const updatePaymentField = (field, value) => {
    setPaymentForm((current) => ({ ...current, [field]: value }));
  };

  const updatePlacementRecordField = (field, value) => {
    setPlacementRecordForm((current) => ({ ...current, [field]: value }));
  };

  const updateResumeField = (field, value) => {
    setResumeForm((current) => ({ ...current, [field]: value }));
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setError("");
    window.setTimeout(() => setSuccess(""), 5000);
  };

  const createPayment = async () => {
    try {
      await apiClient.post("/api/payments", paymentForm);
      setPaymentForm({
        payment_type: "Course Fee",
        payer_name: "",
        payee_name: "",
        amount: "",
        currency: "INR",
        category: "",
        reference: "",
        status: "Completed",
        payment_date: "",
        notes: "",
      });
      loadAllData();
      setActiveSection("payments");
      showSuccess("Payment recorded successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to record payment.");
    }
  };

  const createPlacementRecord = async () => {
    try {
      await apiClient.post("/api/placements", placementRecordForm);
      setPlacementRecordForm({
        student_id: "",
        company_name: "",
        role_name: "",
        package: "",
        placement_status: "Placed",
      });
      loadAllData();
      setActiveSection("placements");
      showSuccess("Placement record saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to save placement record.");
    }
  };

  const createResume = async () => {
    try {
      await apiClient.post("/api/resumes", resumeForm);
      setResumeForm({
        student_id: "",
        resume_url: "",
        status: "Pending",
      });
      loadAllData();
      setActiveSection("resumes");
      showSuccess("Resume metadata saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to save resume.");
    }
  };

  const createStudent = async () => {
    try {
      await apiClient.post("/api/students", studentForm);
      setStudentForm({ name: "", mobile: "", email: "", course: "", batch: "", status: "Active" });
      loadAllData();
      setActiveSection("students");
      showSuccess("Student added successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to add student.");
    }
  };

  const createPlacementDrive = async () => {
    try {
      await apiClient.post("/api/placement-drives", placementDriveForm);
      setPlacementDriveForm({ company_name: "", role_name: "", location: "", ctc: "", interview_date: "", eligibility: "", status: "Active" });
      loadAllData();
      showSuccess("Placement drive saved successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to add placement drive.");
    }
  };

  const createJob = async () => {
    try {
      await apiClient.post("/api/jobs", jobForm);
      setJobForm({ company_name: "", role_name: "", experience: "", location: "", salary: "", description: "", apply_link: "", last_date: "" });
      loadAllData();
      showSuccess("Job posting added successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to add job posting.");
    }
  };

  const createCompany = async () => {
    try {
      await apiClient.post("/api/companies", companyForm);
      setCompanyForm({ company_name: "", website: "", hr_name: "", hr_email: "", hr_mobile: "", location: "", logo_url: "" });
      loadAllData();
      showSuccess("Company added successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to add company.");
    }
  };

  const createInterview = async () => {
    try {
      await apiClient.post("/api/interviews", interviewForm);
      setInterviewForm({ student_id: "", company_id: "", interview_date: "", interview_time: "", round_name: "Technical", mode: "Online", status: "Scheduled" });
      loadAllData();
      showSuccess("Interview scheduled successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to schedule interview.");
    }
  };

  const createNotification = async () => {
    try {
      await apiClient.post("/api/notifications", notificationForm);
      setNotificationForm({ title: "", message: "", notification_type: "Interview Schedule", student_id: "", company_id: "" });
      loadAllData();
      showSuccess("Notification sent successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to send notification.");
    }
  };

  const deleteStudent = async (studentId) => {
    if (!window.confirm("Delete this student record?")) return;
    try {
      await apiClient.delete(`/api/students/${studentId}`);
      loadAllData();
    } catch (err) {
      console.error(err);
      setError("Unable to delete student.");
    }
  };

  const markStudentPlaced = async (student) => {
    try {
      await apiClient.put(`/api/students/${student.id}`, {
        ...student,
        status: "Placed",
      });
      await apiClient.post("/api/placements", {
        student_id: student.id,
        company_name: student.placement_company || "TBD",
        role_name: student.placement_role || "TBD",
        package: "TBD",
        placement_status: "Placed",
      });
      loadAllData();
      showSuccess("Student marked placed successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to mark student placed.");
    }
  };

  const scheduleStudentInterview = (student) => {
    setSelectedStudent(student);
    setInterviewForm((current) => ({ ...current, student_id: student.id }));
    setActiveSection("interviews");
  };

  const saveStudentEdit = async () => {
    try {
      await apiClient.put(`/api/students/${editForm.id}`, editForm);
      setEditForm({});
      loadAllData();
      showSuccess("Student updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to update student.");
    }
  };

  const openStudentEditor = (student) => {
    setEditForm(student);
    setActiveSection("students");
  };

  const generateExcel = (rows, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(rows.map((row) => ({ ...row })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, `${fileName}.xlsx`);
  };

  const generatePdf = (rows, title) => {
    const doc = new jsPDF({ unit: "pt", format: "A4" });
    doc.text(title, 40, 40);
    const body = rows.map((row) => Object.values(row));
    autoTable(doc, { startY: 60, head: [Object.keys(rows[0] || {})], body });
    doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
  };

  const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "null");

  return (
    <div className="dashboard-page hr-portal-page">
      <header className="header">
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <h1>HR Dashboard</h1>
        <button
          className="logout-btn"
          onClick={() => {
            sessionStorage.removeItem("currentUser");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>

      <div className="main-layout">
        <aside className={`sidebar-menu ${menuOpen ? "show" : ""}`}>
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              className={`nav-item ${activeSection === section.key ? "active" : ""}`}
              onClick={() => {
                setActiveSection(section.key);
                setMenuOpen(false);
              }}
            >
              {section.label}
            </button>
          ))}
        </aside>

        <main className="dashboard-content hr-content">
          {error && <div className="hr-error-banner">{error}</div>}
          {success && <div className="hr-success-banner">{success}</div>}

          {activeSection === "dashboard" && (
            <div>
              <div className="dashboard-grid hr-summary-grid">
                <div className="dashboard-card">
                  <h3>Total Students</h3>
                  <p>{loading ? "..." : stats.totalStudents}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Eligible Students</h3>
                  <p>{loading ? "..." : stats.eligibleStudents}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Placed Students</h3>
                  <p>{loading ? "..." : stats.placedStudents}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Active Job Openings</h3>
                  <p>{loading ? "..." : stats.activeJobOpenings}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Total fees received</h3>
                  <p>{loading ? "..." : `₹${paymentStats.totalFeesReceived.toFixed(2)}`}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Salaries paid</h3>
                  <p>{loading ? "..." : `₹${paymentStats.totalSalariesPaid.toFixed(2)}`}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Scheduled Interviews</h3>
                  <p>{loading ? "..." : stats.scheduledInterviews}</p>
                </div>
                <div className="dashboard-card">
                  <h3>Companies Hiring</h3>
                  <p>{loading ? "..." : stats.companiesHiring}</p>
                </div>
              </div>

              <HrSectionCard title="Placement Strategy" subtitle="HR operations from candidate sourcing to offer closure">
                <div className="hr-dashboard-metrics">
                  <div>
                    <h4>Placement pipeline</h4>
                    <p>Students, interviews, and hiring progress all in one place.</p>
                  </div>
                  <div>
                    <button onClick={loadAllData} className="hr-button primary">
                      Refresh data
                    </button>
                  </div>
                </div>
              </HrSectionCard>
            </div>
          )}

          {activeSection === "students" && (
            <HrSectionCard title="Student Database" subtitle="View, schedule interviews, and move students to placement.">
              <div className="hr-section-split">
                <div className="hr-student-table-wrapper">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Batch</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.mobile}</td>
                          <td>{student.email}</td>
                          <td>{student.course}</td>
                          <td>{student.batch}</td>
                          <td>{student.status}</td>
                          <td className="hr-table-actions">
                            <button onClick={() => openStudentEditor(student)}>Edit</button>
                            <button onClick={() => deleteStudent(student.id)}>Delete</button>
                            <button onClick={() => scheduleStudentInterview(student)}>Schedule Interview</button>
                            <button onClick={() => markStudentPlaced(student)}>Mark Placed</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <h4>Add student</h4>
                  <label>Name</label>
                  <input value={studentForm.name} onChange={(e) => updateStudentField("name", e.target.value)} />
                  <label>Mobile</label>
                  <input value={studentForm.mobile} onChange={(e) => updateStudentField("mobile", e.target.value)} />
                  <label>Email</label>
                  <input value={studentForm.email} onChange={(e) => updateStudentField("email", e.target.value)} />
                  <label>Course</label>
                  <input value={studentForm.course} onChange={(e) => updateStudentField("course", e.target.value)} />
                  <label>Batch</label>
                  <input value={studentForm.batch} onChange={(e) => updateStudentField("batch", e.target.value)} />
                  <label>Status</label>
                  <select value={studentForm.status} onChange={(e) => updateStudentField("status", e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Placed">Placed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button className="hr-button primary" onClick={createStudent}>Add Student</button>

                  {editForm.id && (
                    <>
                      <h5>Edit selected student</h5>
                      <label>Name</label>
                      <input
                        value={editForm.name || ""}
                        onChange={(e) => setEditForm((current) => ({ ...current, name: e.target.value }))}
                      />
                      <label>Status</label>
                      <select
                        value={editForm.status || "Active"}
                        onChange={(e) => setEditForm((current) => ({ ...current, status: e.target.value }))}
                      >
                        <option value="Active">Active</option>
                        <option value="Interview Scheduled">Interview Scheduled</option>
                        <option value="Placed">Placed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button className="hr-button" onClick={saveStudentEdit}>Save changes</button>
                    </>
                  )}
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "placement-drives" && (
            <HrSectionCard title="Placement Drive Management" subtitle="Create and manage hiring drives.">
              <div className="hr-section-split">
                <div className="hr-table-panel">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Location</th>
                        <th>CTC</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {placementDrives.map((drive) => (
                        <tr key={drive.id}>
                          <td>{drive.company_name}</td>
                          <td>{drive.role_name}</td>
                          <td>{drive.location}</td>
                          <td>{drive.ctc}</td>
                          <td>{drive.interview_date}</td>
                          <td>{drive.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <label>Company Name</label>
                  <input value={placementDriveForm.company_name} onChange={(e) => updatePlacementDriveField("company_name", e.target.value)} />
                  <label>Role</label>
                  <input value={placementDriveForm.role_name} onChange={(e) => updatePlacementDriveField("role_name", e.target.value)} />
                  <label>Location</label>
                  <input value={placementDriveForm.location} onChange={(e) => updatePlacementDriveField("location", e.target.value)} />
                  <label>CTC</label>
                  <input value={placementDriveForm.ctc} onChange={(e) => updatePlacementDriveField("ctc", e.target.value)} />
                  <label>Interview Date</label>
                  <input type="date" value={placementDriveForm.interview_date} onChange={(e) => updatePlacementDriveField("interview_date", e.target.value)} />
                  <label>Eligibility</label>
                  <textarea value={placementDriveForm.eligibility} onChange={(e) => updatePlacementDriveField("eligibility", e.target.value)} />
                  <label>Status</label>
                  <select value={placementDriveForm.status} onChange={(e) => updatePlacementDriveField("status", e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button className="hr-button primary" onClick={createPlacementDrive}>Save Drive</button>
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "jobs" && (
            <HrSectionCard title="Job Posting Management" subtitle="Publish new job listings.">
              <div className="hr-section-split">
                <div className="hr-table-panel">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Experience</th>
                        <th>Location</th>
                        <th>Salary</th>
                        <th>Last Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td>{job.company_name}</td>
                          <td>{job.role_name}</td>
                          <td>{job.experience}</td>
                          <td>{job.location}</td>
                          <td>{job.salary}</td>
                          <td>{job.last_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <label>Company Name</label>
                  <input value={jobForm.company_name} onChange={(e) => updateJobField("company_name", e.target.value)} />
                  <label>Role</label>
                  <input value={jobForm.role_name} onChange={(e) => updateJobField("role_name", e.target.value)} />
                  <label>Experience</label>
                  <input value={jobForm.experience} onChange={(e) => updateJobField("experience", e.target.value)} />
                  <label>Location</label>
                  <input value={jobForm.location} onChange={(e) => updateJobField("location", e.target.value)} />
                  <label>Salary</label>
                  <input value={jobForm.salary} onChange={(e) => updateJobField("salary", e.target.value)} />
                  <label>Description</label>
                  <textarea value={jobForm.description} onChange={(e) => updateJobField("description", e.target.value)} />
                  <label>Apply Link</label>
                  <input value={jobForm.apply_link} onChange={(e) => updateJobField("apply_link", e.target.value)} />
                  <label>Last Date</label>
                  <input type="date" value={jobForm.last_date} onChange={(e) => updateJobField("last_date", e.target.value)} />
                  <button className="hr-button primary" onClick={createJob}>Post Job</button>
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "companies" && (
            <HrSectionCard title="Company Management" subtitle="Manage hiring partners.">
              <div className="hr-section-split">
                <div className="hr-table-panel">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>HR Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((company) => (
                        <tr key={company.id}>
                          <td>{company.company_name}</td>
                          <td>{company.hr_name}</td>
                          <td>{company.hr_email}</td>
                          <td>{company.hr_mobile}</td>
                          <td>{company.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <label>Company Name</label>
                  <input value={companyForm.company_name} onChange={(e) => updateCompanyField("company_name", e.target.value)} />
                  <label>Website</label>
                  <input value={companyForm.website} onChange={(e) => updateCompanyField("website", e.target.value)} />
                  <label>HR Name</label>
                  <input value={companyForm.hr_name} onChange={(e) => updateCompanyField("hr_name", e.target.value)} />
                  <label>HR Email</label>
                  <input value={companyForm.hr_email} onChange={(e) => updateCompanyField("hr_email", e.target.value)} />
                  <label>HR Mobile</label>
                  <input value={companyForm.hr_mobile} onChange={(e) => updateCompanyField("hr_mobile", e.target.value)} />
                  <label>Location</label>
                  <input value={companyForm.location} onChange={(e) => updateCompanyField("location", e.target.value)} />
                  <label>Logo URL</label>
                  <input value={companyForm.logo_url} onChange={(e) => updateCompanyField("logo_url", e.target.value)} />
                  <button className="hr-button primary" onClick={createCompany}>Save Company</button>
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "interviews" && (
            <HrSectionCard title="Interview Scheduling" subtitle="Schedule and review all interview rounds.">
              <div className="hr-section-split">
                <div className="hr-table-panel">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Company</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Round</th>
                        <th>Mode</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map((item) => (
                        <tr key={item.id}>
                          <td>{item.student_name || item.student_id}</td>
                          <td>{item.company_name || item.company_id}</td>
                          <td>{item.interview_date}</td>
                          <td>{item.interview_time}</td>
                          <td>{item.round_name}</td>
                          <td>{item.mode}</td>
                          <td>{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <label>Student</label>
                  <select value={interviewForm.student_id} onChange={(e) => updateInterviewField("student_id", e.target.value)}>
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                  <label>Company</label>
                  <select value={interviewForm.company_id} onChange={(e) => updateInterviewField("company_id", e.target.value)}>
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>{company.company_name}</option>
                    ))}
                  </select>
                  <label>Date</label>
                  <input type="date" value={interviewForm.interview_date} onChange={(e) => updateInterviewField("interview_date", e.target.value)} />
                  <label>Time</label>
                  <input type="time" value={interviewForm.interview_time} onChange={(e) => updateInterviewField("interview_time", e.target.value)} />
                  <label>Round</label>
                  <input value={interviewForm.round_name} onChange={(e) => updateInterviewField("round_name", e.target.value)} />
                  <label>Mode</label>
                  <select value={interviewForm.mode} onChange={(e) => updateInterviewField("mode", e.target.value)}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                  <label>Status</label>
                  <select value={interviewForm.status} onChange={(e) => updateInterviewField("status", e.target.value)}>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button className="hr-button primary" onClick={createInterview}>Schedule Interview</button>
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "placements" && (
            <HrSectionCard title="Placement Tracking" subtitle="View and add placement records.">
              <div className="hr-section-split">
                <div className="hr-table-panel">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Package</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {placements.map((placement) => (
                        <tr key={placement.id}>
                          <td>{placement.student_name}</td>
                          <td>{placement.company_name}</td>
                          <td>{placement.role_name}</td>
                          <td>{placement.package}</td>
                          <td>{placement.placement_status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <h4>Add placement record</h4>
                  <label>Student</label>
                  <select value={placementRecordForm.student_id} onChange={(e) => updatePlacementRecordField("student_id", e.target.value)}>
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                  <label>Company Name</label>
                  <input value={placementRecordForm.company_name} onChange={(e) => updatePlacementRecordField("company_name", e.target.value)} />
                  <label>Role Name</label>
                  <input value={placementRecordForm.role_name} onChange={(e) => updatePlacementRecordField("role_name", e.target.value)} />
                  <label>Package</label>
                  <input value={placementRecordForm.package} onChange={(e) => updatePlacementRecordField("package", e.target.value)} />
                  <label>Status</label>
                  <select value={placementRecordForm.placement_status} onChange={(e) => updatePlacementRecordField("placement_status", e.target.value)}>
                    <option value="Placed">Placed</option>
                    <option value="Pending">Pending</option>
                    <option value="Offer Received">Offer Received</option>
                  </select>
                  <button className="hr-button primary" onClick={createPlacementRecord}>Save Placement</button>
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "resumes" && (
            <HrSectionCard title="Resume Management" subtitle="Review and upload resume metadata.">
              <div className="hr-section-split">
                <div className="hr-table-panel">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Email</th>
                        <th>Resume</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumes.map((resume) => (
                        <tr key={resume.id}>
                          <td>{resume.student_name}</td>
                          <td>{resume.student_email}</td>
                          <td>
                            {resume.resume_url ? (
                              <a href={resume.resume_url} target="_blank" rel="noreferrer">View</a>
                            ) : (
                              "No resume"
                            )}
                          </td>
                          <td>{resume.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <h4>Add resume entry</h4>
                  <label>Student</label>
                  <select value={resumeForm.student_id} onChange={(e) => updateResumeField("student_id", e.target.value)}>
                    <option value="">Select student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                  <label>Resume URL</label>
                  <input value={resumeForm.resume_url} onChange={(e) => updateResumeField("resume_url", e.target.value)} />
                  <label>Status</label>
                  <select value={resumeForm.status} onChange={(e) => updateResumeField("status", e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button className="hr-button primary" onClick={createResume}>Save Resume</button>
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "notifications" && (
            <HrSectionCard title="Send Notifications" subtitle="Notify students and partners.">
              <div className="hr-section-split">
                <div className="hr-table-panel">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Student</th>
                        <th>Company</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map((note) => (
                        <tr key={note.id}>
                          <td>{note.title}</td>
                          <td>{note.notification_type}</td>
                          <td>{note.student_name}</td>
                          <td>{note.company_name}</td>
                          <td>{new Date(note.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <label>Title</label>
                  <input value={notificationForm.title} onChange={(e) => updateNotificationField("title", e.target.value)} />
                  <label>Message</label>
                  <textarea value={notificationForm.message} onChange={(e) => updateNotificationField("message", e.target.value)} />
                  <label>Type</label>
                  <select value={notificationForm.notification_type} onChange={(e) => updateNotificationField("notification_type", e.target.value)}>
                    <option value="New Placement Drive">New Placement Drive</option>
                    <option value="Interview Schedule">Interview Schedule</option>
                    <option value="Job Opportunity">Job Opportunity</option>
                    <option value="Assessment Test">Assessment Test</option>
                  </select>
                  <label>Student (optional)</label>
                  <select value={notificationForm.student_id} onChange={(e) => updateNotificationField("student_id", e.target.value)}>
                    <option value="">All Students</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>{student.name}</option>
                    ))}
                  </select>
                  <label>Company (optional)</label>
                  <select value={notificationForm.company_id} onChange={(e) => updateNotificationField("company_id", e.target.value)}>
                    <option value="">All Companies</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>{company.company_name}</option>
                    ))}
                  </select>
                  <button className="hr-button primary" onClick={createNotification}>Send Notification</button>
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "payments" && (
            <HrSectionCard title="Payments" subtitle="Receive course fees, pay salaries, and manage payment history.">
              <div className="hr-section-split">
                <div className="hr-table-panel">
                  <table className="hr-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Payer</th>
                        <th>Payee</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.payment_type}</td>
                          <td>{payment.payer_name}</td>
                          <td>{payment.payee_name}</td>
                          <td>₹{payment.amount}</td>
                          <td>{payment.status}</td>
                          <td>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="hr-form-panel">
                  <label>Payment Type</label>
                  <select value={paymentForm.payment_type} onChange={(e) => updatePaymentField("payment_type", e.target.value)}>
                    <option value="Course Fee">Course Fee</option>
                    <option value="Salary Payment">Salary Payment</option>
                    <option value="Other Expense">Other Expense</option>
                  </select>
                  <label>Payer</label>
                  <input value={paymentForm.payer_name} onChange={(e) => updatePaymentField("payer_name", e.target.value)} />
                  <label>Payee</label>
                  <input value={paymentForm.payee_name} onChange={(e) => updatePaymentField("payee_name", e.target.value)} />
                  <label>Amount</label>
                  <input type="number" value={paymentForm.amount} onChange={(e) => updatePaymentField("amount", e.target.value)} />
                  <label>Currency</label>
                  <input value={paymentForm.currency} onChange={(e) => updatePaymentField("currency", e.target.value)} />
                  <label>Category</label>
                  <input value={paymentForm.category} onChange={(e) => updatePaymentField("category", e.target.value)} />
                  <label>Reference</label>
                  <input value={paymentForm.reference} onChange={(e) => updatePaymentField("reference", e.target.value)} />
                  <label>Date</label>
                  <input type="date" value={paymentForm.payment_date} onChange={(e) => updatePaymentField("payment_date", e.target.value)} />
                  <label>Status</label>
                  <select value={paymentForm.status} onChange={(e) => updatePaymentField("status", e.target.value)}>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                  <label>Notes</label>
                  <textarea value={paymentForm.notes} onChange={(e) => updatePaymentField("notes", e.target.value)} />
                  <button className="hr-button primary" onClick={createPayment}>Record Payment</button>
                </div>
              </div>
            </HrSectionCard>
          )}

          {activeSection === "reports" && (
            <HrSectionCard title="Placement Reports" subtitle="Download HR reports in Excel and PDF.">
              <div className="hr-report-buttons">
                <button className="hr-button" onClick={() => generateExcel(students, "Students_Report")}>Download Students Excel</button>
                <button className="hr-button" onClick={() => generateExcel(interviews, "Interview_Report")}>Download Interviews Excel</button>
                <button className="hr-button" onClick={() => generateExcel(companies, "Company_Report")}>Download Companies Excel</button>
                {students.length > 0 && (
                  <button className="hr-button" onClick={() => generatePdf(students.slice(0, 20), "Placement_Summary")}>Download PDF Summary</button>
                )}
              </div>
            </HrSectionCard>
          )}

          {activeSection === "profile" && (
            <HrSectionCard title="HR Profile" subtitle="HR account details.">
              <div className="hr-profile-grid">
                <div>
                  <strong>Name</strong>
                  <p>{currentUser?.user_name || "HR Manager"}</p>
                </div>
                <div>
                  <strong>Employee ID</strong>
                  <p>{currentUser?.user_id || "HR-001"}</p>
                </div>
                <div>
                  <strong>Email</strong>
                  <p>{currentUser?.email || "hr@apexplacements.in"}</p>
                </div>
                <div>
                  <strong>Mobile</strong>
                  <p>+91 98765 43210</p>
                </div>
                <div>
                  <strong>Department</strong>
                  <p>Placement & HR</p>
                </div>
                <div className="hr-profile-photo">
                  <img src="https://via.placeholder.com/120" alt="HR profile" />
                </div>
              </div>
            </HrSectionCard>
          )}
        </main>
      </div>
    </div>
  );
};

export default HrDashboard;
