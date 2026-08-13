import heroImg from "./assets/hero.png";
import "./App.css";
import { Link } from "react-router-dom";
import useProducts from "./hooks/useProducts";
import useScrollReveal from "./hooks/useScrollReveal";
import useAuth from "./hooks/useAuth";
import ModelSlideshow from "./components/ModelSlideshow";
import { useEffect, useState } from "react";
import api from "./api";

function CardSkeleton() {
  return (
    <div className="card-skeleton reveal">
      <div className="skeleton skeleton-img" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-h" />
        <div className="skeleton skeleton-text" style={{ width: "50%" }} />
        <div className="skeleton skeleton-text" style={{ width: "35%" }} />
      </div>
    </div>
  );
}

function StatsBar() {
  const [stats, setStats] = useState({
    customers: null,
    sellers: null,
    products: null,
    averageRating: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/stats")
      .then((res) => {
        if (!mounted) return;
        setStats(res.data || {});
      })
      .catch((err) => {
        console.error(
          "Failed to load stats",
          err?.response || err.message || err,
        );
      })
      .finally(() => mounted && setLoadingStats(false));

    return () => {
      mounted = false;
    };
  }, []);

  const items = [
    {
      value: loadingStats ? "—" : (stats.customers ?? 0),
      label: "Happy Customers",
    },
    {
      value: loadingStats ? "—" : (stats.sellers ?? 0),
      label: "Verified Sellers",
    },
    {
      value: loadingStats ? "—" : (stats.products ?? 0),
      label: "Products Listed",
    },
    {
      value: loadingStats
        ? "—"
        : stats.averageRating
          ? `${stats.averageRating}★`
          : "—",
      label: "Average Rating",
    },
  ];

  return (
    <>
      {items.map((s) => (
        <div key={s.label} className="stat-item reveal">
          <strong>{s.value}</strong>
          <span>{s.label}</span>
        </div>
      ))}
    </>
  );
}

/* Role-aware empty state */
function EmptyState({ role }) {
  if (role === "seller") {
    return (
      <div className="empty-state-full">
        <div className="empty-state-blob">📦</div>
        <h3>No products listed yet</h3>
        <p>
          Your store is empty! Be the first to add a product
          <br />
          and start selling to thousands of customers.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/seller/create-product" className="btn primary">
            + List Your First Product
          </Link>
          <button
            className="btn outline"
            onClick={() => window.location.reload()}
          >
            ↻ Refresh
          </button>
        </div>
      </div>
    );
  }

  if (role === "customer") {
    return (
      <div className="empty-state-full">
        <div className="empty-state-blob">🔍</div>
        <h3>Nothing here yet</h3>
        <p>
          Our sellers haven't listed any products yet.
          <br />
          Check back soon — new items are added regularly!
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn primary"
            onClick={() => window.location.reload()}
          >
            ↻ Check Again
          </button>
          <Link to="/customer/dashboard" className="btn outline">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /* Guest */
  return (
    <div className="empty-state-full">
      <div className="empty-state-blob">🛍️</div>
      <h3>No products listed yet</h3>
      <p>
        Be the first seller to open a store and reach
        <br />
        thousands of shoppers on SHOP.
      </p>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/seller/signup" className="btn primary">
          🏪 Open Your Store
        </Link>
        <Link to="/customer/login" className="btn outline">
          Login as Customer
        </Link>
      </div>
    </div>
  );
}

export default function Landing() {
  const { products, loading, error } = useProducts();
  const { user } = useAuth();
  const gridRef = useScrollReveal();
  const statsRef = useScrollReveal();

  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="container">
        <div className="hero-section">
          <div className="hero-copy">
            <span className="hero-eyebrow anim-fade-up d1">
              ✦ New arrivals every week
            </span>
            <h1 className="hero-headline anim-fade-up d2">
              Discover your next
              <br />
              <span>favourite thing</span>
            </h1>
            <p className="hero-sub anim-fade-up d3">
              Curated essentials for everyday life — premium quality pieces at
              honest prices. Thousands of products from verified sellers.
            </p>
            <div className="cta-row anim-fade-up d4">
              <a href="#products" className="btn primary">
                Shop Now →
              </a>
              <Link to="/customer/signup" className="btn outline">
                Create Account
              </Link>
            </div>
            <div className="hero-trust anim-fade-up d5">
              <span>🔒 Secure checkout</span>
              <span>📦 Fast delivery</span>
              <span>⭐ Verified sellers</span>
            </div>
          </div>
          <div className="hero-image anim-fade-in d2">
            <ModelSlideshow height={440} />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="container" ref={statsRef}>
        <div className="stats-bar">
          {/* Live metrics fetched from backend */}
          <StatsBar />
        </div>
      </section>

      {/* ── Products ── */}
      <section id="products" className="container products-section">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          {!loading && products.length > 0 && (
            <span style={{ color: "var(--text-muted)", fontSize: 14 }}>
              {products.length} items
            </span>
          )}
        </div>

        <div className="product-grid" ref={gridRef}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">⚠️</div>
              <p style={{ color: "var(--error)", marginBottom: 12 }}>{error}</p>
              <button
                className="btn outline"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          ) : products.length ? (
            products.map((product) => (
              <article key={product._id} className="card reveal">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images?.[0] || heroImg}
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = heroImg;
                    }}
                  />
                </Link>
                <div className="card-body">
                  <h4>{product.title}</h4>
                  <p className="seller-name">
                    by{" "}
                    {product.seller?.username ||
                      product.seller?.shopName ||
                      "Unknown seller"}
                  </p>
                  <p className="price">${product.price?.toFixed(2)}</p>
                  <div className="card-footer">
                    <Link
                      to={`/products/${product._id}`}
                      className="btn primary sm"
                      style={{ width: "100%" }}
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState role={user?.role} />
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()}{" "}
            <strong style={{ color: "var(--accent-light)" }}>AB </strong>
            <em style={{ color: "#c4b5fd", fontStyle: "italic" }}>Fashion</em> —
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
