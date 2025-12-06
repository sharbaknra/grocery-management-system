/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,html}"
  ],
  theme: {
    extend: {
      colors: {
        // Pakistan Theme Colors
        "primary": "#2D5016",        // Deep Forest Green
        "primary-hover": "#1e3a0f",
        "secondary": "#8FBC8F",      // Warm Sage
        "accent": "#FFB347",         // Golden Amber
        "success": "#2D5016",
        "danger": "#DC3545",
        "warning": "#FFB347",
        // Light Mode
        "background-light": "#F5F5DC",  // Soft Cream
        "surface-light": "#FFFFFF",
        "text-primary-light": "#333333", // Charcoal
        "text-secondary-light": "#666666",
        "border-light": "#d4d4b8",
        // Dark Mode
        "background-dark": "#1a1a0f",
        "surface-dark": "#2a2a1f",
        "text-primary-dark": "#F5F5DC",
        "text-secondary-dark": "#a8a898",
        "border-dark": "#3d3d2d",
      },
      fontFamily: {
        "display": ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

