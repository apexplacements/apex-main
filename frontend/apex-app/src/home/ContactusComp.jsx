
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactusComp.css';
import ContactHomeComp from './ContactHomeComp';
import SocialMediaComp from './SocialMediaComp';
import WhatsappchatComp from './WhatsappchatComp';

const ContactusComp = () => {

  const navigate = useNavigate();

  const images = [
    'https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/contact1.png',
    'https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/contact2.png'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );

    }, 10000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div className="App">
     

      <SocialMediaComp />

      <div className="newbatch-main-container">

        {/* HERO SECTION */}
        <section className="newbatch-main-hero-section">

          {/* BACKGROUND SLIDER */}
          <div className="newbatch-background-image-wrapper">

            <img
              src={images[currentImage]}
              alt="Background"
            />

          </div>

          {/* NAVBAR */}
          <div className="newbatch-navbar">

            {/* LOGO */}
            <div className="newbatch-logo-image-container">

              <img
                src="./ImageBox/apex-logo.jpeg"
                alt="Logo"
              />

            </div>

            {/* NAVIGATION */}
            <div className="newbatch-navigation-menu-wrapper">

              <div
                className="newbatch-single-nav-item"
                onClick={() => navigate('/')}
              >
                Home
              </div>

              <div
                className="newbatch-single-nav-item"
                onClick={() => navigate('/about')}
              >
                About
              </div>

              <div
                className="newbatch-single-nav-item"
                onClick={() => navigate('/courses')}
              >
                Courses
              </div>

              <div
                className="newbatch-single-nav-item"
                onClick={() => navigate('/newbatches')}
              >
                New Batches
              </div>

              <div
                className="newbatch-single-nav-item"
                onClick={() => navigate('/it-support')}
              >
                IT Support
              </div>

              {/* DROPDOWN */}
              <div className="newbatch-single-nav-item newbatch-jobs-dropdown-wrapper">

                Activities

                <div className="newbatch-dropdown-content-box">

                  <div onClick={() => navigate('/reviews')}>
                    Reviews
                  </div>

                  <div onClick={() => navigate('/blogs')}>
                    Blogs
                  </div>

                  <div onClick={() => navigate('/interview-questions')}>
                    Interview Questions
                  </div>

                </div>

              </div>

              <div
                className="newbatch-single-nav-item"
                onClick={() => navigate('/contactus')}
              >
                Contact Us
              </div>

            </div>

          </div>

         

        </section>

        {/* COURSES SECTION */}
        <section className="newbatch-course-grid-layout">

          {/* JAVA */}
          <div className="newbatch-course-card-container">

            <div className="newbatch-course-image-wrapper">
              <img src="./ImageBox/java.jpg" alt="Java" />
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

            <div className="newbatch-course-description-box">
              <p>
                Master Python Fullstack with Django,
                APIs, and frontend technologies.
              </p>
            </div>

            <div className="newbatch-course-image-wrapper">
              <img src="./ImageBox/python.jpg" alt="Python" />
            </div>

          </div>

        </section>

      </div>

      <ContactHomeComp />

      <WhatsappchatComp />

    </div>

  );

};

export default ContactusComp;