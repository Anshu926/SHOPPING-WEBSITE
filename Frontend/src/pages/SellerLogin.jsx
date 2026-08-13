import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function SellerLogin() {
  const navigate = useNavigate();
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
      await api.post("/seller/login", form);
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
            <Link to="/customer/login" className="flow-link">
              Customer
            </Link>
            <Link to="/seller/login" className="flow-link active">
              Seller
            </Link>
          </div>
          <div>
            <span className="eyebrow">Seller</span>
            <h2>Login to your dashboard</h2>
          </div>
          <p>Access your store, manage products, and view orders.</p>
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
            <Link to="/seller/signup" className="text-link">
              Create a store
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
