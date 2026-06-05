import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SocialMediaComp.css";

const SocialMediaComp = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const navigate = useNavigate();

  const isAuthenticated =
    typeof window !== "undefined"
      ? localStorage.getItem("token") ||
        sessionStorage.getItem("currentUser")
      : null;

  // Social media icons data
  const socialIcons = [
    {
      link: "https://www.facebook.com/",
      img: "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/facebook.png",
      alt: "Facebook",
    },
    {
      link: "https://www.instagram.com/",
      img: "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/instagram.png",
      alt: "Instagram",
    },
    {
      link: "https://www.linkedin.com/",
      img: "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/linkedln.png",
      alt: "LinkedIn",
    },
    {
      link: "https://twitter.com/",
      img: "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/twitter.png",
      alt: "Twitter",
    },
    {
      link: "https://web.whatsapp.com/",
      img: "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/whatsapp.png",
      alt: "WhatsApp",
    },
    {
      link: "https://telegram.org/",
      img: "https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/telegram.png",
      alt: "Telegram",
    },
  ];

  // Auto-slide 3 icons every 1 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 3) % socialIcons.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [socialIcons.length]);

  const visibleIcons = [
    socialIcons[startIndex % socialIcons.length],
    socialIcons[(startIndex + 1) % socialIcons.length],
    socialIcons[(startIndex + 2) % socialIcons.length],
  ];

  return (
    <div className="container">
      {/* Left Side */}
      
        <div className="login-button">
          <button
            className="login-btn"
            onClick={() => navigate("/admin/login")}
            aria-label="Log in and go to dashboard"
          >
            LogIn
          </button>
        </div>
     

      {/* Middle Side */}
      <div className="social-slider">
        <div className="social-icons-wrapper">
          {visibleIcons.map((icon, index) => (
            <a
              key={index}
              href={icon.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={icon.img} alt={icon.alt} />
            </a>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div>
        {/* ENQUIRY BUTTON */}
        <button
          className="enquiry-btn"
          onClick={() => setShowPopup(true)}
        >
          ENQUIRY
        </button>

        {/* POPUP WINDOW */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-box">
              {/* CLOSE BUTTON */}
              <span
                className="close-btn"
                onClick={() => setShowPopup(false)}
              >
                ×
              </span>

              {/* CONTENT */}
              <h2>
                Welcome To <br />
                APEX SKILLS & PLACEMENTS CENTRE
              </h2>

              <p>
                We are happy to help you with your
                career and training support.
              </p>

              <div className="contact-box">
                <h4>📞 Call Me On</h4>
                <h5>6305101723</h5>
                <h5>6302007579</h5>
              </div>

              <div className="contact-box">
                <h4>📧 Mail Me On</h4>
                <h5>apexplacements@gmail.com</h5>
              </div>

              {/* OK BUTTON */}
              <button
                className="ok-btn"
                onClick={() => setShowPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaComp;