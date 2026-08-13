import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../App.css";

export default function SellerDashboard() {
  const { user } = useAuth();

  const actions = [
    {
      icon: "📦",
      title: "List a Product",
      desc: "Create a new product listing and make it visible to all shoppers.",
      to: "/seller/create-product",
      label: "Create product",
    },
    {
      icon: "🧾",
      title: "Manage Orders",
      desc: "Review incoming orders, accept or reject them, and keep customers updated.",
      to: "/seller/orders",
      label: "View orders",
    },
    {
      icon: "🏪",
      title: "Your Storefront",
      desc: "Preview your public store page as customers see it.",
      to: "/",
      label: "View store",
    },
    {
      icon: "📊",
      title: "Analytics",
      desc: "Track your product performance and revenue insights.",
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
          <p className="dashboard-hero-greeting">Seller Dashboard</p>
          <h2>
            Welcome, {user?.shopName || user?.username || "Seller"} 🏪
          </h2>
          <p>
            Manage your products and orders from one place. Build your store and reach thousands of customers.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <Link to="/seller/create-product" className="btn primary">+ List Product</Link>
            <Link to="/seller/orders" className="btn outline">View Orders</Link>
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
