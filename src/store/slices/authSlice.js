import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  forgotPasswordService,   // add karo authServices.js mein
  resetPasswordService,    // add karo authServices.js mein
  verifyEmailService,      // add karo authServices.js mein
  resendVerificationService, // add karo authServices.js mein
} from "../../services/authServices";

/* =========================
   Async Thunks
========================= */

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerUser(data);
      return res; // { message: "...check your email..." } — NO user object
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUser(data);
      return res; // { user: {...} }
    } catch (err) {
      // notVerified flag backend se aata hai
      return rejectWithValue({
        message: err.response?.data?.message || "Login failed",
        notVerified: err.response?.data?.notVerified || false,
      });
    }
  }
);

// Fetch current user (refresh ke baad)
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCurrentUser();
      return res.user;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Logout failed"
      );
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const res = await forgotPasswordService(data);
      return res; // { message: "If that email exists..." }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset email"
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirm }, { rejectWithValue }) => {
    try {
      const res = await resetPasswordService(token, { password, confirm });
      return res; // { message: "Password reset successful!" }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Reset failed"
      );
    }
  }
);

// Verify Email
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const res = await verifyEmailService(token);
      return res; // { message: "Email verified!" }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Verification failed"
      );
    }
  }
);

// Resend Verification Email
export const resendVerification = createAsyncThunk(
  "auth/resendVerification",
  async (data, { rejectWithValue }) => {
    try {
      const res = await resendVerificationService(data);
      return res; // { message: "Verification email sent!" }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to resend email"
      );
    }
  }
);

/* =========================
   Initial State
========================= */

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
  successMsg: null,    // ← NEW: register/forgot/reset success messages
  notVerified: false,  // ← NEW: login blocked because email not verified
  initialized: false,
};

/* =========================
   Slice
========================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    // ↓ NEW
    clearSuccess(state) {
      state.successMsg = null;
    },
    clearNotVerified(state) {
      state.notVerified = false;
    },
  },
  extraReducers: (builder) => {
    builder

      /* ── Register ──────────────────────────────────── */
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ FIX: user set NAHI karo — email verify hone tak login nahi
        state.successMsg = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ── Login ─────────────────────────────────────── */
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.notVerified = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        // ✅ FIX: notVerified flag alag se track karo
        state.error = action.payload.message;
        state.notVerified = action.payload.notVerified || false;
      })

      /* ── Fetch Current User ─────────────────────────── */
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        localStorage.removeItem("user");
      })

      /* ── Logout ─────────────────────────────────────── */
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.successMsg = null;
        state.notVerified = false;
        localStorage.removeItem("user");
      })

      /* ── Forgot Password ────────────────────────────── */
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ── Reset Password ─────────────────────────────── */
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ── Verify Email ───────────────────────────────── */
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMsg = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ── Resend Verification ────────────────────────── */
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.successMsg = action.payload.message;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearNotVerified } = authSlice.actions;
export default authSlice.reducer;