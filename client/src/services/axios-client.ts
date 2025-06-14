import axios from "axios";

const baseURL = import.meta.env.VITE_API_SERVER_URL;

const API = axios.create({
  baseURL,
  timeout: 10000,
});

const APIRefresh = axios.create({
  baseURL,
  timeout: 10000,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

APIRefresh.interceptors.request.use((config) => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (refreshToken) {
    config.headers["refresh_token"] = refreshToken;
  }
  return config;
});


API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (status === 401 && data === "Unauthorized" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await APIRefresh.get("/auth/refresh");
        const newAccessToken = res.data?.access_token;

        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default API;
