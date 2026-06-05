import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NavComp.css";
import { FaBars, FaTimes } from "react-icons/fa";

const NavComp = () => {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  {/* Image Slider Data */}
  const sliderImages = [
  "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex_HOME1.png",
  "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex_home2.png"
];

const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  }, 10000);

  return () => clearInterval(timer);
}, []);


  return (

    <div className="container-nav">

          {/* Background Slider */}
        <div className="bg-slider">
            <img
              src={sliderImages[currentSlide]}
              alt="slider"
            />
          </div>

      {/* Navbar */}
      <div className="navbar">

        {/* Logo */}
        <div className="logo-wrapper">
          <img
            className="logo"
            src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex-logo.jpeg"
            alt="logo"
          />
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Navigation */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>

          <div
            className="nav-item"
            onClick={() => navigate('/')}
          >
            Home
          </div>

          <div
            className="nav-item"
            onClick={() => navigate('/about')}
          >
            About
          </div>

          <div
            className="nav-item"
            onClick={() => navigate('/courses')}
          >
            Courses
          </div>

          <div
            className="nav-item"
            onClick={() => navigate('/newbatches')}
          >
            New Batches
          </div>

          <div
            className="nav-item"
            onClick={() => navigate('/it-support')}
          >
            IT Support
          </div>

          {/* Dropdown */}
          <div className="nav-item dropdown">

            Jobs

            <div className="dropdown-menu">

              <div onClick={() => navigate('/mock')}>
                Mock
              </div>

              <div onClick={() => navigate('/placements')}>
                Placements
              </div>

              <div onClick={() => navigate('/blogs')}>
                Blogs
              </div>

            </div>

          </div>

          <div
            className="nav-item"
            onClick={() => navigate('/contactus')}
          >
            Contact Us
          </div>

        </div>

      </div>

    </div>
  );
}

export default NavComp;