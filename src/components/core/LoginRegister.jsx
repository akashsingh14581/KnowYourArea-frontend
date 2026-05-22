import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, register, clearError } from "../../store/slices/authSlice";
import {
  FaMapMarkerAlt, FaEye, FaEyeSlash,
  FaGoogle, FaEnvelope, FaLock, FaUser, FaArrowRight,
} from "react-icons/fa";

/* ── Reusable field ── */
function AuthField({
  label, icon, type = "text", name, placeholder,
  value, onChange, error, showToggle, onToggle, showPass,
}) {
  return (
    <div>
      <label className="auth-label">{label}</label>
      <div className={`auth-input-wrap${error ? " auth-input-error" : ""}`}>
        <span className="auth-input-icon">{icon}</span>
        <input
          type={showToggle ? (showPass ? "text" : "password") : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={type === "password" ? "current-password" : "on"}
        />
        {showToggle && (
          <button type="button" className="auth-eye-btn" onClick={onToggle} aria-label="Toggle password">
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      {error && <div className="auth-error-text">⚠ {error}</div>}
    </div>
  );
}

/* ── Validators ── */
function validateLogin({ email, password }) {
  const e = {};
  if (!email) e.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
  if (!password) e.password = "Password is required";
  else if (password.length < 6) e.password = "Minimum 6 characters";
  return e;
}

function validateRegister({ name, email, password, confirm }) {
  const e = {};
  if (!name) e.name = "Name is required";
  if (!email) e.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
  if (!password) e.password = "Password is required";
  else if (password.length < 6) e.password = "Minimum 6 characters";
  if (!confirm) e.confirm = "Please confirm password";
  else if (confirm !== password) e.confirm = "Passwords do not match";
  return e;
}

/* ── Main Component ── */
export default function LoginRegister() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
const { loading, error, user } = useSelector((state) => state.auth);

  const [mode, setMode]               = useState("login");
  const [slideClass, setSlide]        = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess]         = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm,   setRegForm]   = useState({ name: "", email: "", password: "", confirm: "" });
  const [loginErrs, setLoginErrs] = useState({});
  const [regErrs,   setRegErrs]   = useState({});

  /* Already logged in → redirect */
useEffect(() => {
  if (user) navigate("/map");
}, [user, navigate]);

  /* Clear redux error when switching mode */
  useEffect(() => {
    dispatch(clearError());
  }, [mode, dispatch]);

  const switchMode = (next) => {
    if (next === mode) return;
    setSlide(next === "register" ? "auth-form-slide-left" : "auth-form-slide-right");
    setTimeout(() => { setMode(next); setSlide(""); }, 10);
    setLoginErrs({}); setRegErrs({});
    setShowPass(false); setShowConfirm(false);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((p) => ({ ...p, [name]: value }));
    if (loginErrs[name]) setLoginErrs((p) => ({ ...p, [name]: "" }));
  };

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    setRegForm((p) => ({ ...p, [name]: value }));
    if (regErrs[name]) setRegErrs((p) => ({ ...p, [name]: "" }));
  };

const submitLogin = async (e) => {
  e.preventDefault();
  const errs = validateLogin(loginForm);
  if (Object.keys(errs).length) { setLoginErrs(errs); return; }
  const res = await dispatch(login(loginForm));
  if (res.meta.requestStatus === "fulfilled") {
    setSuccess(true);
    setTimeout(() => navigate("/map"), 100); // 1000 se 100 karo
  }
};

