import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function CustomerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Registering...");
    setError(null);
    try {
      await api.post("/customer/signup", form);
      setStatus("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/customer/login"), 900);
    } catch (err) {
      setError(err?.response?.data?.error || "Registration failed");
      setStatus(null);
    }
  };

  return (
    <div className="page container auth-page">
      <div className="form-card compact">
        <div className="form-heading">
          <div className="flow-switch">
            <Link to="/customer/signup" className="flow-link active">
              Customer
            </Link>
            <Link to="/seller/signup" className="flow-link">
              Seller
            </Link>
          </div>
          <div>
            <span className="eyebrow">Customer</span>
            <h2>Create your account</h2>
          </div>
          <p>Sign up quickly and start shopping with a saved account.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid two-column">
          <label>
            Username
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <div className="button-row justify-end">
            <Link to="/customer/login" className="text-link">
              Already registered?
            </Link>
            <button type="submit" className="btn primary action-btn">
              Create account
            </button>
          </div>
        </form>

        {status && <div className="form-alert success">{status}</div>}
        {error && <div className="form-alert error">{error}</div>}
      </div>
    </div>
  );
}
