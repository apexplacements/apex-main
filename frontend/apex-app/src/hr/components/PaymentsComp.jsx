import React, { useState } from "react";
import apiClient from "../../apiClient";
import "./components.css";

const PaymentsComp = ({ payments, paymentStats, onRefresh }) => {
  const [form, setForm] = useState({
    payment_type: "Course Fee",
    payer_name: "",
    payee_name: "",
    amount: "",
    currency: "INR",
    category: "",
    reference: "",
    status: "Completed",
    payment_date: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.post("/api/payments", form);
      setSuccess("Payment recorded successfully!");
      setForm({ payment_type: "Course Fee", payer_name: "", payee_name: "", amount: "", currency: "INR", category: "", reference: "", status: "Completed", payment_date: "", notes: "" });
      onRefresh();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-container">
      <h2>Payment Management</h2>
      
      {/* Payment Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Fees Received</h4>
          <p className="stat-value">₹{paymentStats.totalFeesReceived?.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h4>Total Salaries Paid</h4>
          <p className="stat-value">₹{paymentStats.totalSalariesPaid?.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h4>Pending Payments</h4>
          <p className="stat-value">{paymentStats.pendingPayments}</p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <form onSubmit={handleSubmit} className="form-container">
        <select name="payment_type" value={form.payment_type} onChange={handleInputChange}>
          <option>Course Fee</option>
          <option>Salary Payment</option>
          <option>Placement Bonus</option>
          <option>Other</option>
        </select>
        <input
          type="text"
          name="payer_name"
          placeholder="Payer Name"
          value={form.payer_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="payee_name"
          placeholder="Payee Name"
          value={form.payee_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="reference"
          placeholder="Reference/Transaction ID"
          value={form.reference}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="payment_date"
          value={form.payment_date}
          onChange={handleInputChange}
        />
        <select name="status" value={form.status} onChange={handleInputChange}>
          <option>Completed</option>
          <option>Pending</option>
          <option>Failed</option>
          <option>Cancelled</option>
        </select>
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleInputChange}
          rows="2"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Recording..." : "Record Payment"}
        </button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Payer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.payment_type}</td>
                <td>{payment.payer_name}</td>
                <td>₹{payment.amount}</td>
                <td>
                  <span className={`status-badge ${payment.status?.toLowerCase()}`}>
                    {payment.status}
                  </span>
                </td>
                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsComp;
