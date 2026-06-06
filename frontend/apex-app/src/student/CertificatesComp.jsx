import React, { useState, useEffect } from "react";
import apiClient from "../../apiClient";

const CertificatesComp = ({ studentId }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await apiClient.get(`/api/lms/student/${studentId}/certificates`);
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  if (certificates.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎓</div>
        <p>No certificates earned yet</p>
      </div>
    );
  }

  return (
    <div className="certificates-section">
      <h2>Your Certificates</h2>
      <div className="certificates-grid">
        {certificates.map((cert) => (
          <div key={cert.id} className="certificate-card">
            <h3>{cert.course_name}</h3>
            <p><strong>Cert #:</strong> {cert.certificate_number}</p>
            <p><strong>Issued:</strong> {new Date(cert.issued_date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesComp;
