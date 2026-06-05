import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import ContactHomeComp from "./ContactHomeComp";
import SocialMediaComp from "./SocialMediaComp";

import "./NewBatch.css";
import WhatsappchatComp from "./WhatsappchatComp";

const NewbatchComp = () => {


  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleNavClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (

    <div className="Newbatch">

      <div className="Newbatch-main-container">

        <SocialMediaComp />

        {/* HERO SECTION */}

        <section className="newbatch-main-hero-section">

          {/* LOGO */}

          <div className="newbatch-logo-image-container">

            <img
              src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex-logo.jpeg"
              alt="Logo"
            />

          </div>

          {/* BACKGROUND IMAGE SLIDER */}

          <div className="newbatch-background-image-wrapper">

            <img
              src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/newbatch.png"
              alt="New Batch"
            />

            <img
              src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex_home2.png"
              alt="New Batch Slide"
            />

          </div>


          {/* MOBILE MENU ICON */}
          <div className="newbatch-menu-icon" onClick={handleMenuToggle}>
            <span role="img" aria-label="menu">&#9776;</span>
          </div>

          {/* NAVIGATION */}
          <div className={`newbatch-navigation-menu-wrapper${menuOpen ? " active" : ""}`}>
            <div
              className="newbatch-single-nav-item"
              onClick={() => handleNavClick("/")}
            >
              Home
            </div>
            <div
              className="newbatch-single-nav-item"
              onClick={() => handleNavClick("/about")}
            >
              About
            </div>
            <div
              className="newbatch-single-nav-item"
              onClick={() => handleNavClick("/courses")}
            >
              Courses
            </div>
            <div
              className="newbatch-single-nav-item"
              onClick={() => handleNavClick("/newbatches")}
            >
              New Batches
            </div>
            <div
              className="newbatch-single-nav-item"
              onClick={() => handleNavClick("/it-support")}
            >
              IT Support
            </div>
            {/* JOBS DROPDOWN */}
            <div className="newbatch-single-nav-item newbatch-jobs-dropdown-wrapper">
              Activities
              <div className="newbatch-dropdown-content-box">
                <div onClick={() => handleNavClick("/reviews")}>Reviews</div>
                <div onClick={() => handleNavClick("/blogs")}>Blogs</div>
                <div onClick={() => handleNavClick("/interview-questions")}>Interview Questions</div>
              </div>
            </div>
            <div
              className="newbatch-single-nav-item"
              onClick={() => handleNavClick("/contactus")}
            >
              Contact Us
            </div>
          </div>

        </section>

        {/* COURSE SECTION */}

        <section className="newbatch-course-grid-layout">

          {/* JAVA */}

          <div className="newbatch-course-card-container">

            <div className="newbatch-course-image-wrapper">

              <img
                src="./ImageBox/java.jpg"
                alt="Java Fullstack"
              />

            </div>

            <div className="newbatch-course-description-box">

              <p>
                Learn Java Fullstack with real-time projects
                and placement support.
              </p>

            </div>

          </div>

          {/* PYTHON */}

          <div className="newbatch-course-card-container">

            <div className="newbatch-course-image-wrapper">

              <img
                src="./ImageBox/python.jpg"
                alt="Python Fullstack"
              />

            </div>

            <div className="newbatch-course-description-box">

              <p>
                Master Python Fullstack with Django, APIs,
                and frontend technologies.
              </p>

            </div>

          </div>

          {/* DOTNET */}

          <div className="newbatch-course-card-container">

            <div className="newbatch-course-image-wrapper">

              <img
                src="./ImageBox/dotnet.jpg"
                alt=".NET Fullstack"
              />

            </div>

            <div className="newbatch-course-description-box">

              <p>
                Become a .NET Fullstack developer using
                ASP.NET and SQL Server.
              </p>

            </div>

          </div>

          {/* DEVOPS */}

          <div className="newbatch-course-card-container">

            <div className="newbatch-course-image-wrapper">

              <img
                src="./ImageBox/devops.jpg"
                alt="DevOps"
              />

            </div>

            <div className="newbatch-course-description-box">

              <p>
                Learn DevOps tools like Docker, Kubernetes,
                Jenkins, and AWS.
              </p>

            </div>

          </div>

        </section>

      </div>
      <WhatsappchatComp />

  
      <ContactHomeComp />

    </div>

  );

};

export default NewbatchComp;