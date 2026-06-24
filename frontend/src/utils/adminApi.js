import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "admin_access"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    const originalRequest =
      error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refresh =
        localStorage.getItem(
          "admin_refresh"
        );

      try {

        const response =
          await axios.post(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
              refresh,
            }
          );

        const newAccess =
          response.data.access;

        localStorage.setItem(
          "admin_access",
          newAccess
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch (err) {

        localStorage.removeItem(
          "admin_access"
        );

        localStorage.removeItem(
          "admin_refresh"
        );

        window.location.href =
          "/admin-login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;