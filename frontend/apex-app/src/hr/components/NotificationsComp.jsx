import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const NotificationsComp = ({ notifications, onRefresh }) => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    notification_type: "Interview Schedule",
    student_id: "",
    company_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.post("/api/notifications", form);
      setSuccess("Notification sent successfully!");
      setForm({ title: "", message: "", notification_type: "Interview Schedule", student_id: "", company_id: "" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Notifications</h2>
      
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <input
          type="text"
          name="title"
          placeholder="Notification Title"
          value={form.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleInputChange}
          rows="3"
          required
        />
        <select name="notification_type" value={form.notification_type} onChange={handleInputChange}>
          <option>Interview Schedule</option>
          <option>Placement Update</option>
          <option>Deadline Reminder</option>
          <option>General Announcement</option>
        </select>
        <input
          type="text"
          name="student_id"
          placeholder="Student ID (Optional)"
          value={form.student_id}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="company_id"
          placeholder="Company ID (Optional)"
          value={form.company_id}
          onChange={handleInputChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Notification"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td>{notification.id}</td>
                <td>{notification.title}</td>
                <td>{notification.notification_type}</td>
                <td>{notification.message?.substring(0, 50)}...</td>
                <td>{new Date(notification.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationsComp;
