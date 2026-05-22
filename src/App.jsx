import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { fetchCurrentUser } from "./store/slices/authSlice";

import MapView        from "./components/core/MapView";
import CreateShop     from "./pages/CreateShop";
import LandingPage    from "./pages/LandingPage";
import LoginRegister  from "./components/core/LoginRegister";
import Navbar         from "./components/core/Navbar";
import Footer         from "./components/core/Footer";
import AddCategory    from "./pages/AddCategory";
import ProtectedRoute from "./pages/ProtectedRoute";
import OwnerDashboard from "./components/core/OwnerDashboard";

// ── NEW ──────────────────────────────────────────────────
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword  from "./pages/Auth/ResetPassword";
import VerifyEmail    from "./pages/Auth/VerifyEmail";

// Pages jahan Navbar/Footer NAHI chahiye
const NO_LAYOUT_ROUTES = [
  "/login",
  "/forgot-password",  // ← NEW
  "/reset-password",   // ← NEW
  "/verify-email",     // ← NEW
];

function Layout({ children }) {
  const { pathname } = useLocation();
  const showLayout = !NO_LAYOUT_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  return (
    <>
      {showLayout && <Navbar />}
      {children}
      {showLayout && <Footer />}
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <Layout>
      <Routes>
        {/* ── Public ──────────────────────────────────── */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginRegister />} />

        {/* ── NEW: Auth flow routes ────────────────────── */}
        <Route path="/forgot-password"       element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token"   element={<VerifyEmail />} />

        {/* ── Protected (unchanged) ───────────────────── */}
        <Route path="/map" element={
          <ProtectedRoute><MapView /></ProtectedRoute>
        } />
        <Route path="/create-shop" element={
          <ProtectedRoute><CreateShop /></ProtectedRoute>
        } />
        <Route path="/admin/add-category" element={
          <ProtectedRoute><AddCategory /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute><OwnerDashboard /></ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default App;