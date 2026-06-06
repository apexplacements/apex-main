import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const TrainerProfileComp = ({ trainerId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (trainerId) {
      fetchProfile();
    }
  }, [trainerId]);

  const fetchProfile = async () => {
    try {
      const res = await apiClient.get(`/api/lms/trainer/profile/${trainerId}`);
      if (res.data.success) {
        setProfile(res.data.data);
        setFormData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.put(`/api/lms/trainer/profile/${trainerId}`, formData);
      if (res.data.success) {
        setProfile(res.data.data);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="profile-section">
      {!isEditing ? (
        <div className="profile-view">
          <h2>{profile?.trainer_name}</h2>
          <div className="profile-details">
            <p><strong>Email:</strong> {profile?.email}</p>
            <p><strong>Mobile:</strong> {profile?.mobile}</p>
            <p><strong>Experience:</strong> {profile?.experience_years} years</p>
            <p><strong>Specialization:</strong> {profile?.specialization}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="btn btn-primary">
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Trainer Name</label>
            <input
              type="text"
              name="trainer_name"
              value={formData.trainer_name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              name="experience_years"
              value={formData.experience_years || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-success">
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TrainerProfileComp;
