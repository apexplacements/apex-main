import React from 'react';
import { useNavigate } from "react-router-dom";
import './ContactHomeComp.css';

const ContactHomeComp = () => {

  const navigate = useNavigate();

  return (

    <div className="container8">

      {/* Heading */}
      <h1>CONTACT US</h1>

      {/* Content */}
      <p>
        APEX SKILLS & PLACEMENT CENTRE provides industry-focused
        software training, placement assistance, IT support,
        mock interviews, job support, website development,
        documentation services, and career guidance for students
        and professionals. Our mission is to help every learner
        build strong technical skills and achieve successful
        career growth through real-time training and practical
        experience.
      </p>

      {/* Contact Details */}
      <h4>Call Us : +91 6305101723</h4>

      <h4>
        Reach us on email : apexplacements@gmail.com
      </h4>

      {/* Navigation Links */}
      <div className="footer-nav">

        <span onClick={() => navigate("/")}>
          Home
        </span>

        <span onClick={() => navigate("/about")}>
          About
        </span>

        <span onClick={() => navigate("/courses")}>
          Courses
        </span>

        <span onClick={() => navigate("/newbatches")}>
          New Batches
        </span>
        <span onClick={() => navigate("/it-support")}>
          IT Support
        </span>
        <span onClick={() => navigate("/reviews")}>
          Reviews
        </span>
        <span onClick={() => navigate("/blogs")}>
          Blogs
        </span>
        <span onClick={() => navigate("/interview-questions")}>
          Interview Questions
        </span>

        <span onClick={() => navigate("/contactus")}>
          Contact
        </span>

      </div>

      {/* Social Media */}
      <div className="footer-social">

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/facebook.png"
            alt="Facebook"
          />
        </a>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/instagram.png"
            alt="Instagram"
          />
        </a>

        <a
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/linkedln.png"
            alt="LinkedIn"
          />
        </a>

        <a
          href="https://www.youtube.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/youtube.png"
            alt="YouTube"
          />
        </a>

        <a
          href="https://web.whatsapp.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/whatsapp.png"
            alt="WhatsApp"
          />
        </a>

      </div>

      {/* Copyright */}
      <h4 className="copyright">
        Copyright Ⓒ 2025 APEX SKILLS & PLACEMENT CENTRE
        All rights reserved
      </h4>

    </div>
  )
}

export default ContactHomeComp;