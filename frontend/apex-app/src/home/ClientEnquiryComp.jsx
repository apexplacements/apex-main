import React, { useState } from "react";
import axios from "axios";
import './ClientEnquiryComp.css';
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_URL || "";

function ClientEnquiry() {
  const navigate = useNavigate();
const [formData, setFormData] = useState({

  full_name: "",

  phone: "",

  email: "",

  support_type: "",

  description: ""

});


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/customerrequest`,
        formData
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Request Failed");
      }
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
                <option value="select" defaultValue>
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
            <button type="submit">
              Submit
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