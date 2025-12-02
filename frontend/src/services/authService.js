import { apiClient } from "./apiClient.js";
import { appActions } from "../state/appState.js";

// Decode JWT payload (without verification - just for reading user info)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const authService = {
  async login(credentials) {
    const response = await apiClient.post("/users/login", credentials);
    
    // Decode user info from JWT token
    const tokenPayload = decodeJWT(response.token);
    const user = response.user || {
      id: tokenPayload?.id,
      email: tokenPayload?.email,
      role: tokenPayload?.role || "staff",
      name: tokenPayload?.name || tokenPayload?.email?.split("@")[0] || "User",
    };
    
    appActions.setSession({ user, token: response.token });
    return { ...response, user };
  },

  async register(payload) {
    return apiClient.post("/users/register", payload);
  },

  async logout() {
    try {
      await apiClient.post("/users/logout");
    } catch (error) {
      console.warn("Logout endpoint unavailable:", error);
    } finally {
      appActions.clearSession();
    }
  },
};

