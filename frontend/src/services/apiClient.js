const DEFAULT_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = window.__GMS_API_BASE__ || DEFAULT_BASE_URL;

let authTokenProvider = () => null;

export function setAuthTokenProvider(provider) {
  authTokenProvider = provider;
}

export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .forEach(([key, value]) => searchParams.append(key, value));
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function request(path, { method = "GET", data, headers = {}, query } = {}) {
  const url = `${API_BASE_URL}${path}${buildQueryString(query)}`;
  const options = {
    method,
    headers: new Headers(headers),
  };

  const token = authTokenProvider?.();
  if (token) {
    options.headers.set("Authorization", `Bearer ${token}`);
  }

  if (data !== undefined) {
    if (data instanceof FormData) {
      options.body = data;
    } else {
      options.headers.set("Content-Type", "application/json");
      options.body = JSON.stringify(data);
    }
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw await normalizeError(response);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

async function normalizeError(response) {
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    // ignore
  }

  return {
    status: response.status,
    message: payload.message || response.statusText,
    details: payload.error || payload.errors || payload,
  };
}

export const apiClient = {
  get: (path, options) => request(path, { method: "GET", ...options }),
  post: (path, data, options) => request(path, { method: "POST", data, ...options }),
  put: (path, data, options) => request(path, { method: "PUT", data, ...options }),
  patch: (path, data, options) => request(path, { method: "PATCH", data, ...options }),
  delete: (path, options) => request(path, { method: "DELETE", ...options }),
  baseUrl: API_BASE_URL,
};

