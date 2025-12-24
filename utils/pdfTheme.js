// PDF Theme Configuration and Utilities
// Module 2.10.4 - PDF Export Theme Support

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Default theme configuration
 */
const DEFAULT_THEME = {
  primaryColor: '#2E7D32',      // Grocery green
  secondaryColor: '#66BB6A',    // Light green
  companyName: 'Grocery Management System',
  logoPath: null,
  fontFamily: 'Helvetica',
  tagline: null,
  contactInfo: null,
};

/**
 * Load theme from environment variables
 */
function loadThemeFromEnv() {
  return {
    primaryColor: process.env.PDF_THEME_PRIMARY_COLOR || DEFAULT_THEME.primaryColor,
    secondaryColor: process.env.PDF_THEME_SECONDARY_COLOR || DEFAULT_THEME.secondaryColor,
    companyName: process.env.PDF_THEME_COMPANY_NAME || DEFAULT_THEME.companyName,
    logoPath: process.env.PDF_THEME_LOGO_PATH || DEFAULT_THEME.logoPath,
    fontFamily: process.env.PDF_THEME_FONT_FAMILY || DEFAULT_THEME.fontFamily,
    tagline: process.env.PDF_THEME_TAGLINE || DEFAULT_THEME.tagline,
    contactInfo: process.env.PDF_THEME_CONTACT_INFO || DEFAULT_THEME.contactInfo,
  };
}

/**
 * Merge custom theme with defaults
 */
function mergeTheme(customTheme = {}) {
  const envTheme = loadThemeFromEnv();
  return {
    ...DEFAULT_THEME,
    ...envTheme,
    ...customTheme,
  };
}

/**
 * Convert hex color to RGB array for PDFKit
 * @param {string} hex - Hex color code (e.g., '#2E7D32' or '2E7D32')
 * @returns {Array} [r, g, b] array with values 0-1
 */
function hexToRgb(hex) {
  if (!hex) return [0, 0, 0];
  
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  return [r, g, b];
}

/**
 * Lighten a color by a percentage
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to lighten (0-100)
 * @returns {string} Lightened hex color
 */
function lightenColor(hex, percent) {
  if (!hex) return '#FFFFFF';
  
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * (percent / 100)));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * (percent / 100)));
  const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * (percent / 100)));
  
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1).toUpperCase();
}

/**
 * Darken a color by a percentage
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to darken (0-100)
 * @returns {string} Darkened hex color
 */
function darkenColor(hex, percent) {
  if (!hex) return '#000000';
  
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const num = parseInt(hex, 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent / 100)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent / 100)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent / 100)));
  
  return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1).toUpperCase();
}

/**
 * Check if a color is dark (for determining text color)
 * @param {string} hex - Hex color code
 * @returns {boolean} True if color is dark
 */
function isDarkColor(hex) {
  if (!hex) return true;
  
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

/**
 * Load logo from file path
 * @param {string} filePath - Path to logo file
 * @returns {Promise<Buffer|null>} Logo buffer or null
 */
async function loadLogoFromFile(filePath) {
  try {
    if (!filePath) return null;
    
    const fullPath = path.isAbsolute(filePath) 
      ? filePath 
      : path.join(process.cwd(), filePath);
    
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath);
    }
    
    return null;
  } catch (error) {
    console.warn('Error loading logo from file:', error.message);
    return null;
  }
}

/**
 * Load logo from URL
 * @param {string} url - URL to logo image
 * @returns {Promise<Buffer|null>} Logo buffer or null
 */
async function loadLogoFromUrl(url) {
  return new Promise((resolve) => {
    try {
      if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        resolve(null);
        return;
      }
      
      const protocol = url.startsWith('https://') ? https : http;
      
      protocol.get(url, (response) => {
        if (response.statusCode !== 200) {
          resolve(null);
          return;
        }
        
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      }).on('error', () => {
        resolve(null);
      });
    } catch (error) {
      console.warn('Error loading logo from URL:', error.message);
      resolve(null);
    }
  });
}

/**
 * Load logo from base64 string
 * @param {string} base64String - Base64 encoded image
 * @returns {Buffer|null} Logo buffer or null
 */
function loadLogoFromBase64(base64String) {
  try {
    if (!base64String) return null;
    
    // Remove data URL prefix if present
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  } catch (error) {
    console.warn('Error loading logo from base64:', error.message);
    return null;
  }
}

/**
 * Load logo from various sources (file, URL, or base64)
 * @param {string} logoSource - File path, URL, or base64 string
 * @returns {Promise<Buffer|null>} Logo buffer or null
 */
async function loadLogo(logoSource) {
  if (!logoSource) return null;
  
  // Check if it's a base64 string
  if (logoSource.startsWith('data:image/') || /^[A-Za-z0-9+/=]+$/.test(logoSource)) {
    return loadLogoFromBase64(logoSource);
  }
  
  // Check if it's a URL
  if (logoSource.startsWith('http://') || logoSource.startsWith('https://')) {
    return await loadLogoFromUrl(logoSource);
  }
  
  // Assume it's a file path
  return await loadLogoFromFile(logoSource);
}

module.exports = {
  DEFAULT_THEME,
  loadThemeFromEnv,
  mergeTheme,
  hexToRgb,
  lightenColor,
  darkenColor,
  isDarkColor,
  loadLogo,
  loadLogoFromFile,
  loadLogoFromUrl,
  loadLogoFromBase64,
};
