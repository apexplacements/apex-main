import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../apiClient";
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
    if (!role) return "/admin/dashboard";
    const r = String(role).toLowerCase();
    if (r.includes("placement")) return "/placement/dashboard";
    if (r === "po" || r === "placementofficer" || r === "placement officer") return "/placement/dashboard";
    if (r === "admin") return "/admin/dashboard";
    if (r === "hr") return "/hr/dashboard";
    if (r === "trainer" || r === "tr") return "/trainer/dashboard";
    if (r === "student" || r === "std") return "/student/dashboard";
    return "/admin/dashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('Login attempt for:', formData.email);
      const res = await apiClient.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      if (res.data && res.data.success) {
        const userData = res.data.data;

        console.log('Login success role=', userData?.role, 'email=', userData?.email);

        // Persist user session
        sessionStorage.setItem("currentUser", JSON.stringify(userData));

        // If password reset is required, send user to reset flow first
        if (userData.password_reset_required) {
          navigate("/password-reset", { state: { userData } });
          return;
        }

        // Redirect to role-based dashboard for all other users
        const dashboardPath = getRoleDashboard(userData.role);
        navigate(dashboardPath);
        return;
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
