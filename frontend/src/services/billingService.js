import { apiClient } from "./apiClient.js";

export const billingService = {
  /**
   * Get all orders/invoices with optional filters
   */
  async getInvoices(params = {}) {
    return apiClient.get("/orders", { query: params });
  },

  /**
   * Get invoice details by order ID
   */
  async getInvoiceById(orderId) {
    return apiClient.get(`/orders/${orderId}`);
  },

  /**
   * Get invoice items (order items) by order ID
   */
  async getInvoiceItems(orderId) {
    return apiClient.get(`/orders/${orderId}/items`);
  },

  /**
   * Generate invoice number from order ID
   */
  generateInvoiceNumber(orderId, date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `INV-${year}${month}-${String(orderId).padStart(5, "0")}`;
  },

  /**
   * Format currency for display
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  },

  /**
   * Format date for invoice
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  /**
   * Format date and time
   */
  formatDateTime(date) {
    return new Date(date).toLocaleString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  /**
   * Get status badge class
   */
  getStatusClass(status) {
    const statusClasses = {
      completed: "bg-success/10 text-success",
      pending: "bg-warning/10 text-warning",
      cancelled: "bg-danger/10 text-danger",
      processing: "bg-blue-500/10 text-blue-500",
    };
    return statusClasses[status?.toLowerCase()] || "bg-neutral/10 text-neutral";
  },
};

