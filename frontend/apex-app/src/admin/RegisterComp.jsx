import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterComp.css";
import axios from "axios";


const RegisterComp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/register",
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }
      );

      setMessage(response.data.message || "Registration successful.");
      setMessageType("success");
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (error) {
      console.log(error);
      setMessage(
        error.response?.data?.message ||
          "Registration Failed. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h3>Register Into Apex Skills & Placement Center</h3>

        

        <form className="register-form" onSubmit={handleSubmit}>
          {message && (
            <div className={`register-message ${messageType}`}>
              {message}
            </div>
          )}

          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="login-link">
            Already have an account?{" "}
            <Link to="/">
              Log In Here
            </Link>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RegisterComp;