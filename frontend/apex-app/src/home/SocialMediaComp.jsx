import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SocialMediaComp.css";

const SocialMediaComp = () => {

  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = typeof window !== "undefined"
    ? localStorage.getItem("token") || sessionStorage.getItem("currentUser")
    : null;

  return (
    <div className="container">

      {/* Left Side */}
      {/* Left Side */}
{!isAuthenticated && (
  <div className="login-button">
    <button
      className="login-btn"
      onClick={() => navigate('/admin/login')}
      aria-label="Log in and go to dashboard"
    >
      LogIn
    </button>
  </div>
)}

{/* Middle Side */}
<div className="social-slider">

  <div className="social-track social-icons">

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
      href="https://www.messenger.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/messanger.png"
        alt="Messenger"
      />
    </a>

    <a
      href="https://twitter.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/twitter.png"
        alt="Twitter"
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
      href="https://web.whatsapp.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/whatsapp.png"
        alt="WhatsApp"
      />
    </a>

    <a
      href="https://telegram.org/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/telegram.png"
        alt="Telegram"
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
      href="https://www.linkedin.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/linkedln.png"
        alt="LinkedIn"
      />
    </a>

    {/* Duplicate icons for smooth infinite slide */}

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