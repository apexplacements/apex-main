import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./LogInComp.css";

const PasswordResetComp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userData = location.state?.userData;

  if (!userData) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>Error</h1>
          <p>No user data found. Please login first.</p>
          <button
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Both password fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/login/reset-password", {
        id: userData.id,
        newPassword: formData.newPassword,
      });

      if (res.data && res.data.success) {
        setMessage(res.data.message || "Password reset successfully");
        
        // Store user data in session storage for post-login use
        sessionStorage.setItem("currentUser", JSON.stringify({
          ...userData,
          password: formData.newPassword,
        }));

        // Notify other tabs/components that generated emails may have changed
        try {
          localStorage.setItem('generatedEmailsUpdatedAt', String(Date.now()));
        } catch (e) {
          // ignore
        }
        // Redirect based on role after 2 seconds
        setTimeout(() => {
          const roleMap = {
            admin: "/admin/dashboard",
            hr: "/hr/dashboard",
            trainer: "/trainer/dashboard",
            student: "/student/dashboard",
            std: "/student/dashboard",
            tr: "/trainer/dashboard",
            po: "/placement/dashboard",
            placementofficer: "/placement/dashboard",
            placement: "/placement/dashboard",
          };
          
          const dashboardPath = roleMap[userData.role?.toLowerCase()] || "/admin/dashboard";
          navigate(dashboardPath);
        }, 2000);
      } else {
        setError(res.data?.message || "Failed to reset password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Reset Password</h1>
        <p className="login-description">
          Welcome, {userData.user_name}! Please set a new password.
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            required
          />

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default PasswordResetComp;
