import api from "./api";

// Register
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Login
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

// Logout
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

// Get Current Logged In User
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};


export const forgotPasswordService = async (data) => {
  const response = await api.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPasswordService = async (token, data) => {
  const response = await api.post(`/auth/reset-password/${token}`, data);
  return response.data;
};

export const verifyEmailService = async (token) => {
  const response = await api.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerificationService = async (data) => {
  const response = await api.post("/auth/resend-verification", data);
  return response.data;
};
