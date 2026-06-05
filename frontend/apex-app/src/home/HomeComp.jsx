import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SocialMediaComp from './SocialMediaComp';
import NavComp from './NavComp';
import AboutHomeComp from './AboutHomeComp';
import CandidateEnquiryComp from './CandidateEnquiryComp';
import ClientEnquiryComp from './ClientEnquiryComp';
import ContactHomeComp from './ContactHomeComp';
import WhatsappchatComp from './WhatsappchatComp';
import './SocialMediaComp.css';
import './HomeComp.css';
import axios from "axios";

const HomeComp = () => {
    const navigate = useNavigate()

    {/*Get NewBatches Content */}
  const [batches, setBatches] = useState([]);

useEffect(() => {
  loadBatches();
}, []);

const loadBatches = async () => {
  try {
    const res = await axios.get("/api/batches");
    setBatches(res.data?.data ?? []);
  } catch (error) {
    console.error("Failed to load batches:", error);
    setBatches([]);
  }
};


  return (
    <div>
      <SocialMediaComp />
      <NavComp />
      <AboutHomeComp />
      <CandidateEnquiryComp />
      <ClientEnquiryComp />
      <div className="batches-section">

  <div className="batches-header">
    <h2>Recent Batches</h2>
  </div>

  {/* Desktop Table */}
  <div className="table-wrapper">

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Course</th>
          <th>Trainer</th>
          <th>Start Date</th>
          <th>End Date</th>
        </tr>
      </thead>

      <tbody>
        {(Array.isArray(batches) ? batches : []).map((batch) => (
          <tr key={batch.id}>
            <td>{batch.id}</td>
            <td>{batch.course_name}</td>
            <td>{batch.trainer_name}</td>
            <td>{batch.start_date}</td>
            <td>{batch.end_date}</td>
          </tr>
        ))}
      </tbody>

    </table>

  </div>

</div>
      <ContactHomeComp />
      <WhatsappchatComp />
    </div>
  
  )
}

export default HomeComp;