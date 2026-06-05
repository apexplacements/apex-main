import React from 'react';

import ContactHomeComp from './ContactHomeComp';

import './JobsMockComp.css';

const JobsComp = () => {
  return (
    <div>
    <div className="JobsMock">
      
      
<section class="mock-main-hero-section">

 
  <div class="mock-logo-image-container">
    <img src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/apex-logo.jpeg" alt="Logo" />
  </div>

  
  <div class="mock-background-image-wrapper">
    <img src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/jobs.png" alt="Courses" />
  </div>

  
  <div class="mock-navigation-menu-wrapper">

    <div class="mock-single-nav-item">Home</div>

    <div class="mock-single-nav-item">About</div>

    <div class="mock-single-nav-item">Courses</div>

    <div class="mock-single-nav-item">New Batches</div>

    <div class="mock-single-nav-item">IT Support</div>

    
    <div class="mock-single-nav-item mock-jobs-dropdown-wrapper">
      Jobs

      <div class="mock-dropdown-content-box">
        <div>Mock</div>
        <div>Placements</div>
        <div>Blogs</div>
      </div>
    </div>

    <div class="mock-single-nav-item">Contact Us</div>

  </div>

</section>


<section class="mock-course-grid-layout">

  
  <div class="mock-course-card-container">

    <div class="mock-course-image-wrapper">
      <img src="./ImageBox/java.jpg" alt="Java Fullstack" />
    </div>

    <div class="mock-course-description-box">
      <p>
        Learn Java Fullstack with real-time projects and placement support.
      </p>
    </div>

  </div>

  
  <div class="mock-course-card-container">

    <div class="mock-course-description-box">
      <p>
        Master Python Fullstack with Django, APIs, and frontend technologies.
      </p>
    </div>

    <div class="mock-course-image-wrapper">
      <img src="./ImageBox/python.jpg" alt="Python Fullstack" />
    </div>

  </div>

  
  <div class="mock-course-card-container">

    <div class="mock-course-image-wrapper">
      <img src="./ImageBox/dotnet.jpg" alt=".NET Fullstack" />
    </div>

    <div class="mock-course-description-box">
      <p>
        Become a .NET Fullstack developer using ASP.NET and SQL Server.
      </p>
    </div>

  </div>

  
  <div class="mock-course-card-container">

    <div class="mock-course-description-box">
      <p>
        Learn DevOps tools like Docker, Kubernetes, Jenkins, and AWS.
      </p>
    </div>

    <div class="mock-course-image-wrapper">
      <img src="./ImageBox/devops.jpg" alt="DevOps" />
    </div>

  </div>

</section>
      
    </div>
      <ContactHomeComp />
    </div>
  )
}

export default JobsComp