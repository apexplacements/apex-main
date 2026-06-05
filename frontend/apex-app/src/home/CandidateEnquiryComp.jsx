import React, { useState } from "react";
import axios from "axios";
import "./CandidateEnquiryComp.css";

const baseUrl = import.meta.env.VITE_API_URL || "";

function CandidateEnquiryComp() {

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    career_option: ""
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
        `${baseUrl}/api/userrequest`,
        formData
      );

      alert(response.data.message);

    } catch (error) {

      console.log(error);

      alert("Request Failed");

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

        <option value="select" defaultValue>
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
            <button type="submit">

              Request A Free Demo

            </button>

          </form>

        </div>

      </div>

    </div>


  );

};




export default CandidateEnquiryComp;