import { apiClient } from "./apiClient.js";
import { appActions } from "../state/appState.js";

export const cartService = {
  async getCart() {
    return fetchAndStoreCart();
  },

  async addItem(productId, quantity = 1) {
    await apiClient.post("/orders/cart/add", { productId, quantity });
    return fetchAndStoreCart();
  },

  async updateItem(payload) {
    await apiClient.put("/orders/cart/update", payload);
    return fetchAndStoreCart();
  },

  async removeItem(productId) {
    await apiClient.delete(`/orders/cart/remove/${productId}`);
    return fetchAndStoreCart();
  },

  async clearCart() {
    await apiClient.delete("/orders/cart/clear");
    appActions.setCart({ items: [], subtotal: 0 });
  },
};

function normalizeCart(data = {}) {
  const items = data.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.current_price || 0);
    return sum + price * Number(item.quantity || 0);
  }, 0);

  return {
    items,
    subtotal,
  };
}

async function fetchAndStoreCart() {
  const response = await apiClient.get("/orders/cart");
  const payload = normalizeCart(response?.data ?? response);
  appActions.setCart(payload);
  return payload;
}

