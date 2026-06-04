import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPasswordComp.css";

const ForgotPasswordComp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/login/forgot-password", {
        email: form.email,
        newPassword: form.password,
      });

      if (res.data && res.data.success) {
        setMessage(res.data.message || "Password reset successfully");
        // notify other components to refresh
        try { localStorage.setItem('generatedEmailsUpdatedAt', String(Date.now())); } catch (e) {}

        // redirect to login after a short delay
        setTimeout(() => navigate("/login"), 1500);
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
    <div className="forgot-container">
      <div className="forgot-card">

        <h3>Forgot Password</h3>

        <p>
          Enter your email address and set a new password
          to reset your account credentials.
        </p>

        <form className="forgot-form" onSubmit={handleSubmit}>

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email Address"
            required
          />

          <label>New Password</label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter New Password"
            required
          />

          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            required
          />

          <button
            type="submit"
            className="reset-btn"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

        </form>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="back-login">
          Remember your password?{" "}
          <Link to="/">
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordComp;