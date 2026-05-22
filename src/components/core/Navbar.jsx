import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { logout } from "../../store/slices/authSlice";
import api from "../../services/api";

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen]       = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate    = useNavigate();
  const dispatch    = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // backend cookie clear kare
    } catch (_) {}
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/");
  };

  // Avatar initials from name
  const getInitials = (name = "") =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

  // Dashboard route based on role
  const dashboardRoute = user?.role === "admin" ? "/admin/add-category" : "/dashboard";

  return (
    <>
      <nav className="ld-nav">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <div className="logo-icon">📍</div>
          ShopFinder
        </Link>

        {/* Desktop links */}
        <ul className="nav-links">
          <li><a href="#features"     onClick={closeMenu}>Features</a></li>
          <li><a href="#how-it-works" onClick={closeMenu}>How it works</a></li>
          <li><a href="#reviews"      onClick={closeMenu}>Reviews</a></li>
        </ul>

        {/* Right side */}
        <div className="nav-right">
          {/* Theme toggle */}
          <button
            className="theme-btn"
            onClick={toggleTheme}
            title="Toggle theme"
            aria-label="Toggle light/dark mode"
          >
            {isDark ? "🌙" : "☀️"}
          </button>

          {user ? (
            /* ── Logged in: avatar + dropdown ── */
            <div className="nav-avatar-wrap" ref={dropdownRef}>
              <button
                className="nav-avatar-btn"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="User menu"
              >
                <div className="nav-avatar">
                  {getInitials(user.name)}
                </div>
                <span className="nav-avatar-name">{user.name.split(" ")[0]}</span>
                <span className={`nav-avatar-chevron ${dropdownOpen ? "nav-chevron-up" : ""}`}>
                  ▾
                </span>
              </button>

              {dropdownOpen && (
                <div className="nav-dropdown">
                  {/* User info */}
                  <div className="nav-dd-header">
                    <div className="nav-dd-avatar">{getInitials(user.name)}</div>
                    <div>
                      <div className="nav-dd-name">{user.name}</div>
                      <div className="nav-dd-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="nav-dd-divider" />

                  {/* Role badge */}
                  {user.role === "admin" && (
                    <div className="nav-dd-role">
                      <span className="nav-dd-role-badge">⚡ Admin</span>
                    </div>
                  )}

                  {/* Links */}
                  <Link
                    to={dashboardRoute}
                    className="nav-dd-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span>🏠</span> Dashboard
                  </Link>

                  {user.role !== "admin" && (
                    <Link
                      to="/create-shop"
                      className="nav-dd-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>🏪</span> Add Your Shop
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      to="/admin/add-category"
                      className="nav-dd-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span>🗂️</span> Manage Categories
                    </Link>
                  )}

                  <div className="nav-dd-divider" />

                  <button className="nav-dd-item nav-dd-logout" onClick={handleLogout}>
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Not logged in ── */
            <>
              <Link to="/login" className="nav-cta nav-cta-desktop">
                Login / Register
              </Link>
              <Link to="/create-shop" className="nav-cta nav-cta-desktop">
                Add Your Shop →
              </Link>
            </>
          )}

          {/* Hamburger — mobile only */}
          <button
            className={`nav-hamburger ${menuOpen ? "nav-hamburger-open" : ""}`}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && <div className="nav-overlay" onClick={closeMenu} />}

      {/* Mobile drawer */}
      <div className={`nav-drawer ${menuOpen ? "nav-drawer-open" : ""}`}>
        <div className="nav-drawer-header">
          <div className="nav-drawer-logo">
            <div className="logo-icon" style={{ width: 28, height: 28, fontSize: 14 }}>📍</div>
            ShopFinder
          </div>
          <button className="nav-drawer-close" onClick={closeMenu}>✕</button>
        </div>

        {/* Mobile: user info if logged in */}
        {user && (
          <div className="nav-drawer-user">
            <div className="nav-drawer-avatar">{getInitials(user.name)}</div>
            <div>
              <div className="nav-drawer-uname">{user.name}</div>
              <div className="nav-drawer-uemail">{user.email}</div>
            </div>
          </div>
        )}

        <div className="nav-drawer-links">
          <a href="#features"     onClick={closeMenu}>Features</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="#reviews"      onClick={closeMenu}>Reviews</a>
        </div>

        <div className="nav-drawer-actions">
          {user ? (
            <>
              <Link
                to={dashboardRoute}
                className="nav-drawer-btn-ghost"
                onClick={closeMenu}
              >
                🏠 Dashboard
              </Link>
              {user.role !== "admin" && (
                <Link
                  to="/create-shop"
                  className="nav-drawer-btn-primary"
                  onClick={closeMenu}
                >
                  🏪 Add Your Shop
                </Link>
              )}
              <button
                className="nav-drawer-btn-logout"
                onClick={() => { handleLogout(); closeMenu(); }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"       className="nav-drawer-btn-ghost"   onClick={closeMenu}>Login / Register</Link>
              <Link to="/create-shop" className="nav-drawer-btn-primary" onClick={closeMenu}>＋ Add Your Shop</Link>
            </>
          )}
        </div>

        <div className="nav-drawer-footer">
  <span>Theme</span>
  <button className="theme-btn-drawer" onClick={toggleTheme}>
    {isDark ? "🌙" : "☀️"}
  </button>
</div>
      </div>
    </>
  );
}

export default Navbar;