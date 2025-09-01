import Axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

export const api = Axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // Ensure we have an AxiosHeaders instance
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  if (
    config.method &&
    ["post", "put", "patch", "delete"].includes(config.method)
  ) {
    headers.set(
      "X-Idempotency-Key",
      globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
    );
  }

  // Write back the headers instance (to satisfy types)
  config.headers = headers;
  return config;
});
