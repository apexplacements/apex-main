import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./LogInComp.css";

const LogInComp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getRoleDashboard = (role) => {
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
    return roleMap[role?.toLowerCase()] || "/admin/dashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Login attempt for:', formData.email);
      const res = await axios.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data && res.data.success) {
        const userData = res.data.data;

        if (userData.registeredOnly || userData.role === "registered") {
          sessionStorage.setItem("currentUser", JSON.stringify(userData));
          navigate("/home");
          return;
        }

        // Check if password reset is required
        if (userData.password_reset_required) {
          // Redirect to password reset page
          navigate("/password-reset", {
            state: { userData },
          });
        } else {
          // Password already reset, redirect to role-based dashboard
          sessionStorage.setItem("currentUser", JSON.stringify(userData));
          navigate(getRoleDashboard(userData.role));
        }
      } else {
        setError(res.data?.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Log In</h1>
        <p className="login-description">
          Apex Skills & Placement Center....
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            required
          />

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <div className="login-links">
            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Register here
              </Link>
            </p>

            <p>
              Forgot password?{" "}
              <Link to="/forgot-password">
                Reset it here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogInComp;
