import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./components.css";

const ReportsComp = ({ stats, students, placements, payments }) => {
  const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const exportToPDF = (title, data, columns) => {
    const doc = new jsPDF();
    doc.text(title, 10, 10);
    autoTable(doc, {
      head: [columns],
      body: data,
      startY: 20,
    });
    doc.save(`${title}.pdf`);
  };

  const handleExportStudentsExcel = () => {
    const data = students.map((s) => ({
      ID: s.id,
      Name: s.name,
      Email: s.email,
      Mobile: s.mobile,
      Course: s.course,
      Batch: s.batch,
      Status: s.status,
    }));
    exportToExcel(data, "Students_Report");
  };

  const handleExportPlacementsExcel = () => {
    const data = placements.map((p) => ({
      ID: p.id,
      StudentID: p.student_id,
      Company: p.company_name,
      Role: p.role_name,
      Package: p.package,
      Status: p.placement_status,
      Date: new Date(p.created_at).toLocaleDateString(),
    }));
    exportToExcel(data, "Placements_Report");
  };

  const handleExportPaymentsExcel = () => {
    const data = payments.map((p) => ({
      ID: p.id,
      Type: p.payment_type,
      Payer: p.payer_name,
      Amount: p.amount,
      Status: p.status,
      Date: new Date(p.payment_date).toLocaleDateString(),
    }));
    exportToExcel(data, "Payments_Report");
  };

  const handleExportStatsPDF = () => {
    const data = [
      ["Total Students", stats.totalStudents],
      ["Eligible Students", stats.eligibleStudents],
      ["Placed Students", stats.placedStudents],
      ["Active Job Openings", stats.activeJobOpenings],
      ["Scheduled Interviews", stats.scheduledInterviews],
      ["Hiring Companies", stats.companiesHiring],
    ];
    exportToPDF("HR Statistics", data, ["Metric", "Value"]);
  };

  return (
    <div className="section-container">
      <h2>Reports & Analytics</h2>

      <div className="report-stats">
        <div className="stat-card">
          <h4>Total Students</h4>
          <p className="stat-value">{stats.totalStudents}</p>
        </div>
        <div className="stat-card">
          <h4>Placed Students</h4>
          <p className="stat-value">{stats.placedStudents}</p>
        </div>
        <div className="stat-card">
          <h4>Placement Rate</h4>
          <p className="stat-value">
            {stats.totalStudents > 0 ? ((stats.placedStudents / stats.totalStudents) * 100).toFixed(1) : 0}%
          </p>
        </div>
        <div className="stat-card">
          <h4>Active Opportunities</h4>
          <p className="stat-value">{stats.activeJobOpenings}</p>
        </div>
      </div>

      <div className="export-buttons">
        <button className="btn-primary" onClick={handleExportStudentsExcel}>
          📊 Export Students (Excel)
        </button>
        <button className="btn-primary" onClick={handleExportPlacementsExcel}>
          📊 Export Placements (Excel)
        </button>
        <button className="btn-primary" onClick={handleExportPaymentsExcel}>
          💰 Export Payments (Excel)
        </button>
        <button className="btn-primary" onClick={handleExportStatsPDF}>
          📄 Export Stats (PDF)
        </button>
      </div>

      <div className="analytics-grid">
        <div className="chart-placeholder">
          <h4>Placement Distribution</h4>
          <p>Placed: {stats.placedStudents} | Pending: {stats.totalStudents - stats.placedStudents}</p>
          <div style={{ marginTop: "10px" }}>
            <div style={{ width: "100%", backgroundColor: "#f0f0f0", borderRadius: "4px", height: "20px" }}>
              <div
                style={{
                  width: `${stats.totalStudents > 0 ? (stats.placedStudents / stats.totalStudents) * 100 : 0}%`,
                  backgroundColor: "#4caf50",
                  height: "100%",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        </div>

        <div className="chart-placeholder">
          <h4>Interview Status</h4>
          <p>Total: {stats.scheduledInterviews} interviews</p>
          <div style={{ marginTop: "10px", fontSize: "12px" }}>
            <p>📅 Scheduled interviews: {stats.scheduledInterviews}</p>
            <p>🎯 Active job openings: {stats.activeJobOpenings}</p>
            <p>🏢 Companies hiring: {stats.companiesHiring}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsComp;
