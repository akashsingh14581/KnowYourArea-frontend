// pages/ResetPassword.jsx — uses auth-extras.css classes
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearError, clearSuccess } from "../../store/slices/authSlice";
import { FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle } from "react-icons/fa";

export default function ResetPassword() {
  const { token } = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, successMsg } = useSelector((s) => s.auth);

  const [form, setForm]         = useState({ password: "", confirm: "" });
  const [errs, setErrs]         = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  /* password strength: 0-4 */
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8)          s++;
    if (/[A-Z]/.test(p))        s++;
    if (/[0-9]/.test(p))        s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e", "#6366f1"][strength];

  const validate = () => {
    const e = {};
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (!form.confirm) e.confirm = "Please confirm password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errs[name]) setErrs((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e_ = validate();
    if (Object.keys(e_).length) { setErrs(e_); return; }
    const res = await dispatch(resetPassword({ token, ...form }));
    if (res.meta.requestStatus === "fulfilled") {
      setTimeout(() => navigate("/login"), 2000);
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

        <div className="auth-body">

          <div>
            <div className="auth-live-badge">
              <span className="auth-live-dot" style={{ background: "#6366f1" }} />
              Reset Password
            </div>
            <div className="auth-heading">Create new password</div>
            <div className="auth-subheading">
              Choose something strong — at least 6 characters.
            </div>
          </div>

          <div className="auth-divider" />

          {/* ── Success state ── */}
          {successMsg ? (
            <div style={{ textAlign: "center", paddingBottom: 8 }}>
              <FaCheckCircle className="auth-reset-success-icon" />
              <div className="auth-reset-success-title">Password Updated!</div>
              <div className="auth-reset-success-sub">{successMsg}</div>

              {/* Redirect progress bar */}
              <div className="auth-redirect-bar-wrap">
                <div className="auth-redirect-bar" />
              </div>
              <div className="auth-redirect-label">Redirecting to login…</div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
              noValidate
            >
              {error && <div className="auth-redux-error">⚠ {error}</div>}

              {/* New password */}
              <div>
                <label className="auth-label">New password</label>
                <div className={`auth-input-wrap${errs.password ? " auth-input-error" : ""}`}>
                  <span className="auth-input-icon"><FaLock /></span>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Min. 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPass((p) => !p)}>
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errs.password && <div className="auth-error-text">⚠ {errs.password}</div>}

                {/* Strength bar */}
                {form.password && (
                  <>
                    <div className="auth-strength-bars">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="auth-strength-bar"
                          style={{ background: n <= strength ? strengthColor : undefined }}
                        />
                      ))}
                    </div>
                    <div className="auth-strength-label" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </div>
                  </>
                )}
              </div>

              {/* Confirm */}
              <div>
                <label className="auth-label">Confirm password</label>
                <div className={`auth-input-wrap${errs.confirm ? " auth-input-error" : ""}`}>
                  <span className="auth-input-icon"><FaLock /></span>
                  <input
                    type={showConf ? "text" : "password"}
                    name="confirm"
                    placeholder="Re-enter password"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowConf((p) => !p)}>
                    {showConf ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errs.confirm && <div className="auth-error-text">⚠ {errs.confirm}</div>}
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading
                  ? <><div className="auth-spinner" /> Resetting…</>
                  : <>Reset password <FaArrowRight style={{ fontSize: 12 }} /></>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}