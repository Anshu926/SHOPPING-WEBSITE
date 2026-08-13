import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function SellerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    shopName: "",
  });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("Creating seller account...");
    setError(null);
    try {
      await api.post("/seller/signup", form);
      setStatus("Seller account created. Redirecting to login...");
      setTimeout(() => navigate("/seller/login"), 900);
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
            <Link to="/customer/signup" className="flow-link">
              Customer
            </Link>
            <Link to="/seller/signup" className="flow-link active">
              Seller
            </Link>
          </div>
          <div>
            <span className="eyebrow">Seller</span>
            <h2>Open your store</h2>
          </div>
          <p>Sign up to publish products and manage your seller dashboard.</p>
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
            Shop name
            <input
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
            />
          </label>
          <div className="button-row justify-end">
            <Link to="/seller/login" className="text-link">
              Already a seller?
            </Link>
            <button type="submit" className="btn primary action-btn">
              Register store
            </button>
          </div>
        </form>

        {status && <div className="form-alert success">{status}</div>}
        {error && <div className="form-alert error">{error}</div>}
      </div>
    </div>
  );
}
