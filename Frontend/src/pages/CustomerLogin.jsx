import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import useAuth from "../hooks/useAuth";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      await api.post("/customer/login", form);
      await refreshAuth();
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="page container auth-page">
      <div className="form-card compact">
        <div className="form-heading">
          <div className="flow-switch">
            <Link to="/customer/login" className="flow-link active">
              Customer
            </Link>
            <Link to="/seller/login" className="flow-link">
              Seller
            </Link>
          </div>
          <div>
            <span className="eyebrow">Customer</span>
            <h2>Login to your account</h2>
          </div>
          <p>Secure session-based login for customers.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
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
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <div className="button-row justify-end">
            <Link to="/customer/signup" className="text-link">
              Create account
            </Link>
            <button type="submit" className="btn primary action-btn">
              Login
            </button>
          </div>
        </form>

        {error && <div className="form-alert error">{error}</div>}
      </div>
    </div>
  );
}
