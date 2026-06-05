import React from 'react';

import ContactHomeComp from './ContactHomeComp';

import './InterviewQuestionsComp.css';
import SocialMediaComp from './SocialMediaComp';

const InterviewQuestionsComp = () => {
  return (
    <div>
    <div className="InterviewQuestions">
      
      <SocialMediaComp />
<section class="mock-main-hero-section">

 
  <div class="interview-questions-logo-image-container">
    <img src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex-logo.jpeg" alt="Logo" />
  </div>

  
  <div class="interview-questions-background-image-wrapper">
    <img src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/jobs.png" alt="Courses" />
  </div>

  
  <div class="interview-questions-navigation-menu-wrapper">

    <div class="interview-questions-single-nav-item">Home</div>

    <div class="interview-questions-single-nav-item">About</div>

    <div class="interview-questions-single-nav-item">Courses</div>

    <div class="interview-questions-single-nav-item">New Batches</div>

    <div class="interview-questions-single-nav-item">IT Support</div>

    
    <div class="interview-questions-single-nav-item interview-questions-jobs-dropdown-wrapper">
      Activities

      <div class="interview-questions-dropdown-content-box">
        <div>Reviews</div>
        <div>Blogs</div>
        <div>Interview Questions</div>
      </div>
    </div>

    <div class="interview-questions-single-nav-item">Contact Us</div>

  </div>

</section>


<section class="interview-questions-course-grid-layout">

  
  <div class="interview-questions-course-card-container">

    <div class="interview-questions-course-image-wrapper">
      <img src="./ImageBox/java.jpg" alt="Java Fullstack" />
    </div>

    <div class="interview-questions-course-description-box">
      <p>
        Learn Java Fullstack with real-time projects and placement support.
      </p>
    </div>

  </div>

  
  <div class="interview-questions-course-card-container">

    <div class="interview-questions-course-description-box">
      <p>
        Master Python Fullstack with Django, APIs, and frontend technologies.
      </p>
    </div>

    <div class="interview-questions-course-image-wrapper">
      <img src="./ImageBox/python.jpg" alt="Python Fullstack" />
    </div>

  </div>

  
  <div class="interview-questions-course-card-container">

    <div class="interview-questions-course-image-wrapper">
      <img src="./ImageBox/dotnet.jpg" alt=".NET Fullstack" />
    </div>

    <div class="interview-questions-course-description-box">
      <p>
        Become a .NET Fullstack developer using ASP.NET and SQL Server.
      </p>
    </div>

  </div>

  
  <div class="interview-questions-course-card-container">

    <div class="interview-questions-course-description-box">
      <p>
        Learn DevOps tools like Docker, Kubernetes, Jenkins, and AWS.
      </p>
    </div>

    <div class="interview-questions-course-image-wrapper">
      <img src="./ImageBox/devops.jpg" alt="DevOps" />
    </div>

  </div>

</section>
      
    </div>
      <ContactHomeComp />
    </div>
  )
}

export default InterviewQuestionsComp;