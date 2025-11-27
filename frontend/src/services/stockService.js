import { apiClient } from "./apiClient.js";

export const stockService = {
  getLowStock() {
    return apiClient.get("/stock/low-stock");
  },

  getMovements(params) {
    return apiClient.get("/stock/movements", { query: params });
  },

  restock(payload) {
    return apiClient.post("/stock/restock", payload);
  },

  reduce(payload) {
    return apiClient.post("/stock/reduce", payload);
  },
};

