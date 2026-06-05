import React, { useEffect, useState } from "react";
import apiClient from "../apiClient";
import "./HrInterviewCard.css";

const HrInterviewCard = () => {
  const [requests, setRequests] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInterviewData = async () => {
      try {
        const [requestsRes, batchesRes] = await Promise.all([
          apiClient.get("/customer-requests"),
          apiClient.get("/batches"),
        ]);

        const requestData = requestsRes.data?.data || [];
        const batchData = batchesRes.data?.data || [];

        setRequests(requestData.slice(0, 5));
        setBatches(batchData.slice(0, 5));
      } catch (err) {
        setError("Unable to load interview pipeline details.");
      } finally {
        setLoading(false);
      }
    };

    loadInterviewData();
  }, []);

  return (
    <section className="hr-interview-card">
      <div className="hr-interview-card-header">
        <div>
          <h2>Interview & onboarding pipeline</h2>
          <p>Live candidate requests and batch onboarding activity from the HR portal.</p>
        </div>
      </div>

      {loading ? (
        <div className="hr-interview-loading">Loading HR pipeline...</div>
      ) : error ? (
        <div className="hr-interview-error">{error}</div>
      ) : (
        <div className="hr-interview-grid">
          <div className="hr-interview-panel">
            <h3>Upcoming interviews</h3>
            <div className="hr-interview-list">
              {requests.length ? (
                requests.map((request) => (
                  <article key={request.id} className="hr-interview-item">
                    <div>
                      <strong>{request.full_name || request.email || "Candidate"}</strong>
                      <span>{request.support_type || "Interview request"}</span>
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="hr-interview-badge">{request.phone || "No phone"}</div>
                  </article>
                ))
              ) : (
                <div className="hr-interview-empty">No new interview requests.</div>
              )}
            </div>
          </div>

          <div className="hr-interview-panel">
            <h3>Onboarding batches</h3>
            <div className="hr-interview-list">
              {batches.length ? (
                batches.map((batch) => (
                  <article key={batch.id} className="hr-interview-item">
                    <div>
                      <strong>{batch.course_name || "New batch"}</strong>
                      <span>Trainer: {batch.trainer_name || "TBD"}</span>
                      <span>
                        {batch.start_date ? new Date(batch.start_date).toLocaleDateString() : "Start date pending"}
                      </span>
                    </div>
                    <div className="hr-interview-badge">Batch #{batch.id}</div>
                  </article>
                ))
              ) : (
                <div className="hr-interview-empty">No new onboarding batches.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HrInterviewCard;
