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
        margin: 50,
        size: 'A4',
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Title
      doc.fontSize(20).text(options.title || 'Report', { align: 'center' });
      doc.moveDown();

      // Date generated
      doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(2);

      // Table headers
      if (options.columns && options.columns.length > 0) {
        doc.fontSize(12).font('Helvetica-Bold');
        let xPosition = 50;
        const columnWidth = (doc.page.width - 100) / options.columns.length;

        options.columns.forEach((col, index) => {
          doc.text(col.header || col.key, xPosition, doc.y, {
            width: columnWidth,
            align: 'left',
          });
          xPosition += columnWidth;
        });

        doc.moveDown();
        doc.font('Helvetica');

        // Draw line under headers
        doc.moveTo(50, doc.y - 5)
           .lineTo(doc.page.width - 50, doc.y - 5)
           .stroke();
        doc.moveDown(0.5);

        // Data rows
        doc.fontSize(10);
        if (data && data.length > 0) {
          data.forEach((item, rowIndex) => {
            // Check if we need a new page
            if (doc.y > doc.page.height - 50) {
              doc.addPage();
              // Redraw headers on new page
              doc.fontSize(12).font('Helvetica-Bold');
              xPosition = 50;
              options.columns.forEach((col) => {
                doc.text(col.header || col.key, xPosition, doc.y, {
                  width: columnWidth,
                  align: 'left',
                });
                xPosition += columnWidth;
              });
              doc.moveDown();
              doc.font('Helvetica').fontSize(10);
              doc.moveTo(50, doc.y - 5)
                 .lineTo(doc.page.width - 50, doc.y - 5)
                 .stroke();
              doc.moveDown(0.5);
            }

            xPosition = 50;
            options.columns.forEach((col) => {
              const value = item[col.key] !== null && item[col.key] !== undefined 
                ? String(item[col.key]) 
                : '';
              doc.text(value, xPosition, doc.y, {
                width: columnWidth,
                align: 'left',
              });
              xPosition += columnWidth;
            });
            doc.moveDown();
          });
        } else {
          doc.text('No data available', { align: 'center' });
        }
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  convertToCSV,
  generatePDF,
};

