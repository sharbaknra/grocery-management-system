import { apiClient } from "./apiClient.js";

export const suppliersService = {
  list(params) {
    return apiClient.get("/suppliers", { query: params });
  },

  getById(id) {
    return apiClient.get(`/suppliers/${id}`);
  },

  create(payload) {
    return apiClient.post("/suppliers", payload);
  },

  update(id, payload) {
    return apiClient.put(`/suppliers/${id}`, payload);
  },

  remove(id) {
    return apiClient.delete(`/suppliers/${id}`);
  },

  getReorderDashboard(params) {
    return apiClient.get("/suppliers/reorder", { query: params });
  },

  getReorderSheet(id) {
    return apiClient.get(`/suppliers/${id}/reorder`);
  },
};

