import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("admin_refresh");

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/token/refresh/`,
          {
            refresh,
          }
        );

        const newAccess = response.data.access;

        localStorage.setItem("admin_access", newAccess);

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch (err) {
        localStorage.removeItem("admin_access");
        localStorage.removeItem("admin_refresh");

        window.location.href = "/admin-login";

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;