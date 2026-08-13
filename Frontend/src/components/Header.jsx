import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (path) => pathname === path;

  /* Close menu on route change */
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  /* Close menu on outside click */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* Nav links based on role */
  const navLinks = (
    <>
      <Link
        to="/"
        className={`nav-link${isActive("/") ? " nav-link-active" : ""}`}
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>

      {!loading && user?.role === "seller" && (
        <>
          <Link
            to="/seller/dashboard"
            className={`nav-link${isActive("/seller/dashboard") ? " nav-link-active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/seller/create-product"
            className={`nav-link${isActive("/seller/create-product") ? " nav-link-active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            + List Product
          </Link>
          <Link
            to="/seller/orders"
            className={`nav-link${isActive("/seller/orders") ? " nav-link-active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>
        </>
      )}

      {!loading && user?.role === "customer" && (
        <>
          <Link
            to="/customer/dashboard"
            className={`nav-link${isActive("/customer/dashboard") ? " nav-link-active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/customer/cart"
            className={`nav-link${isActive("/customer/cart") ? " nav-link-active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            🛒 Cart
          </Link>
        </>
      )}

      {!loading && user ? (
        <>
          <span className="nav-user">Hi, {user.username}</span>
          <button
            type="button"
            className="btn outline sm"
            onClick={() => { logout(); setMenuOpen(false); }}
          >
            Logout
          </button>
        </>
      ) : (
        !loading && (
          <>
            <Link
              to="/customer/signup"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
            <Link
              to="/customer/login"
              className="btn primary sm"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          </>
        )
      )}
    </>
  );

  return (
    <header className="site-header" ref={menuRef}>
      <div className="container header-inner">
        {/* Brand */}
        <Link to="/" className="brand">
          <span className="brand-ab">AB</span>
          <span className="brand-fashion"> Fashion</span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav nav-desktop">{navLinks}</nav>

        {/* Right: theme toggle + hamburger */}
        <div className="nav-right">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            className={`hamburger${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div className={`mobile-nav${menuOpen ? " is-open" : ""}`}>
        <nav className="mobile-nav-inner">{navLinks}</nav>
      </div>
    </header>
  );
}
