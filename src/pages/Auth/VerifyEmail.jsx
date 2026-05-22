// pages/VerifyEmail.jsx — uses auth-extras.css classes
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmail, resendVerification } from "../../store/slices/authSlice";
import { FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function VerifyEmail() {
  const { token } = useParams();
  const dispatch  = useDispatch();

  const [status, setStatus]           = useState("loading"); // "loading" | "success" | "error"
  const [message, setMessage]         = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendSent, setResendSent]   = useState(false);
  const [resendErr, setResendErr]     = useState("");
  const [resending, setResending]     = useState(false);

  useEffect(() => {
    const verify = async () => {
      const res = await dispatch(verifyEmail(token));
      if (res.meta.requestStatus === "fulfilled") {
        setStatus("success");
        setMessage(res.payload.message);
      } else {
        setStatus("error");
        setMessage(res.payload?.message || "Verification failed. This link may have expired.");
      }
    };
    verify();
  }, [token, dispatch]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail || !/\S+@\S+\.\S+/.test(resendEmail)) {
      setResendErr("Enter a valid email"); return;
    }
    setResending(true);
    const res = await dispatch(resendVerification({ email: resendEmail }));
    setResending(false);
    if (res.meta.requestStatus === "fulfilled") {
      setResendSent(true);
    } else {
      setResendErr(res.payload?.message || "Failed to resend");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb1" />
      <div className="auth-orb auth-orb2" />
      <div className="auth-orb auth-orb3" />

      <div className="auth-card" style={{ maxWidth: 440 }}>

        <div className="auth-logo-bar">
          <div className="auth-logo-icon"><FaMapMarkerAlt /></div>
          <Link to="/" className="auth-logo-name">ShopFinder</Link>
        </div>

        <div className="auth-body" style={{ textAlign: "center" }}>

          {/* ── Loading ── */}
          {status === "loading" && (
            <div className="auth-verify-loading">
              <div className="auth-verify-spinner" />
              <div className="auth-verify-loading-text">Verifying your email…</div>
            </div>
          )}

          {/* ── Success ── */}
          {status === "success" && (
            <>
              <FaCheckCircle className="auth-verify-success-icon" />
              <div className="auth-verify-heading">Email Verified!</div>
              <div className="auth-verify-sub">{message}</div>
              <div style={{ marginTop: 24 }}>
                <Link to="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
                  Go to Login →
                </Link>
              </div>
            </>
          )}

          {/* ── Error ── */}
          {status === "error" && (
            <>
              <FaTimesCircle className="auth-verify-error-icon" />
              <div className="auth-verify-heading">Link Expired</div>
              <div className="auth-verify-sub">{message}</div>

              <div className="auth-divider" style={{ margin: "20px 0" }} />

              {resendSent ? (
                <div className="auth-verify-resend-success">
                  ✅ New verification link sent! Check your inbox.
                </div>
              ) : (
                <>
                  <div className="auth-verify-resend-label">
                    Request a new verification link:
                  </div>

                  <form onSubmit={handleResend} style={{ textAlign: "left" }} noValidate>
                    <div className="auth-verify-resend-row">
                      <div className={`auth-input-wrap${resendErr ? " auth-input-error" : ""}`}>
                        <span className="auth-input-icon"><FaEnvelope /></span>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={resendEmail}
                          onChange={(e) => { setResendEmail(e.target.value); setResendErr(""); }}
                        />
                      </div>
                      <button type="submit" className="auth-verify-resend-btn" disabled={resending}>
                        {resending ? "…" : "Resend"}
                      </button>
                    </div>
                    {resendErr && <div className="auth-error-text" style={{ marginTop: 6 }}>⚠ {resendErr}</div>}
                  </form>
                </>
              )}

              <div>
                <Link to="/login" className="auth-back-link">
                  <FaArrowLeft style={{ fontSize: 11 }} /> Back to Login
                </Link>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}