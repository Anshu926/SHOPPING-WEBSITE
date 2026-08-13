import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../App.css";

export default function CustomerDashboard() {
  const { user } = useAuth();

  const actions = [
    {
      icon: "🛍️",
      title: "Browse Products",
      desc: "Explore thousands of curated products from verified sellers.",
      to: "/",
      label: "Shop now",
    },
    {
      icon: "🛒",
      title: "My Cart & Orders",
      desc: "View your active orders, track status, or place a new order.",
      to: "/customer/cart",
      label: "View cart",
    },
    {
      icon: "⭐",
      title: "Featured Deals",
      desc: "Check out the latest arrivals and discounted items.",
      to: "/#products",
      label: "See deals",
    },
    {
      icon: "👤",
      title: "Account",
      desc: "Manage your profile details, address, and preferences.",
      to: "#",
      label: "Coming soon",
      disabled: true,
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Hero banner */}
        <div className="dashboard-hero">
          <p className="dashboard-hero-greeting">Welcome back</p>
          <h2>
            Hello, {user?.username || "Shopper"} 👋
          </h2>
          <p>
            Ready to find something amazing today? Browse our curated collection below.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <Link to="/" className="btn primary">Browse Products</Link>
            <Link to="/customer/cart" className="btn outline">My Orders</Link>
          </div>
        </div>

        {/* Quick actions */}
        <h3 style={{ marginBottom: 18, color: "var(--text-muted)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Quick Actions
        </h3>
        <div className="dashboard-grid">
          {actions.map((action) => (
            <Link
              key={action.title}
              to={action.disabled ? "#" : action.to}
              className="action-card"
              style={action.disabled ? { opacity: 0.5, pointerEvents: "none" } : {}}
            >
              <div className="action-card-icon">{action.icon}</div>
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
              <span className="card-arrow" style={{ fontSize: 14, fontWeight: 600, color: action.disabled ? "var(--text-muted)" : "var(--accent-light)" }}>
                {action.label} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
