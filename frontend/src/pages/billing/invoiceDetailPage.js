import { billingService } from "../../services/billingService.js";
import { ordersService } from "../../services/ordersService.js";

export function registerInvoiceDetailPage(register) {
  register("invoice-detail", invoiceDetailPage);
}

function invoiceDetailPage() {
  return {
    html: `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Actions Bar -->
        <div class="flex items-center justify-between">
          <button data-route="billing" class="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
            <span class="font-medium">Back to Billing</span>
          </button>
          <div class="flex gap-3">
            <button data-download-pdf class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors">
              <span class="material-symbols-outlined text-lg">download</span>
              Download PDF
            </button>
            <button data-print class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
              <span class="material-symbols-outlined text-lg">print</span>
              Print Invoice
            </button>
          </div>
        </div>
        
        <!-- Invoice Container -->
        <div data-invoice-container class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
          <div class="p-8 text-center">
            <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-text-secondary-light dark:text-text-secondary-dark">Loading invoice...</p>
          </div>
        </div>
      </div>
      
      <!-- Print Styles -->
      <style>
        @media print {
          body * {
            visibility: hidden;
          }
          [data-print-area], [data-print-area] * {
            visibility: visible;
          }
          [data-print-area] {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          [data-print-area] .dark\\:bg-surface-dark,
          [data-print-area] .dark\\:text-text-primary-dark,
          [data-print-area] .dark\\:text-text-secondary-dark {
            background: white !important;
            color: black !important;
          }
          button, nav, aside, header {
            display: none !important;
          }
        }
      </style>
    `,

    async onMount({ navigate }) {
      const container = document.querySelector("[data-invoice-container]");
      const orderId = sessionStorage.getItem("gms:activeInvoiceId");
      const shouldPrint = sessionStorage.getItem("gms:printOnLoad") === "true";
      
      // Clear print flag
      sessionStorage.removeItem("gms:printOnLoad");

      if (!orderId) {
        renderError("No invoice selected. Please go back and select an invoice.");
        return;
      }

      try {
        // Fetch order and items
        const [orderResponse, itemsResponse] = await Promise.all([
          billingService.getInvoiceById(orderId),
          billingService.getInvoiceItems(orderId),
        ]);

        const order = orderResponse.order || orderResponse;
        const items = itemsResponse.items || itemsResponse.data || itemsResponse || [];

        renderInvoice(order, items);

        // Auto print if requested
        if (shouldPrint) {
          setTimeout(() => window.print(), 500);
        }

      } catch (error) {
        console.error("Failed to load invoice:", error);
        renderError("Failed to load invoice. Please try again.");
      }

      function renderError(message) {
        if (!container) return;
        container.innerHTML = `
          <div class="p-8 text-center">
            <span class="material-symbols-outlined text-5xl text-danger mb-4 block">error</span>
            <p class="text-lg font-medium text-text-primary-light dark:text-text-primary-dark">${message}</p>
            <button data-route="billing" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
              Back to Billing
            </button>
          </div>
        `;
      }

      function renderInvoice(order, items) {
        if (!container) return;

        const invoiceNum = billingService.generateInvoiceNumber(order.order_id, order.created_at);
        const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.unit_price_at_sale) * item.quantity), 0);
        const tax = parseFloat(order.tax_applied) || 0;
        const discount = parseFloat(order.discount_applied) || 0;
        const total = parseFloat(order.total_price) || (subtotal + tax - discount);
        const statusClass = billingService.getStatusClass(order.status);

        container.innerHTML = `
          <div data-print-area class="p-8">
            <!-- Invoice Header -->
            <div class="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b border-border-light dark:border-border-dark">
              <div>
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex items-center justify-center w-12 h-12 bg-primary rounded-xl">
                    <span class="material-symbols-outlined text-white text-2xl">storefront</span>
                  </div>
                  <div>
                    <h1 class="text-2xl font-black text-text-primary-light dark:text-text-primary-dark">Grocery MS</h1>
                    <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Management System</p>
                  </div>
                </div>
                <div class="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                  <p>University of Mianwali</p>
                  <p>Mianwali, Punjab, Pakistan</p>
                  <p>Contact: +92 XXX XXXXXXX</p>
                </div>
              </div>
              
              <div class="text-right">
                <h2 class="text-3xl font-black text-text-primary-light dark:text-text-primary-dark mb-2">INVOICE</h2>
                <p class="text-xl font-bold text-primary mb-4">${invoiceNum}</p>
                <div class="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
                  <p><span class="font-medium">Date:</span> ${billingService.formatDate(order.created_at)}</p>
                  <p><span class="font-medium">Time:</span> ${new Date(order.created_at).toLocaleTimeString("en-PK")}</p>
                </div>
                <div class="mt-3">
                  <span class="inline-flex items-center gap-1.5 rounded-full ${statusClass} px-3 py-1.5 text-sm font-medium capitalize">
                    ${order.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Customer Info -->
            <div class="py-6 border-b border-border-light dark:border-border-dark">
              <h3 class="text-sm font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark mb-3">Bill To</h3>
              <div class="text-text-primary-light dark:text-text-primary-dark">
                <p class="text-lg font-bold">${order.user_name || "Walk-in Customer"}</p>
                ${order.user_email ? `<p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${order.user_email}</p>` : ""}
              </div>
            </div>
            
            <!-- Items Table -->
            <div class="py-6">
              <table class="w-full">
                <thead>
                  <tr class="border-b-2 border-border-light dark:border-border-dark">
                    <th class="py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">#</th>
                    <th class="py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Item</th>
                    <th class="py-3 text-center text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Qty</th>
                    <th class="py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Unit Price</th>
                    <th class="py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border-light dark:divide-border-dark">
                  ${items.map((item, index) => {
                    const itemTotal = parseFloat(item.unit_price_at_sale) * item.quantity;
                    return `
                      <tr>
                        <td class="py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">${index + 1}</td>
                        <td class="py-4">
                          <p class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${item.product_name}</p>
                          ${item.product_category ? `<p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">${item.product_category}</p>` : ""}
                        </td>
                        <td class="py-4 text-center text-sm text-text-primary-light dark:text-text-primary-dark">${item.quantity}</td>
                        <td class="py-4 text-right text-sm text-text-primary-light dark:text-text-primary-dark">${billingService.formatCurrency(item.unit_price_at_sale)}</td>
                        <td class="py-4 text-right text-sm font-medium text-text-primary-light dark:text-text-primary-dark">${billingService.formatCurrency(itemTotal)}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
            
            <!-- Totals -->
            <div class="flex justify-end py-6 border-t border-border-light dark:border-border-dark">
              <div class="w-72 space-y-3">
                <div class="flex justify-between text-sm">
                  <span class="text-text-secondary-light dark:text-text-secondary-dark">Subtotal</span>
                  <span class="text-text-primary-light dark:text-text-primary-dark font-medium">${billingService.formatCurrency(subtotal)}</span>
                </div>
                ${tax > 0 ? `
                  <div class="flex justify-between text-sm">
                    <span class="text-text-secondary-light dark:text-text-secondary-dark">Tax</span>
                    <span class="text-text-primary-light dark:text-text-primary-dark font-medium">${billingService.formatCurrency(tax)}</span>
                  </div>
                ` : ""}
                ${discount > 0 ? `
                  <div class="flex justify-between text-sm">
                    <span class="text-text-secondary-light dark:text-text-secondary-dark">Discount</span>
                    <span class="text-success font-medium">-${billingService.formatCurrency(discount)}</span>
                  </div>
                ` : ""}
                <div class="flex justify-between text-lg font-bold pt-3 border-t border-border-light dark:border-border-dark">
                  <span class="text-text-primary-light dark:text-text-primary-dark">Total</span>
                  <span class="text-primary">${billingService.formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="pt-8 border-t border-border-light dark:border-border-dark text-center">
              <p class="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-2">Thank you for your business!</p>
              <p class="text-text-secondary-light dark:text-text-secondary-dark text-xs">
                © 2025 Grocery Management System - Made by Saad Ali
              </p>
            </div>
          </div>
        `;
      }

      // Print button handler
      document.querySelector("[data-print]")?.addEventListener("click", () => {
        window.print();
      });

      // Download PDF (basic implementation using print dialog)
      document.querySelector("[data-download-pdf]")?.addEventListener("click", () => {
        // For a proper PDF, you'd use a library like jsPDF or html2pdf
        // This is a simple fallback that uses the browser's print-to-PDF
        alert("Use the Print dialog to save as PDF.\n\nTip: In the print dialog, select 'Save as PDF' as the destination.");
        window.print();
      });
    },
  };
}

