import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const TrainerAnnouncementsComp = ({ trainerId }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "General",
  });

  useEffect(() => {
    if (trainerId) {
      fetchBatches();
    }
  }, [trainerId]);

  const fetchBatches = async () => {
    try {
      const res = await apiClient.get(`/api/lms/trainer/${trainerId}/batches`);
      if (res.data.success) {
        setBatches(res.data.data);
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
        `/api/lms/trainer/${trainerId}/batches/${batchId}/announcements`
      );
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatch) {
      alert("Please select a batch");
      return;
    }

    try {
      const res = await apiClient.post(`/api/lms/trainer/${trainerId}/announcements`, {
        batch_id: selectedBatch,
        title: formData.title,
        content: formData.content,
        type: formData.type,
      });

      if (res.data.success) {
        handleBatchSelect(selectedBatch);
        setShowForm(false);
        setFormData({ title: "", content: "", type: "General" });
        alert("Announcement posted successfully!");
      }
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert("Failed to create announcement");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="announcements-section">
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
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? "Cancel" : "New Announcement"}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="announcement-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option>General</option>
                  <option>Urgent</option>
                  <option>Holiday</option>
                  <option>Class Cancelled</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success">
                Post Announcement
              </button>
            </form>
          )}

          <div className="announcements-list">
            <h3>Recent Announcements</h3>
            {announcements.length === 0 ? (
              <div className="empty-state">
                <p>No announcements yet</p>
              </div>
            ) : (
              announcements.map((ann) => (
                <div key={ann.id} className="announcement-item">
                  <h4>{ann.title}</h4>
                  <span className={`badge badge-${ann.type === "Urgent" ? "danger" : "info"}`}>
                    {ann.type}
                  </span>
                  <p>{ann.content}</p>
                  <small>{new Date(ann.created_at).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrainerAnnouncementsComp;
