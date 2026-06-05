import React, { useState } from "react";
import apiClient from "../apiClient";
import './ClientEnquiryComp.css';
import { useNavigate } from "react-router-dom";

function ClientEnquiry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    support_type: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post(
        "/api/customer-requests",
        formData
      );
      
      const successMsg = response.data.message || "Request submitted successfully!";
      setMessage(successMsg);
      alert(successMsg);

      // Reset form
      setFormData({
        full_name: "",
        phone: "",
        email: "",
        support_type: "",
        description: ""
      });
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      
      const errorMsg = error.response?.data?.message || error.message || "Request Failed. Please try again.";
      setMessage(errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container5">
      <h1>IT SUPPORT</h1>
      <div className="support-section">
        {/* LEFT SIDE FORM */}
        <div className="form-box">
          <h2>Your Next Step To Success</h2>
          <p>
            Fields marked with an * is required
          </p>
          <form
            className="form-container"
            onSubmit={handleSubmit}
          >
            {/* NAME */}
            <label>
              Name <span>*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            {/* PHONE */}
            <label>
              Phone <span>*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {/* EMAIL */}
            <label>
              Email <span>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {/* SELECT */}
            <label>
              Select Type Of Support You Required
            </label>
            <div className="select-box">
              <select
                name="support_type"
                value={formData.support_type}
                onChange={handleChange}
              >
                <option value="">
                  --- Select Support Type ---
                </option>
                <option value="Logo Design">
                  Logo Design
                </option>
                <option value="Websites">
                  Websites
                </option>
                <option value="Documentation">
                  Documentation
                </option>
                <option value="Mechanical Design">
                  Mechanical Design
                </option>
                <option value="Job Support">
                  Job Support
                </option>
              </select>
              <label>
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter your requirement details..."
                required
              ></textarea>
            </div>
            {/* Redirect Button */}
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
        {/* RIGHT SIDE */}
        <div className="text-box">
          <h4>
            We provide complete IT support services designed to help
            students, startups, businesses, and professionals achieve
            their technical and career goals. Our services include
            professional website development using modern technologies,
            creative logo and brand design, academic and industrial
            project documentation, mechanical and engineering designs,
            software project guidance, and real-time technical support.
            We also offer job support for various technologies and tools,
            helping candidates handle live projects, interviews, client
            tasks, debugging, deployments, cloud environments, databases,
            and application maintenance. Our dedicated support team ensures
            quality service, timely delivery, and practical solutions for
            both learning and business requirements.
          </h4>
          <button onClick={() => navigate('/it-support')}>
            Know More
          </button>
        </div>
      </div>
    </div>
  );

};

export default ClientEnquiry;