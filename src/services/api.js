import axios from "axios";

console.log("🟢 API FILE LOADED");

const api = axios.create({
  baseURL: "https://knowyourarea-backend-1.onrender.com/api",
  withCredentials: true, // cookies automatically send hongi
});

console.log("API BaseURL:", api.defaults.baseURL);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log("📡 REQUEST URL:", config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;