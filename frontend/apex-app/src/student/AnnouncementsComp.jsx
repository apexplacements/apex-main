import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const AnnouncementsComp = ({ studentId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await apiClient.get(`/api/lms/student/${studentId}/announcements`);
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  if (announcements.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📢</div>
        <p>No announcements</p>
      </div>
    );
  }

  return (
    <div className="announcements-section">
      <h2>Announcements</h2>
      <div className="announcements-list">
        {announcements.map((ann) => (
          <div key={ann.id} className="announcement-item">
            <h4>{ann.title}</h4>
            <p>{ann.content}</p>
            <span className="announcement-date">{new Date(ann.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsComp;
