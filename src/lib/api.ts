import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
  timeout: 20000,
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error("[API Request Failed]", {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        baseURL: error.config?.baseURL,
        status: error.response?.status ?? null,
        response: error.response?.data ?? null,
        code: error.code ?? null,
        message: error.message,
      });

      const data = error.response?.data as { message?: string } | undefined;

      const message =
        data?.message ??
        (error.code === "ECONNABORTED"
          ? "The API request timed out."
          : error.response
            ? error.message
            : "Network error: no readable response received from the API.");

      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  },
);

export default api;
