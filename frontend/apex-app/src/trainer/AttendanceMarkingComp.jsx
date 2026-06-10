import React, { useState, useEffect } from "react";
import apiClient from "../apiClient";

const AttendanceMarkingComp = ({ trainerId }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trainerId) {
      fetchBatches();
    }
  }, [trainerId]);

  const fetchBatches = async () => {
    try {
      const res = await apiClient.get(`/api/batches`);
      if (res.data.success) {
        const all = res.data.data || [];
        setBatches(all.filter((b) => String(b.trainer_id) === String(trainerId)));
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchSelect = async (batchId) => {
    setSelectedBatch(batchId);
    try {
      const res = await apiClient.get(
        `/api/lms/trainer/${trainerId}/batches/${batchId}/students`
      );
      if (res.data.success) {
        setStudents(res.data.data);
        const attendanceObj = {};
        res.data.data.forEach((s) => {
          attendanceObj[s.student_id] = "Present";
        });
        setAttendance(attendanceObj);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleSubmitAttendance = async () => {
    if (!selectedBatch) {
      alert("Please select a batch");
      return;
    }

    try {
      const attendanceData = Object.keys(attendance).map((studentId) => ({
        student_id: studentId,
        status: attendance[studentId],
        attendance_date: attendanceDate,
      }));

      const res = await apiClient.post(
        `/api/lms/trainer/${trainerId}/batches/${selectedBatch}/attendance`,
        { attendance_data: attendanceData }
      );

      if (res.data.success) {
        alert("Attendance marked successfully!");
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
      alert("Failed to mark attendance");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="attendance-marking-section">
      <div className="form-group">
        <label>Select Batch</label>
        <select onChange={(e) => handleBatchSelect(e.target.value)} value={selectedBatch || ""}>
          <option value="">-- Select a Batch --</option>
          {batches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.batch_name}
            </option>
          ))}
        </select>
      </div>

      {selectedBatch && (
        <>
          <div className="form-group">
            <label>Attendance Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          <div className="table-container">
            <h3>Mark Attendance</h3>
            {students.length === 0 ? (
              <div className="empty-state">
                <p>No students in this batch</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.student_id}>
                      <td>{student.student_id}</td>
                      <td>{student.student_name}</td>
                      <td>
                        <select
                          value={attendance[student.student_id] || "Present"}
                          onChange={(e) => handleAttendanceChange(student.student_id, e.target.value)}
                        >
                          <option>Present</option>
                          <option>Absent</option>
                          <option>Leave</option>
                          <option>Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={handleSubmitAttendance} className="btn btn-success" style={{ marginTop: "20px" }}>
              Submit Attendance
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendanceMarkingComp;
