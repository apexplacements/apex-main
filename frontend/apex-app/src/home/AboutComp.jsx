//import React from "react";

import "./AboutComp.css";
import SocialMediaComp from "./SocialMediaComp";
import './NavComp.css';
import ContactHomeComp from "./ContactHomeComp";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";


const AboutComp = () => {
const navigate = useNavigate();
const [menuOpen, setMenuOpen] = useState(false);

const sliderImages = [
  "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/about.png",

  "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex_HOME1.png"
];

const [currentSlide, setCurrentSlide] = useState(0);

/* AUTO SLIDE */
useEffect(() => {
  document.title = "About Us | Apex Skills & Placement Center";
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute(
      "content",
      "Learn about Apex Skills & Placement Center."
    );
  } else {
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Learn about Apex Skills & Placement Center.";
    document.head.appendChild(meta);
  }

  const interval = setInterval(() => {
    setCurrentSlide((prev) =>
      prev === sliderImages.length - 1 ? 0 : prev + 1
    );
  }, 10000);

  return () => clearInterval(interval);
}, []);


  return (
    
<div>

  <SocialMediaComp />

  <div className="container-nav">

    {/* BACKGROUND SLIDER */}
    <div className="bg-slider">

      <img
        src={sliderImages[currentSlide]}
        alt="slider"
        className="slider-image"
      />

    </div>

    {/* NAVBAR */}
    <div className="navbar">

      {/* LEFT LOGO */}
      <div className="logo-container">

        <img
          className="logo"
          src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex-logo.jpeg"
          alt="logo"
        />

      </div>

      {/* RIGHT MENU ICON */}
      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* NAVIGATION */}
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

        {/* DROPDOWN */}
        <div className="nav-item dropdown">

          Activities

          <div className="dropdown-menu">

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
          className="nav-item"
          onClick={() => navigate('/contactus')}
        >
          Contact Us
        </div>

      </div>

    </div>

  </div>



    <div className="about">

      <div className="w-full min-h-screen bg-gray-100 p-8">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bold text-blue-900 mb-4">
          ABOUT APEX
        </h2>

        <p className="text-lg text-gray-700 max-w-5xl mx-auto leading-8">
          APEX provides industry-oriented training programs, practical lab
          sessions, mock interviews, placement assistance, job support,
          professional website development, logo designing, and company
          documentation services for students, job seekers, startups, and
          businesses.
        </p>
      </div>

      {/* TRAININGS */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-blue-800 mb-6">
          Trainings
        </h2>

        <p className="text-gray-700 leading-8 text-lg">
          APEX provides high-quality training programs designed according to
          current industry requirements. We offer both IT and Non-IT courses
          with practical learning methods. Students receive hands-on experience
          through live examples and real-time projects. Our expert trainers
          guide students from basic to advanced concepts. We provide training
          for Linux, AWS, DevOps, Testing, ReactJS, Voice Process, KYC, Maps,
          Customer Support, and many more domains. Each course is designed to
          improve technical knowledge and communication skills. Flexible batch
          timings are available for students and working professionals. We
          conduct online and offline classes with professional mentorship.
          Training materials and recorded sessions are provided for revision.
          Students also receive guidance for resume preparation and interview
          readiness. Practical assignments help improve confidence and problem
          solving skills. We focus on career-oriented learning with placement
          preparation. Our goal is to make students industry-ready and confident
          for real-world opportunities.
        </p>
      </section>

      {/* LABS */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-green-700 mb-6">
          Labs
        </h2>

        <p className="text-gray-700 leading-8 text-lg">
          APEX provides dedicated lab facilities for practical learning and
          technical skill development. Our labs are designed to simulate real
          industry environments for better understanding. Students can practice
          live server management, cloud deployments, coding exercises, and
          networking concepts. We provide access to Linux servers, AWS
          environments, and development tools for hands-on experience. Each lab
          session is guided by experienced mentors to help students complete
          tasks confidently. Practical exercises improve troubleshooting and
          problem-solving abilities. Students gain real-time exposure to
          technologies used in companies. Labs are available for both beginners
          and advanced learners. We encourage daily practice to strengthen
          technical knowledge. Students can work on assignments and mini
          projects during lab hours. Our lab infrastructure supports continuous
          learning and experimentation. Lab practice helps students perform well
          in interviews and workplace environments. We believe practical
          knowledge is essential for career success. APEX labs help students
          build confidence through real-time implementation and learning.
        </p>
      </section>

      {/* MOCK INTERVIEWS */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-purple-700 mb-6">
          Mock Interviews
        </h2>

        <p className="text-gray-700 leading-8 text-lg">
          APEX conducts professional mock interviews to prepare students for
          real company interview environments. Our mock sessions are designed to
          improve confidence, communication, and technical performance.
          Interview rounds include HR, technical, managerial, and behavioral
          discussions. Students receive personalized feedback after every
          session. We help candidates identify strengths and improve weak areas.
          Real-time interview questions are discussed with proper explanations.
          Our mentors guide students on resume presentation and self
          introduction techniques. Mock interviews help reduce fear and improve
          speaking confidence. Students learn how to answer technical and
          situational questions professionally. We conduct one-on-one interview
          practice sessions with experts. Communication and body language are
          also evaluated during sessions. Mock interviews improve overall
          presentation and personality development. Students become familiar
          with actual recruitment processes used in companies. Our goal is to
          make every student confident and interview-ready for placements.
        </p>
      </section>

      {/* JOB SUPPORT */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-red-700 mb-6">
          Job Support
        </h2>

        <p className="text-gray-700 leading-8 text-lg">
          APEX provides professional job support services for freshers and
          working professionals. We help candidates handle real-time project
          tasks and workplace challenges. Our experts provide guidance for
          Linux, AWS, DevOps, Testing, ReactJS, and other technologies. Job
          support includes issue resolution, project explanations, and technical
          assistance. We help professionals complete office tasks confidently
          and efficiently. Support sessions are available through online
          meetings and remote access assistance. Candidates receive help with
          troubleshooting and practical implementations. Our team ensures
          continuous learning and project understanding. We assist professionals
          in improving technical skills during job assignments. Daily guidance
          and mentorship are provided for better performance. Students and
          employees can clarify doubts directly with experts. Job support helps
          reduce stress in project environments. We focus on practical solutions
          and real-time learning approaches. APEX ensures candidates gain
          confidence and professional growth in their careers.
        </p>
      </section>

      {/* PLACEMENTS */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-yellow-700 mb-6">
          Placements
        </h2>

        <p className="text-gray-700 leading-8 text-lg">
          APEX provides placement assistance for students and job seekers across
          multiple domains. We connect candidates with companies based on their
          skills and career interests. Placement preparation includes resume
          building, interview practice, and communication training. Our team
          shares regular job updates and interview opportunities. We support
          both IT and Non-IT placement programs. Students receive career
          guidance from experienced professionals and recruiters. We organize
          placement drives and hiring events for freshers and experienced
          candidates. Our institute focuses on improving employability skills
          and technical knowledge. We provide support until candidates secure
          suitable job opportunities. Placement activities include aptitude
          preparation and technical discussions. We help students build
          confidence for interviews and workplace communication. Our strong
          training process increases placement success rates. Companies trust
          APEX for skilled and job-ready candidates. We aim to create successful
          careers through quality learning and placement support.
        </p>
      </section>

      {/* LOGO DESIGN */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-pink-700 mb-6">
          Logo Designing
        </h2>

        <p className="text-gray-700 leading-8 text-lg">
          APEX provides creative and professional logo designing services for
          businesses, startups, and organizations. Our designs are developed to
          represent brand identity and business vision effectively. We create
          modern, attractive, and unique logos according to client requirements.
          Professional logo designs help businesses improve brand recognition
          and customer trust. Our design team focuses on color combinations,
          typography, and visual creativity. We provide multiple design concepts
          and customization options for clients. Logos are designed for websites,
          social media, business cards, and marketing materials. We ensure high
          quality and scalable design formats for all business needs. Our
          creative approach helps brands stand out in competitive markets. We
          work closely with clients to understand their expectations and goals.
          Timely delivery and customer satisfaction are our priorities. A strong
          logo creates a professional image for every business. APEX helps
          companies build powerful visual branding with innovative designs.
        </p>
      </section>

      {/* WEBSITE DEVELOPMENT */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-indigo-700 mb-6">
          Website Development
        </h2>

        <p className="text-gray-700 leading-8 text-lg">
          APEX develops modern and responsive websites for business
          requirements. We create professional websites for startups,
          institutions, companies, and individual businesses. Our websites are
          designed with attractive layouts and user-friendly interfaces. We use
          modern technologies like ReactJS, Node.js, HTML, CSS, and JavaScript
          for development. Websites are optimized for mobile, tablet, and
          desktop devices. We provide dynamic websites with backend integration
          and database connectivity. SEO-friendly development helps businesses
          improve online visibility. Our team focuses on speed, security, and
          performance optimization. We also provide hosting and deployment
          support for websites. Clients receive customized designs according to
          their business goals. We create portfolio websites, company websites,
          training institute websites, and service platforms. A professional
          website improves business credibility and online presence. APEX helps
          businesses grow digitally through modern web solutions.
        </p>
      </section>

      {/* COMPANY DOCUMENTS */}
      <section className="bg-white shadow-lg rounded-2xl p-8 mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Company Documents
        </h2>

        <p className="text-gray-700 leading-8 text-lg">
          APEX provides professional company documentation services for
          businesses and organizations. We help create well-structured and
          organized business documents according to company requirements. Our
          services include offer letters, appointment letters, employee forms,
          company profiles, invoices, and official templates. We design clean
          and professional documents for branding and communication purposes.
          Proper documentation helps companies maintain professionalism and
          operational efficiency. We also prepare training materials,
          presentations, reports, and business documents. Documents are created
          with accuracy, formatting standards, and modern designs. We ensure all
          files are easy to edit, print, and share digitally. Businesses can
          improve workflow and communication through organized documentation.
          Our team provides customized formats according to company needs.
          Professional documents help improve business image and management
          processes. APEX ensures timely delivery and quality documentation
          services. We support startups and companies with reliable document
          preparation solutions.
        </p>
      </section>

    </div>

    </div>
          <ContactHomeComp />
    </div>

  );
};

export default AboutComp;