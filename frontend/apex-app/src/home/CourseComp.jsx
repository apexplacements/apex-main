import React, { useEffect, useState } from "react";
import "./CourseComp.css";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import SocialMediaComp from "./SocialMediaComp";
import ContactHomeComp from "./ContactHomeComp";

const CourseComp = () => {

  const navigate = useNavigate();

  /* MOBILE MENU */
  const [menuOpen, setMenuOpen] = useState(false);

  /* ENROLL FORM */
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  /* BACKGROUND SLIDER */
  const sliderImages = [

    "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/courses.png",

    "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex_HOME1.png"

  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  /* AUTO SLIDE */
  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentSlide((prev) =>
        prev === sliderImages.length - 1 ? 0 : prev + 1
      );

    }, 10000);

    return () => clearInterval(interval);

  }, []);

  /* OPEN ENROLL POPUP */
  const handleEnroll = (courseName) => {

    setSelectedCourse(courseName);
    setShowPopup(true);

  };

  /* SUBMIT FORM */
  const handleSubmit = () => {

    if (!mobile || !email) {

      alert("Please enter Mobile Number and Email");
      return;

    }

    alert(
      `Enrollment Successful!\nCourse: ${selectedCourse}\nMobile: ${mobile}\nEmail: ${email}`
    );

    setShowPopup(false);
    setMobile("");
    setEmail("");

  };

  return (

    <div className="CourseComp">
      

      <SocialMediaComp />

      {/* ========================= */}
      {/* HEADER SECTION */}
      {/* ========================= */}

      <section className="apex-header-section">

        {/* BACKGROUND SLIDER */}
        <div className="apex-background-wrapper">

          <img
            src={sliderImages[currentSlide]}
            alt="Courses"
            className="apex-slider-image"
          />

        </div>

        {/* NAVBAR */}
        <div className="apex-navbar-main">

          {/* LOGO */}
          <div className="apex-logo-wrapper">

            <img
              src="./ImageBox/apex-logo.jpeg"
              alt="Logo"
            />

          </div>

          {/* MENU ICON */}
          <div
            className="apex-menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>

          {/* NAVIGATION */}
          <div className={`apex-navbar-container ${menuOpen ? "active" : ""}`}>

            <div
              className="apex-nav-link"
              onClick={() => navigate('/')}
            >
              Home
            </div>

            <div
              className="apex-nav-link"
              onClick={() => navigate('/about')}
            >
              About
            </div>

            <div
              className="apex-nav-link"
              onClick={() => navigate('/courses')}
            >
              Courses
            </div>

            <div
              className="apex-nav-link"
              onClick={() => navigate('/newbatches')}
            >
              New Batches
            </div>

            <div
              className="apex-nav-link"
              onClick={() => navigate('/it-support')}
            >
              IT Support
            </div>

            {/* DROPDOWN */}
            <div className="apex-nav-link apex-dropdown-wrapper">

              Activities

              <div className="apex-dropdown-menu-box">

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
              className="apex-nav-link"
              onClick={() => navigate('/contactus')}
            >
              Contact Us
            </div>

          </div>

        </div>

      </section>

      <div className="course-content-wrapper">

        <h1>Our Courses</h1>

        <div className="course-list">

          {/* JAVA FULL STACK */}
          <div className="course-item">

            <div className="course-image">

              <img
                src="./ImageBox/java_full_stack.png"
                alt="Java Full Stack"
              />

            </div>

            <div className="course-details">

              <h2>Java Full Stack</h2>

              <div className="skill-section">

                <h3>Frontend Tools</h3>

                <p>HTML5</p>
                <p>CSS3</p>
                <p>JavaScript</p>
                <p>React JS</p>
                <p>Bootstrap</p>

              </div>

              <div className="skill-section">

                <h3>Backend Tools</h3>

                <p>Core Java</p>
                <p>Advanced Java</p>
                <p>Spring Boot</p>
                <p>Spring MVC</p>
                <p>Hibernate</p>
                <p>REST APIs</p>
                <p>Microservices</p>

              </div>

              <div className="skill-section">

                <h3>Database Tools</h3>

                <p>MySQL</p>
                <p>SQL Queries</p>
                <p>Database Design</p>

              </div>

              <div className="skill-section">

                <h3>Troubleshooting Tools</h3>

                <p>Git & GitHub</p>
                <p>Postman</p>
                <p>Debugging</p>
                <p>Maven</p>
                <p>VS Code</p>

              </div>

              <button
                className="enroll-btn"
                onClick={() => handleEnroll("Java Full Stack")}
              >
                Enroll Now
              </button>

            </div>

          </div>

          {/* PYTHON FULL STACK */}
          <div className="course-item">

            <div className="course-image">

              <img
                src="./ImageBox/python_full_stack.png"
                alt="Python Full Stack"
              />

            </div>

            <div className="course-details">
              <h2>Python Full Stack</h2>

              <div className="skill-section">
                  <h3>Frontend Tools</h3>
                  <p>HTML5</p>
                  <p>CSS3</p>
                  <p>JavaScript</p>
                  <p>React JS</p>
                  <p>Bootstrap</p>
              </div>
              <div className="skill-section">
                  <h3>Backend Tools</h3>
                  <p>Core Python</p>
                  <p>Advanced Python</p>
                  <p>Django</p>
                  <p>Flask</p>
                  <p>REST APIs</p>  
                  <p>Microservices</p>
              </div>
              <div className="skill-section">
                  <h3>Database Tools</h3>
                  <p>MySQL</p>
                  <p>SQL Queries</p>
                  <p>Database Design</p>
              </div>
              <div className="skill-section">
                  <h3>Troubleshooting Tools</h3>
                  <p>Git & GitHub</p>
                  <p>Postman</p>
                  <p>Debugging</p>
                  <p>VS Code</p>
              </div>

              <button
                className="enroll-btn"
                onClick={() => handleEnroll("Python Full Stack")}
              >
                Enroll Now
              </button>

            </div>

          </div>

          {/* MERN STACK */}
          <div className="course-item">

            <div className="course-image">

              <img
                src="./ImageBox/mern.png"
                alt="MERN Stack"
              />

            </div>

            <div className="course-details">

              <h2>MERN Stack</h2>
              <div className="skill-section">
                <h3>Frontend Tools</h3>
                <p>HTML5</p>
                <p>CSS3</p>
                <p>JavaScript</p>
              <p>React JS</p>
              <p>Bootstrap</p>
              </div>
              <div className="skill-section">
                <h3>Backend Tools</h3>
                <p>Node.js</p>
                <p>Express.js</p>
                <p>REST APIs</p>
                </div>
              <div className="skill-section">
                <h3>Microservices</h3>
              </div>
              <div className="skill-section">
                <h3>Database Tools</h3>
                <p>MongoDB</p>
                <p>MongoDB Atlas</p>
                <p>Database Design</p>
              </div>
              <div className="skill-section">
                <h3>Troubleshooting Tools</h3>
                <p>Git & GitHub</p>
                <p>Postman</p>
                <p>Debugging</p>
                <p>VS Code</p>
              </div>

              <button
                className="enroll-btn"
                onClick={() => handleEnroll("MERN Stack")}
              >
                Enroll Now
              </button>

            </div>

          </div>

          {/* DATA SCIENCE */}
          <div className="course-item">

            <div className="course-image">

              <img
                src="./ImageBox/data_science.png"
                alt="Data Science"
              />

            </div>

            <div className="course-details">

              <h2>Data Science</h2>
              <div className="skill-section">
                <h3>Core Tools</h3>
                <p>Python</p>
                <p>R</p>
                <p>SQL</p>
              </div>
              <div className="skill-section">
                <h3>Data Analysis Tools</h3>
                <p>Pandas</p>
                <p>NumPy</p>
                <p>Matplotlib</p>
                <p>Seaborn</p>
              </div>
              <div className="skill-section">
                <h3>Machine Learning Tools</h3>
                <p>Scikit-learn</p>
                <p>TensorFlow</p>
                <p>Keras</p>
                <p>PyTorch</p>
              </div>
              <div className="skill-section">
                <h3>Database Tools</h3>
                <p>MySQL</p>
                <p>SQL Queries</p>
                <p>Database Design</p>
              </div>
              <div className="skill-section">
                <h3>Troubleshooting Tools</h3>

              <p>Git & GitHub</p>
              <p>Jupyter Notebooks</p>
              <p>VS Code</p>
              </div>


              <button
                className="enroll-btn"
                onClick={() => handleEnroll("Data Science")}
              >
                Enroll Now
              </button>

            </div>

          </div>

          {/* .NET */}
          <div className="course-item">

            <div className="course-image">

              <img
                src="./ImageBox/dotnet_full_stack.png"
                alt=".NET"
              />

            </div>

            <div className="course-details">

              <h2>.NET</h2>
              <div className="skill-section">
                <h3>Core Tools</h3>
                <p>C#</p>
                <p>.NET Framework</p>
                <p>.NET Core</p>
                <p>ASP.NET</p>
              </div>
              <div className="skill-section">
                <h3>Database Tools</h3>
                <p>SQL Server</p>
                <p>Entity Framework</p>
                <p>Database Design</p>
              </div>
              <div className="skill-section">
                <h3>Troubleshooting Tools</h3>
                <p>Git & GitHub</p>
                <p>Visual Studio</p>
                <p>Debugging</p>
                <p>VS Code</p>
              </div>

              <button
                className="enroll-btn"
                onClick={() => handleEnroll(".NET")}
              >
                Enroll Now
              </button>

            </div>

          </div>

          {/* ANGULAR */}
          <div className="course-item">

            <div className="course-image">

              <img
                src="./ImageBox/angular.png"
                alt="Angular"
              />

            </div>

            <div className="course-details">

              <h2>Angular</h2>
              <div className="skill-section">
                <h3>Core Tools</h3>
                <p>TypeScript</p>
                <p>Angular CLI</p>
                <p>Components</p>
                <p>Services</p>
                <p>Routing</p>
              </div>
              <div className="skill-section">
                <h3>Database Tools</h3>
                <p>Firestore</p>
                <p>SQL Queries</p>
                <p>Database Design</p>
              </div>
              <div className="skill-section">
                <h3>Troubleshooting Tools</h3>
                <p>Git & GitHub</p>
                <p>Chrome DevTools</p>
                <p>VS Code</p>
              </div>

              <button
                className="enroll-btn"
                onClick={() => handleEnroll("Angular")}
              >
                Enroll Now
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ENROLL POPUP */}
      {showPopup && (

        <div className="popup-overlay">

          <div className="popup-box">

            <h2>Enroll for {selectedCourse}</h2>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="popup-buttons">

              <button onClick={handleSubmit}>
                OK
              </button>

              <button onClick={() => setShowPopup(false)}>
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}
        {/* CONTACT HOME */}
      <ContactHomeComp />

    </div>

  );

};

export default CourseComp;