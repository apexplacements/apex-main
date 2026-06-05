import React, { useState } from "react";
import apiClient from "../apiClient";
import "./CandidateEnquiryComp.css";

function CandidateEnquiryComp() {

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    career_option: ""
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

    // Validate form
    if (!formData.full_name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const response = await apiClient.post(
        "/api/userrequests",
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

            {/* COURSE */}
            <label>
              Choose Your Career Option
            </label>

       <select
         name="career_option"
         value={formData.career_option}
         onChange={handleChange}
        >

        <option value="">
        --- Select Career Option ---
        </option>

        <option value="Java Fullstack">
        Java Fullstack
        </option>

        <option value="Python Fullstack">
        Python Fullstack
        </option>

        <option value="MERN Stack">
         MERN Stack
        </option>

        <option value="Data Science">
        Data Science
        </option>
        <option value="Dotnet Fullstack">
        Dotnet Fullstack
        </option>
        <option value="Angular">
        Angular
        </option>
        <option value="Machine Learning">
        Machine Learning
        </option>

      </select>


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