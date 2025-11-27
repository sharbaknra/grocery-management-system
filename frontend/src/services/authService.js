import { apiClient } from "./apiClient.js";
import { appActions } from "../state/appState.js";

export const authService = {
  async login(credentials) {
    const response = await apiClient.post("/users/login", credentials);
    appActions.setSession({ user: response.user, token: response.token });
    return response;
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

