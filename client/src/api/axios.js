import axios from "axios";

const BACKEND_URL = "https://nexamind-ai-a29k.onrender.com";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexamind_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    if (error.code === "ECONNABORTED" || !error.response) {
      error.message = "Backend is waking up (Render free tier). Please wait 30 seconds and try again.";
    }
    return Promise.reject(error);
  }
);

const retryRequest = async (fn, retries = 3, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
};

export { retryRequest };
export default api;
