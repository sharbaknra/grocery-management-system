import { productsService } from "../../services/productsService.js";
import { suppliersService } from "../../services/suppliersService.js";

export function registerProductFormPage(register) {
  register("product-form", productFormPage);
}

function productFormPage() {
  return {
    html: `
      <div class="max-w-4xl mx-auto">
        <!-- Page Header -->
        <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 data-page-heading class="text-3xl font-black tracking-tight text-text-primary-light dark:text-text-primary-dark">Add New Product</h1>
            <p class="text-text-secondary-light dark:text-text-secondary-dark mt-1">Fill in the details below to add a new product.</p>
          </div>
          <button data-route="products" class="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to Products
          </button>
        </div>
        
        <!-- Form -->
        <form data-product-form class="space-y-8">
          <!-- Basic Information -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h2 class="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark pb-4 border-b border-border-light dark:border-border-dark mb-6">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="name">
                  Product Name <span class="text-danger">*</span>
                </label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="e.g., Organic Apples"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="category">Category</label>
                <select 
                  id="category"
                  name="category"
                  class="form-select h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                >
                  <option value="">Select a category</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="dairy">Dairy</option>
                  <option value="bakery">Bakery</option>
                  <option value="meat">Meat</option>
                  <option value="beverages">Beverages</option>
                  <option value="spices">Spices</option>
                  <option value="pulses">Pulses & Grains</option>
                  <option value="rice">Rice & Flour</option>
                  <option value="snacks">Snacks</option>
                  <option value="frozen">Frozen Foods</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="price">
                  Price (PKR) <span class="text-danger">*</span>
                </label>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">Rs.</span>
                  <input 
                    type="number"
                    id="price"
                    name="price"
                    required
                    step="1"
                    min="0"
                    class="form-input h-12 w-full rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 pl-12 pr-4"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="barcode">Barcode (SKU)</label>
                <input 
                  type="text"
                  id="barcode"
                  name="barcode"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="Enter barcode number"
                />
              </div>
            </div>
          </div>
          
          <!-- Description & Info -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h2 class="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark pb-4 border-b border-border-light dark:border-border-dark mb-6">Description & Info</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col md:col-span-2">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="description">Description</label>
                <textarea 
                  id="description"
                  name="description"
                  rows="4"
                  class="form-textarea rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 p-4 resize-y"
                  placeholder="Add a short description for the product..."
                ></textarea>
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="expiry_date">Expiry Date</label>
                <input 
                  type="date"
                  id="expiry_date"
                  name="expiry_date"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                />
              </div>
            </div>
          </div>
          
          <!-- Supplier & Stock -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h2 class="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark pb-4 border-b border-border-light dark:border-border-dark mb-6">Supplier & Stock</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="supplier_id">Supplier</label>
                <select 
                  id="supplier_id"
                  name="supplier_id"
                  class="form-select h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                >
                  <option value="">Select a supplier</option>
                </select>
              </div>
              
              <div></div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="stock_quantity">
                  Initial Quantity <span class="text-danger">*</span>
                </label>
                <input 
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  required
                  min="0"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                  placeholder="0"
                />
              </div>
              
              <div class="flex flex-col">
                <label class="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2" for="min_stock_level">Minimum Stock Level</label>
                <input 
                  type="number"
                  id="min_stock_level"
                  name="min_stock_level"
                  min="0"
                  value="10"
                  class="form-input h-12 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark focus:border-primary focus:ring-2 focus:ring-primary/20 px-4"
                />
              </div>
            </div>
          </div>
          
          <!-- Image Upload -->
          <div class="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark p-6">
            <h2 class="text-xl font-bold tracking-tight text-text-primary-light dark:text-text-primary-dark pb-4 border-b border-border-light dark:border-border-dark mb-6">Image Upload</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-light dark:border-border-dark p-8 text-center hover:border-primary transition-colors cursor-pointer" data-upload-zone>
                <span class="material-symbols-outlined text-5xl text-text-secondary-light dark:text-text-secondary-dark mb-2">cloud_upload</span>
                <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <span class="font-semibold text-primary">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">PNG, JPG, GIF up to 10MB</p>
                <input type="file" name="image" accept="image/*" class="hidden" data-file-input />
              </div>
              
              <div class="flex items-center justify-center bg-background-light dark:bg-background-dark rounded-lg p-4 min-h-[200px]">
                <div data-image-preview class="w-full h-full bg-center bg-cover bg-no-repeat rounded-lg hidden"></div>
                <div data-no-image class="text-center">
                  <span class="material-symbols-outlined text-4xl text-text-secondary-light dark:text-text-secondary-dark">image</span>
                  <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-2">No image selected</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Status Message -->
          <div data-form-status class="hidden items-center gap-3 rounded-lg p-4 text-sm">
            <span class="material-symbols-outlined text-lg">info</span>
            <p class="font-medium"></p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex justify-end gap-4">
            <button 
              type="button"
              data-route="products"
              class="px-6 py-3 rounded-lg bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-medium hover:bg-border-light dark:hover:bg-border-dark transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              data-submit-btn
              class="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    `,

    async onMount({ navigate }) {
      const form = document.querySelector("[data-product-form]");
      const submitBtn = document.querySelector("[data-submit-btn]");
      const statusEl = document.querySelector("[data-form-status]");
      const headingEl = document.querySelector("[data-page-heading]");
      const uploadZone = document.querySelector("[data-upload-zone]");
      const fileInput = document.querySelector("[data-file-input]");
      const imagePreview = document.querySelector("[data-image-preview]");
      const noImageEl = document.querySelector("[data-no-image]");

      const productId = sessionStorage.getItem("gms:activeProductId");
      const isEditMode = Boolean(productId);

      // Update heading for edit mode
      if (isEditMode && headingEl) {
        headingEl.textContent = "Edit Product";
      }

      // Load suppliers
      try {
        const suppliers = await suppliersService.list();
        const supplierSelect = document.getElementById("supplier_id");
        if (supplierSelect && suppliers.length) {
          suppliers.forEach((supplier) => {
            const option = document.createElement("option");
            option.value = supplier.id;
            option.textContent = supplier.name;
            supplierSelect.appendChild(option);
          });
        }
      } catch (error) {
        console.error("Failed to load suppliers:", error);
      }

      // Load product for edit mode
      if (isEditMode) {
        try {
          const product = await productsService.getById(productId);
          populateForm(product);
        } catch (error) {
          console.error("Failed to load product:", error);
          showStatus("Failed to load product data", "error");
        }
      }

      // Image upload handling
      uploadZone?.addEventListener("click", () => fileInput?.click());
      
      uploadZone?.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadZone.classList.add("border-primary", "bg-primary/5");
      });
      
      uploadZone?.addEventListener("dragleave", () => {
        uploadZone.classList.remove("border-primary", "bg-primary/5");
      });
      
      uploadZone?.addEventListener("drop", (e) => {
        e.preventDefault();
        uploadZone.classList.remove("border-primary", "bg-primary/5");
        const files = e.dataTransfer.files;
        if (files.length && fileInput) {
          fileInput.files = files;
          handleFileSelect(files[0]);
        }
      });

      fileInput?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file);
      });

      function handleFileSelect(file) {
        if (!file.type.startsWith("image/")) {
          showStatus("Please select an image file", "error");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          if (imagePreview) {
            imagePreview.style.backgroundImage = `url('${e.target.result}')`;
            imagePreview.classList.remove("hidden");
          }
          noImageEl?.classList.add("hidden");
        };
        reader.readAsDataURL(file);
      }

      function populateForm(product) {
        const fields = ["name", "category", "price", "barcode", "description", "expiry_date", "supplier_id", "stock_quantity", "min_stock_level"];
        fields.forEach((field) => {
          const input = document.getElementById(field);
          if (input && product[field] !== undefined && product[field] !== null) {
            input.value = product[field];
          }
        });

        // Show existing image
        if (product.image_url || product.image) {
          const url = product.image_url || product.image;
          if (imagePreview) {
            imagePreview.style.backgroundImage = `url('${url}')`;
            imagePreview.classList.remove("hidden");
          }
          noImageEl?.classList.add("hidden");
        }
      }

      function showStatus(message, type = "info") {
        if (!statusEl) return;
        statusEl.classList.remove("hidden", "bg-red-50", "text-red-600", "bg-green-50", "text-green-600", "bg-blue-50", "text-blue-600", "dark:bg-red-900/20", "dark:text-red-400", "dark:bg-green-900/20", "dark:text-green-400", "dark:bg-blue-900/20", "dark:text-blue-400");
        statusEl.classList.add("flex");
        
        const icon = statusEl.querySelector(".material-symbols-outlined");
        const text = statusEl.querySelector("p");
        
        if (type === "error") {
          statusEl.classList.add("bg-red-50", "text-red-600", "dark:bg-red-900/20", "dark:text-red-400");
          if (icon) icon.textContent = "error";
        } else if (type === "success") {
          statusEl.classList.add("bg-green-50", "text-green-600", "dark:bg-green-900/20", "dark:text-green-400");
          if (icon) icon.textContent = "check_circle";
        } else {
          statusEl.classList.add("bg-blue-50", "text-blue-600", "dark:bg-blue-900/20", "dark:text-blue-400");
          if (icon) icon.textContent = "info";
        }
        
        if (text) text.textContent = message;
      }

      function toggleLoading(loading) {
        if (!submitBtn) return;
        submitBtn.disabled = loading;
        submitBtn.innerHTML = loading
          ? '<span class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>'
          : "Save Product";
      }

      // Form submission
      form?.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        
        // Convert numeric fields
        const price = formData.get("price");
        if (price) formData.set("price", parseFloat(price));
        
        const stockQty = formData.get("stock_quantity");
        if (stockQty) formData.set("stock_quantity", parseInt(stockQty));
        
        const minStock = formData.get("min_stock_level");
        if (minStock) formData.set("min_stock_level", parseInt(minStock));

        const supplierId = formData.get("supplier_id");
        if (supplierId) formData.set("supplier_id", parseInt(supplierId));

        try {
          toggleLoading(true);
          showStatus(isEditMode ? "Updating product..." : "Creating product...", "info");

          if (isEditMode) {
            await productsService.update(productId, formData);
            showStatus("Product updated successfully!", "success");
          } else {
            await productsService.create(formData);
            showStatus("Product created successfully!", "success");
          }

          sessionStorage.removeItem("gms:activeProductId");
          setTimeout(() => navigate("products"), 1500);
        } catch (error) {
          console.error("Failed to save product:", error);
          showStatus(error.message || "Failed to save product. Please try again.", "error");
        } finally {
          toggleLoading(false);
        }
      });

      return () => {
        sessionStorage.removeItem("gms:activeProductId");
      };
    },
  };
}
