import React from 'react';
import './AboutHomeComp.css';
import { useNavigate } from "react-router-dom";

const AboutHomeComp = () => {

  const navigate = useNavigate();

  return (
    <div>
         {/*About apex*/}
      <div className="container-about">

  {/* Left Side Image */}
  
  <img
    src="https://s3.ap-south-1.amazonaws.com/www.apexplacements.in/ImageBox/about_home.png"
    alt="About Apex Skills"
  />

  {/* Right Side Content */}
  <div className="content">

    <h1>About APEX SKILLS</h1>

    <h4>
      APEX SKILLS & PLACEMENT CENTRE is the Best Software Training
      Institute In Hyderabad | KPHB that offers comprehensive training
      on a wide range of software technologies, delivered by real-time
      & full-time industry experts.

      We also provide lab sessions after every class to give you
      hands-on experience. To solidify your learning, you must work on
      a mandatory project in a field or domain of your choice,
      replicating real-time use cases.

      In addition to comprehensive training, APEX provides various
      career support services to help you land your dream job.
    </h4>

    {/* Redirect Button */}
          <button
            type="button"
            onClick={() => navigate('/about')}
          >
            Know More
          </button>

  </div>

</div>
    </div>
  )
}

export default AboutHomeComp