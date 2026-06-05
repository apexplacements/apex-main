import React from "react";
import { useNavigate } from "react-router-dom";
import SocialMediaComp from "./SocialMediaComp";
import ContactHomeComp from "./ContactHomeComp";
import "./ItSupportComp.css";

const ItsupportComp = () => {

  const navigate = useNavigate();

  return (

    <div className="itsupport-main-container">

      <div className="ItSupport">

        <SocialMediaComp />

        {/* HERO SECTION */}
        <section className="itsupport-main-hero-section">

          {/* LOGO */}
          <div className="itsupport-logo-image-container">

            <img
              src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex-logo.jpeg"
              alt="Logo"
            />

          </div>

          {/* BACKGROUND IMAGE */}
          <div className="itsupport-background-image-wrapper">

            <img
              src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/itsupport.png"
              alt="IT Support"
            />

          </div>

          {/* NAVIGATION */}
          <div className="itsupport-navigation-menu-wrapper">

            <div
              className="itsupport-single-nav-item"
              onClick={() => navigate("/")}
            >
              Home
            </div>

            <div
              className="itsupport-single-nav-item"
              onClick={() => navigate("/about")}
            >
              About
            </div>

            <div
              className="itsupport-single-nav-item"
              onClick={() => navigate("/courses")}
            >
              Courses
            </div>

            <div
              className="itsupport-single-nav-item"
              onClick={() => navigate("/newbatches")}
            >
              New Batches
            </div>

            <div
              className="itsupport-single-nav-item"
              onClick={() => navigate("/it-support")}
            >
              IT Support
            </div>

            {/* JOBS DROPDOWN */}
            <div className="itsupport-single-nav-item itsupport-jobs-dropdown-wrapper">

              Activities

              <div className="itsupport-dropdown-content-box">

                <div onClick={() => navigate("/reviews")}>
                  Reviews
                </div>

                <div onClick={() => navigate("/blogs")}>
                  Blogs
                </div>

                <div onClick={() => navigate("/interview-questions")}>
                  Interview Questions
                </div>

              </div>

            </div>

            <div
              className="itsupport-single-nav-item"
              onClick={() => navigate("/contactus")}
            >
              Contact Us
            </div>

          </div>

        </section>

        {/* SUPPORT SECTION */}
        <section className="itsupport-support-section">

          <div className="itsupport-lab-mock-placement-section">

            {/* LAB */}
            <div className="itsupport-lab-section-wrapper">

              <h1>LAB ENVIRONMENT</h1>

              <div className="itsupport-lab-img-wrapper">

                <img
                  src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/lab.png"
                  alt="Lab Environment"
                />

              </div>

              <div className="itsupport-lab-description">

                <p>
                  Our lab environment provides students with access
                  to software and tools essential for learning and
                  development.
                </p>

              </div>

            </div>

            {/* MOCK */}
            <div className="itsupport-mock-section-wrapper">

              <h1>MOCK INTERVIEWS</h1>

              <div className="itsupport-mock-img-wrapper">

                <img
                  src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/mock.png"
                  alt="Mock Interviews"
                />

              </div>

              <div className="itsupport-mock-description">

                <p>
                  Our mock interview program helps students prepare
                  for real-world interviews with expert guidance.
                </p>

              </div>

            </div>

            {/* PLACEMENT */}
            <div className="itsupport-placement-section-wrapper">

              <h1>PLACEMENT CELL</h1>

              <div className="itsupport-placement-img-wrapper">

                <img
                  src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/placement.png"
                  alt="Placement Cell"
                />

              </div>

              <div className="itsupport-placement-description">

                <p>
                  Our placement cell connects students with job
                  opportunities and provides career support.
                </p>

              </div>

            </div>

            {/* JOB SUPPORT */}
            <div className="itsupport-jobs-wrapper">

              <h1>JOB OPPORTUNITIES & SUPPORT</h1>

              <div className="itsupport-jobs-img-wrapper">

                <img
                  src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/job.png"
                  alt="Job Opportunities"
                />

              </div>

              <div className="itsupport-job-description">

                <p>
                  We provide job opportunities, resume support,
                  interview preparation, and career guidance.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

      <ContactHomeComp />

    </div>

  );

};

export default ItsupportComp;