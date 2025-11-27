import { apiClient } from "./apiClient.js";

export const ordersService = {
  list(params) {
    return apiClient.get("/orders", { query: params });
  },

  listMine(params) {
    return apiClient.get("/orders/me", { query: params });
  },

  getById(orderId) {
    return apiClient.get(`/orders/${orderId}`);
  },

  checkout(payload) {
    return apiClient.post("/orders/checkout", payload);
  },
};