const submitRegister = async (e) => {
  e.preventDefault();
  const errs = validateRegister(regForm);
  if (Object.keys(errs).length) { setRegErrs(errs); return; }
  const res = await dispatch(register(regForm));
  if (res.meta.requestStatus === "fulfilled") {
    setSuccess(true);
    setTimeout(() => navigate("/map"), 100); // 1000 se 100 karo
  }
};

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    console.log("Google OAuth triggered");
  };

  const isLogin = mode === "login";

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb1" />
      <div className="auth-orb auth-orb2" />
      <div className="auth-orb auth-orb3" />

      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo-bar">
          <div className="auth-logo-icon"><FaMapMarkerAlt /></div>
          <Link to="/" className="auth-logo-name">ShopFinder</Link>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab${isLogin ? " auth-tab-active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab${!isLogin ? " auth-tab-active" : ""}`}
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        {/* Body */}
        <div className={`auth-body ${slideClass}`}>

          {/* Badge + heading */}
          <div>
            <div className="auth-live-badge">
              <span className="auth-live-dot" />
              {isLogin ? "Welcome back!" : "Join ShopFinder today"}
            </div>
            <div className="auth-heading">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </div>
            <div className="auth-subheading">
              {isLogin
                ? "Find open shops near you, instantly."
                : "Start discovering nearby shops in seconds."}
            </div>
          </div>

          <div className="auth-divider" />

          {/* Redux error banner */}
          {error && (
            <div className="auth-redux-error">
              ⚠ {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {isLogin && (
            <form
              onSubmit={submitLogin}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
              noValidate
            >
              <AuthField
                label="Email address" icon={<FaEnvelope />}
                type="email" name="email" placeholder="you@example.com"
                value={loginForm.email} onChange={handleLoginChange}
                error={loginErrs.email}
              />
              <div>
                <AuthField
                  label="Password" icon={<FaLock />}
                  name="password" placeholder="Enter your password"
                  value={loginForm.password} onChange={handleLoginChange}
                  error={loginErrs.password}
                  showToggle showPass={showPass}
                  onToggle={() => setShowPass((p) => !p)}
                />
                <div className="auth-forgot"><Link to="/forgot-password">Forgot password?</Link></div>
              </div>

              <button
                type="submit"
                className={`auth-submit-btn${success ? " auth-success-btn" : ""}`}
                disabled={loading}
              >
                {success ? "✅ Logged in!"
                  : loading ? <><div className="auth-spinner" /> Signing in…</>
                  : <>Sign in <FaArrowRight style={{ fontSize: 12 }} /></>}
              </button>

              <div className="auth-or">
                <div className="auth-or-line" /><span>OR</span><div className="auth-or-line" />
              </div>

              <button type="button" className="auth-google-btn" onClick={handleGoogle}>
                <FaGoogle className="auth-google-icon" /> Continue with Google
              </button>

              <div className="auth-switch">
                Don't have an account?{" "}
                <button type="button" onClick={() => switchMode("register")}>Register</button>
              </div>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {!isLogin && (
            <form
              onSubmit={submitRegister}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
              noValidate
            >
              <AuthField
                label="Full name" icon={<FaUser />}
                type="text" name="name" placeholder="Akash Sharma"
                value={regForm.name} onChange={handleRegChange}
                error={regErrs.name}
              />
              <AuthField
                label="Email address" icon={<FaEnvelope />}
                type="email" name="email" placeholder="you@example.com"
                value={regForm.email} onChange={handleRegChange}
                error={regErrs.email}
              />
              <AuthField
                label="Password" icon={<FaLock />}
                name="password" placeholder="Min. 6 characters"
                value={regForm.password} onChange={handleRegChange}
                error={regErrs.password}
                showToggle showPass={showPass}
                onToggle={() => setShowPass((p) => !p)}
              />
              <AuthField
                label="Confirm password" icon={<FaLock />}
                name="confirm" placeholder="Re-enter password"
                value={regForm.confirm} onChange={handleRegChange}
                error={regErrs.confirm}
                showToggle showPass={showConfirm}
                onToggle={() => setShowConfirm((p) => !p)}
              />

              <button
                type="submit"
                className={`auth-submit-btn${success ? " auth-success-btn" : ""}`}
                disabled={loading}
              >
                {success ? "✅ Account created!"
                  : loading ? <><div className="auth-spinner" /> Creating account…</>
                  : <>Create account <FaArrowRight style={{ fontSize: 12 }} /></>}
              </button>

              <div className="auth-or">
                <div className="auth-or-line" /><span>OR</span><div className="auth-or-line" />
              </div>

              <button type="button" className="auth-google-btn" onClick={handleGoogle}>
                <FaGoogle className="auth-google-icon" /> Continue with Google
              </button>

              <div className="auth-terms">
                By registering you agree to our{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </div>

              <div className="auth-switch">
                Already have an account?{" "}
                <button type="button" onClick={() => switchMode("login")}>Login</button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}