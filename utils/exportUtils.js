// Export Utilities for Module 2.10.4
// CSV and PDF export functions for reports

const { stringify } = require('csv-stringify/sync');
const PDFDocument = require('pdfkit');

/**
 * Convert JSON array to CSV format (RFC 4180 compliant)
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Array of column definitions [{key: 'field', header: 'Header Name'}]
 * @returns {string} CSV string
 */
function convertToCSV(data, columns) {
  if (!data || data.length === 0) {
    // Return headers only if no data
    const headers = columns.map(col => col.header || col.key);
    return stringify([headers], {
      header: false,
      quoted: true,
      quoted_empty: true,
    });
  }

  // Prepare data rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      // Handle null/undefined
      if (value === null || value === undefined) {
        return '';
      }
      // Convert to string and handle special characters
      return String(value);
    });
  });

  // Add headers
  const headers = columns.map(col => col.header || col.key);
  const csvData = [headers, ...rows];

  // Generate CSV with RFC 4180 compliance
  return stringify(csvData, {
    header: false,
    quoted: true,
    quoted_empty: true,
    escape: '"',
  });
}

/**
 * Generate PDF document from data
 * @param {Array} data - Array of objects to include in PDF
 * @param {Object} options - PDF options {title, columns, filename}
 * @returns {Buffer} PDF buffer
 */
function generatePDF(data, options) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        margin: 40,
        size: 'A4',
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Soft page background card
      doc
        .save()
        .rect(24, 24, pageWidth - 48, pageHeight - 48)
        .fill("#F9FAFB")
        .restore();

      // Brand header bar
      const brandHeight = 48;
      doc
        .save()
        .rect(24, 24, pageWidth - 48, brandHeight)
        .fill("#111827");

      doc
        .fillColor("#F9FAFB")
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Grocery MS", 40, 38, { align: "left" });

      doc
        .font("Helvetica")
        .fontSize(9)
        .text(new Date().toLocaleString(), -40, 38, { align: "right" });

      doc.restore();

      doc.moveDown(3);

      // Report title
      doc
        .font("Helvetica-Bold")
        .fontSize(18)
        .fillColor("#111827")
        .text(options.title || "Report", { align: "center" });

      // Subtitle / gap
      doc.moveDown(1);

      // Table headers
      if (options.columns && options.columns.length > 0) {
        const leftMargin = 40;
        const rightMargin = 40;
        const columnWidth =
          (pageWidth - leftMargin - rightMargin) / options.columns.length;

        function drawTableHeader() {
          doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("#111827");

          // Header background
          const headerY = doc.y + 6;
          doc
            .save()
            .rect(
              leftMargin,
              headerY - 10,
              pageWidth - leftMargin - rightMargin,
              24
            )
            .fill("#E5F3FF")
            .restore();

          let xPosition = leftMargin;
          options.columns.forEach((col) => {
            doc.text(col.header || col.key, xPosition + 6, headerY - 4, {
              width: columnWidth - 12,
              align: "left",
            });
            xPosition += columnWidth;
          });

          doc.moveDown(2.2);
        }

        function drawRows() {
          doc.font("Helvetica").fontSize(10).fillColor("#111827");

          if (!data || !data.length) {
            doc.moveDown(2);
            doc
              .font("Helvetica-Oblique")
              .fillColor("#6B7280")
              .text("No data available for this report.", { align: "center" });
            return;
          }

          data.forEach((item, rowIndex) => {
            // New page if near bottom
            if (doc.y > doc.page.height - 60) {
              doc.addPage();
              drawTableHeader();
            }

            const rowTop = doc.y + 2;
            const rowHeight = 18;

            // Zebra striping
            if (rowIndex % 2 === 0) {
              doc
                .save()
                .rect(
                  leftMargin,
                  rowTop - 4,
                  pageWidth - leftMargin - rightMargin,
                  rowHeight
                )
                .fill("#F9FAFB")
                .restore();
            }

            let xPosition = leftMargin;
            options.columns.forEach((col) => {
              const raw = item[col.key];
              const value = formatCellValue(raw, col.key);
              doc.fillColor("#111827").text(value, xPosition + 6, rowTop, {
                width: columnWidth - 12,
                align: "left",
              });
              xPosition += columnWidth;
            });

            doc.moveDown(1.4);
          });
        }

        drawTableHeader();
        drawRows();
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

function formatCellValue(value, key) {
  if (value === null || value === undefined) return "";

  // Date-like fields
  if (
    /date/i.test(key) ||
    key === "created_at" ||
    key === "updated_at"
  ) {
    const d = new Date(value);
    if (!isNaN(d)) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }

  return String(value);
}

module.exports = {
  convertToCSV,
  generatePDF,
};

