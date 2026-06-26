import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  (config) => {

    const token =
      localStorage.getItem(
        "access_token"
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
          "refresh_token"
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
          "access_token",
          newAccess
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);

      } catch (err) {

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );
        localStorage.removeItem("user");

        window.location.href =
          "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;