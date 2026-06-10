import React, { useState } from "react";
import apiClient from "../apiClient";
import "./CandidateEnquiryComp.css";

function CandidateEnquiryComp() {

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    job_type: "",
    career_option: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {

    const { name, value } = e.target;

    // If job_type changes, reset career_option
    if (name === 'job_type') {
      setFormData({
        ...formData,
        job_type: value,
        career_option: ''
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Validate form
    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const response = await apiClient.post(
        "/api/student-enquiry",
        formData
      );

      setMessage(response.data.message || "Request submitted successfully!");
      alert(response.data.message || "Request submitted successfully!");

      // Reset form
      setFormData({
        full_name: "",
        phone: "",
        email: "",
        career_option: ""
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

    <div className="container-candidate">

      <h2>Active Hiring Partners</h2>

      <div className="partner-section">

        {/* IMAGE */}
        <div className="image-box">

          <img
            src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/companies.png"
            alt="Companies"
          />

        </div>

        {/* FORM */}
        <div className="form-box">

          <h2>Your Next Step To Success</h2>

          <p>
            Fields marked with * are required
          </p>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <label>
              Name *
            </label>

            <input
              type="text"
              name="full_name"
              placeholder="Enter Name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />

            {/* PHONE */}
            <label>
              Phone *
            </label>

            <input
              type="text"
              name="phone"
              placeholder="Enter Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            {/* EMAIL */}
            <label>
              Email *
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* INDUSTRY TYPE */}
            <label>
              Looking For
            </label>
            <select name="job_type" value={formData.job_type} onChange={handleChange}>
              <option value="">--- Select type of industry ---</option>
              <option value="IT">IT</option>
              <option value="Non-IT">Non-IT</option>
            </select>

            {/* CAREER OPTIONS - shown based on job_type */}
            <label>
              Career Option
            </label>

            {formData.job_type === 'IT' && (
              <select name="career_option" value={formData.career_option} onChange={handleChange} required>
                <option value="">--- Select Career Option ---</option>
                <option value="Java Fullstack">Java Fullstack</option>
                <option value="Python Fullstack">Python Fullstack</option>
                <option value="MERN Stack">MERN Stack</option>
                <option value="Data Science">Data Science</option>
                <option value="Dotnet Fullstack">Dotnet Fullstack</option>
                <option value="Angular">Angular</option>
                <option value="Machine Learning">Machine Learning</option>
              </select>
            )}

            {formData.job_type === 'Non-IT' && (
              <select name="career_option" value={formData.career_option} onChange={handleChange} required>
                <option value="">--- Select Career Option ---</option>
                <option value="Content Moderator">Content Moderator</option>
                <option value="Fraud Analyst">Fraud Analyst</option>
                <option value="HR Executive">HR Executive</option>
                <option value="Google Maps">Google Maps</option>
                <option value="Voice Process">Voice Process</option>
                <option value="Non Voice Process - Chat/Email process">Non Voice Process - Chat/Email process</option>
                <option value="Non Voice Process - Data Entry">Non Voice Process - Data Entry</option>
                <option value="Medical Billing">Medical Billing</option>
              </select>
            )}


            {/* BUTTON */}
            <button type="submit" disabled={loading}>

              {loading ? "Submitting..." : "Request A Free Demo"}

            </button>

          </form>

        </div>

      </div>

    </div>


  );

};




export default CandidateEnquiryComp;