import { apiClient } from "./apiClient.js";

export const usersService = {
  list() {
    return apiClient.get("/users");
  },

  getById(id) {
    return apiClient.get(`/users/${id}`);
  },

  createStaff(data) {
    return apiClient.post("/users/staff", data);
  },

  update(id, data) {
    return apiClient.put(`/users/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/users/${id}`);
  },
};

