import { apiClient } from "./apiClient.js";

function toFormData(payload = {}) {
  if (payload instanceof FormData) return payload;
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  return formData;
}

export const productsService = {
  list(params) {
    return apiClient.get("/products", { query: params });
  },

  getById(id) {
    return apiClient.get(`/products/${id}`);
  },

  search(name) {
    return apiClient.get("/products/search", { query: { name } });
  },

  create(payload) {
    return apiClient.post("/products/add", toFormData(payload));
  },

  update(id, payload) {
    return apiClient.put(`/products/update/${id}`, toFormData(payload));
  },

  remove(id) {
    return apiClient.delete(`/products/delete/${id}`);
  },
};

