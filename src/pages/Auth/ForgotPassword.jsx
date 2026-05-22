// pages/ForgotPassword.jsx — uses auth-extras.css classes
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearError, clearSuccess } from "../../store/slices/authSlice";
import { FaMapMarkerAlt, FaEnvelope, FaArrowLeft, FaArrowRight, FaPaperPlane } from "react-icons/fa";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const { loading, error, successMsg } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  const validate = () => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setEmailErr(err); return; }
    setEmailErr("");
    dispatch(forgotPassword({ email }));
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb1" />
      <div className="auth-orb auth-orb2" />
      <div className="auth-orb auth-orb3" />

      <div className="auth-card" style={{ maxWidth: 440 }}>

        {/* Logo */}
        <div className="auth-logo-bar">
          <div className="auth-logo-icon"><FaMapMarkerAlt /></div>
          <Link to="/" className="auth-logo-name">ShopFinder</Link>
        </div>

        <div className="auth-body">

          <div>
            <div className="auth-live-badge">
              <span className="auth-live-dot" style={{ background: "#f59e0b" }} />
              Account Recovery
            </div>
            <div className="auth-heading">Forgot your password?</div>
            <div className="auth-subheading">
              No worries! Enter your email and we'll send a reset link.
            </div>
          </div>

          <div className="auth-divider" />

          {/* Success state */}
          {successMsg ? (
            <div style={{ textAlign: "center", paddingBottom: 8 }}>
              <div className="auth-fp-success-icon"><FaPaperPlane /></div>
              <div className="auth-fp-success-title">Check your inbox!</div>
              <div className="auth-fp-success-sub">{successMsg}</div>
              <Link to="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
                Back to Login <FaArrowRight style={{ fontSize: 12 }} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }} noValidate>

              {error && <div className="auth-redux-error">⚠ {error}</div>}

              <div>
                <label className="auth-label">Email address</label>
                <div className={`auth-input-wrap${emailErr ? " auth-input-error" : ""}`}>
                  <span className="auth-input-icon"><FaEnvelope /></span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(""); }}
                    autoComplete="email"
                  />
                </div>
                {emailErr && <div className="auth-error-text">⚠ {emailErr}</div>}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading
                  ? <><div className="auth-spinner" /> Sending…</>
                  : <>Send reset link <FaArrowRight style={{ fontSize: 12 }} /></>}
              </button>

              <div style={{ textAlign: "center" }}>
                <Link to="/login" className="auth-back-link">
                  <FaArrowLeft style={{ fontSize: 11 }} /> Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}