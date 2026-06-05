import React from 'react'
import { useNavigate } from 'react-router-dom';
import SocialMediaComp from './SocialMediaComp';
import NavComp from './NavComp';
import AboutHomeComp from './AboutHomeComp';
import CandidateEnquiryComp from './CandidateEnquiryComp';
import ClientEnquiryComp from './ClientEnquiryComp';
import ContactHomeComp from './ContactHomeComp';
import WhatsappchatComp from './WhatsappchatComp';
import './SocialMediaComp.css';

const HomeComp = () => {
    const navigate = useNavigate()
  return (
    <div>
      <SocialMediaComp />
      <NavComp />
      <AboutHomeComp />
      <CandidateEnquiryComp />
      <ClientEnquiryComp />
      <ContactHomeComp />
      <WhatsappchatComp />
    </div>
  
  )
}

export default HomeComp;