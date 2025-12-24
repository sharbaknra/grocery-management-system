// Export Utilities for Module 2.10.4
// CSV and PDF export functions for reports

const { stringify } = require('csv-stringify/sync');
const PDFDocument = require('pdfkit');
const {
  mergeTheme,
  hexToRgb,
  lightenColor,
  isDarkColor,
  loadLogo,
} = require('./pdfTheme');

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
 * Generate PDF document from data with theme support
 * @param {Array} data - Array of objects to include in PDF
 * @param {Object} options - PDF options {title, columns, filename, theme}
 * @returns {Buffer} PDF buffer
 */
async function generatePDF(data, options) {
  return new Promise(async (resolve, reject) => {
    try {
      // Merge theme configuration
      const theme = mergeTheme(options.theme || {});
      const primaryRgb = hexToRgb(theme.primaryColor);
      const secondaryRgb = hexToRgb(theme.secondaryColor);
      const primaryLight = lightenColor(theme.primaryColor, 85);
      const primaryLightRgb = hexToRgb(primaryLight);
      const headerTextColor = isDarkColor(theme.primaryColor) ? '#FFFFFF' : '#000000';

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

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const leftMargin = 50;
      const rightMargin = 50;
      const headerHeight = 100;
      const footerHeight = 40;

      // Track page numbers
      let pageNumber = 1;

      // Load logo if provided
      let logoBuffer = null;
      if (theme.logoPath) {
        logoBuffer = await loadLogo(theme.logoPath);
      }

      /**
       * Draw invoice-style header on each page
       */
      function drawHeader() {
        const headerY = 50;
        const leftSectionWidth = 250;
        const rightSectionWidth = 250;
        const centerGap = 50;
        
        // Logo and company info (left side)
        let currentY = headerY;
        let textStartX = leftMargin;
        
        if (logoBuffer) {
          try {
            const logoSize = 48;
            doc.image(logoBuffer, leftMargin, headerY, {
              fit: [logoSize, logoSize],
            });
            textStartX = leftMargin + logoSize + 15;
            currentY = headerY + logoSize + 10;
          } catch (error) {
            console.warn('Error rendering logo:', error.message);
            currentY = headerY;
          }
        } else {
          currentY = headerY;
        }

        // Company name (left side)
        doc.save()
          .font(`${theme.fontFamily}-Bold`)
          .fontSize(20)
          .fillColor('#111827');
        const companyName = theme.companyName || 'Grocery MS';
        const companyNameHeight = doc.heightOfString(companyName, { width: leftSectionWidth });
        doc.text(companyName, textStartX, currentY, {
          width: leftSectionWidth,
          align: 'left',
        });
        doc.restore();
        currentY += companyNameHeight + 5;

        // Company tagline (if provided)
        if (theme.tagline) {
          doc.save()
            .font(theme.fontFamily)
            .fontSize(9)
            .fillColor('#666666');
          const taglineHeight = doc.heightOfString(theme.tagline, { width: leftSectionWidth });
          doc.text(theme.tagline, textStartX, currentY, {
            width: leftSectionWidth,
            align: 'left',
          });
          doc.restore();
          currentY += taglineHeight + 3;
        }

        // Company address
        const companyInfo = theme.contactInfo || 'University of Mianwali\nMianwali, Punjab, Pakistan';
        doc.save()
          .font(theme.fontFamily)
          .fontSize(9)
          .fillColor('#666666');
        const addressHeight = doc.heightOfString(companyInfo, { width: leftSectionWidth });
        doc.text(companyInfo, textStartX, currentY, {
          width: leftSectionWidth,
          align: 'left',
        });
        doc.restore();

        // Report title and number (right side) - styled like "INVOICE"
        // Extract main title (before parentheses) for cleaner display
        let fullTitle = options.title || 'REPORT';
        const titleMatch = fullTitle.match(/^([^(]+)/);
        const mainTitle = (titleMatch ? titleMatch[1].trim() : fullTitle).toUpperCase();
        const subtitle = fullTitle.match(/\(([^)]+)\)/); // Extract content in parentheses
        
        const reportNumber = options.reportNumber || `RPT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
        const rightStartX = pageWidth - rightMargin - rightSectionWidth;
        let rightY = headerY;
        
        // Main report title (e.g., "DAILY SALES REPORT")
        doc.save()
          .font(`${theme.fontFamily}-Bold`)
          .fontSize(22)
          .fillColor('#111827');
        const titleHeight = doc.heightOfString(mainTitle, { width: rightSectionWidth });
        doc.text(mainTitle, rightStartX, rightY, {
          width: rightSectionWidth,
          align: 'right',
        });
        doc.restore();
        rightY += titleHeight + 3;
        
        // Subtitle in parentheses (e.g., "(Last 7 Days)") if present
        if (subtitle) {
          doc.save()
            .font(theme.fontFamily)
            .fontSize(10)
            .fillColor('#666666');
          const subtitleHeight = doc.heightOfString(`(${subtitle[1]})`, { width: rightSectionWidth });
          doc.text(`(${subtitle[1]})`, rightStartX, rightY, {
            width: rightSectionWidth,
            align: 'right',
          });
          doc.restore();
          rightY += subtitleHeight + 5;
        } else {
          rightY += 5;
        }

        // Report number
        doc.save()
          .font(`${theme.fontFamily}-Bold`)
          .fontSize(13)
          .fillColor(...primaryRgb);
        const numberHeight = doc.heightOfString(reportNumber, { width: rightSectionWidth });
        doc.text(reportNumber, rightStartX, rightY, {
          width: rightSectionWidth,
          align: 'right',
        });
        doc.restore();
        rightY += numberHeight + 10;

        // Date and time (right side)
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });
        const timeStr = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
        
        doc.save()
          .font(theme.fontFamily)
          .fontSize(9)
          .fillColor('#666666');
        doc.text(`Date: ${dateStr}`, rightStartX, rightY, {
          width: rightSectionWidth,
          align: 'right',
        });
        rightY += 12;
        doc.text(`Time: ${timeStr}`, rightStartX, rightY, {
          width: rightSectionWidth,
          align: 'right',
        });
        doc.restore();

        // Border line under header - use the lower of the two sections
        const headerBottomY = Math.max(currentY + 10, rightY + 10);
        doc.save()
          .moveTo(leftMargin, headerBottomY)
          .lineTo(pageWidth - rightMargin, headerBottomY)
          .strokeColor('#E5E7EB')
          .lineWidth(1)
          .stroke()
          .restore();

        // Move cursor below header
        doc.y = headerBottomY + 20;
      }

      /**
       * Draw invoice-style footer
       */
      function drawInvoiceFooter() {
        const footerY = pageHeight - 60;
        
        // Footer border
        doc.save()
          .moveTo(leftMargin, footerY)
          .lineTo(pageWidth - rightMargin, footerY)
          .strokeColor('#E5E7EB')
          .lineWidth(1)
          .stroke()
          .restore();

        // Thank you message
        doc.save()
          .font(theme.fontFamily)
          .fontSize(10)
          .fillColor('#6B7280')
          .text('Thank you for using Grocery Management System!', leftMargin, footerY + 10, {
            width: pageWidth - leftMargin - rightMargin,
            align: 'center',
          })
          .restore();

        // Copyright
        doc.save()
          .font(theme.fontFamily)
          .fontSize(8)
          .fillColor('#9CA3AF')
          .text(`© ${new Date().getFullYear()} ${theme.companyName || 'Grocery Management System'} - Made by Saad Ali`, leftMargin, footerY + 25, {
            width: pageWidth - leftMargin - rightMargin,
            align: 'center',
          })
          .restore();

        // Page number
        doc.save()
          .font(theme.fontFamily)
          .fontSize(8)
          .fillColor('#9CA3AF')
          .text(`Page ${pageNumber}`, leftMargin, footerY + 25, {
            width: pageWidth - leftMargin - rightMargin,
            align: 'right',
          })
          .restore();
      }

      // Draw header on first page
      drawHeader();
      doc.moveDown(0.5);

      // Table section
      if (options.columns && options.columns.length > 0) {
        // Add row number column (like invoice # column)
        const hasRowNumbers = options.showRowNumbers !== false;
        const numColumns = hasRowNumbers ? options.columns.length + 1 : options.columns.length;
        const tableWidth = pageWidth - leftMargin - rightMargin;
        // Make row number column narrower
        const rowNumWidth = hasRowNumbers ? 30 : 0;
        const dataColumnsWidth = tableWidth - rowNumWidth;
        const dataColumnWidth = dataColumnsWidth / options.columns.length;

        /**
         * Draw invoice-style table header
         */
        function drawTableHeader() {
          const headerY = doc.y;
          
          // Table header with border (invoice style)
          doc.save()
            .moveTo(leftMargin, headerY - 5)
            .lineTo(pageWidth - rightMargin, headerY - 5)
            .strokeColor('#E5E7EB')
            .lineWidth(2)
            .stroke()
            .restore();

          // Header text (invoice style - no background, just bold text)
          doc.save()
            .font(`${theme.fontFamily}-Bold`)
            .fontSize(10)
            .fillColor('#6B7280');

          let xPosition = leftMargin;
          
          // Row number column header
          if (hasRowNumbers) {
            doc.text('#', xPosition + 3, headerY, {
              width: rowNumWidth - 6,
              align: 'center',
            });
            xPosition += rowNumWidth;
          }
          
          options.columns.forEach((col, index) => {
            // First column (usually item name) - left align
            // Last columns (usually totals) - right align
            // Middle columns - center or left
            let align = 'left';
            if (index === 0) align = 'left';
            else if (index === options.columns.length - 1) align = 'right';
            else if (/qty|quantity|count/i.test(col.key)) align = 'center';
            else if (/price|revenue|total|amount|value/i.test(col.key)) align = 'right';
            
            doc.text((col.header || col.key).toUpperCase(), xPosition + 5, headerY, {
              width: dataColumnWidth - 10,
              align: align,
            });
            xPosition += dataColumnWidth;
          });

          doc.restore();
          
          // Border line under header
          doc.save()
            .moveTo(leftMargin, headerY + 12)
            .lineTo(pageWidth - rightMargin, headerY + 12)
            .strokeColor('#E5E7EB')
            .lineWidth(1)
            .stroke()
            .restore();
            
          doc.y = headerY + 18;
        }

        /**
         * Draw table rows
         */
        function drawRows() {
          doc.save()
            .font(theme.fontFamily)
            .fontSize(10)
            .fillColor('#111827');

          if (!data || data.length === 0) {
            doc.moveDown(2);
            doc.save()
              .font(`${theme.fontFamily}-Oblique`)
              .fillColor('#6B7280')
              .text('No data available for this report.', { align: 'center' })
              .restore();
            doc.restore();
            return;
          }

          data.forEach((item, rowIndex) => {
            // Check if we need a new page
            if (doc.y > pageHeight - 100) {
              drawInvoiceFooter();
              doc.addPage();
              pageNumber++;
              drawHeader();
              drawTableHeader();
            }

            const rowTop = doc.y;
            const rowHeight = 20;

            // Cell values (invoice style - clean, no alternating colors)
            doc.save()
              .font(theme.fontFamily)
              .fontSize(10)
              .fillColor('#111827');

            let xPosition = leftMargin;
            
            // Row number
            if (hasRowNumbers) {
              doc.text(String(rowIndex + 1), xPosition + 3, rowTop, {
                width: rowNumWidth - 6,
                align: 'center',
              });
              xPosition += rowNumWidth;
            }
            
            options.columns.forEach((col, colIndex) => {
              const raw = item[col.key];
              const value = formatCellValue(raw, col.key);
              
              // Alignment logic (same as header)
              let align = 'left';
              if (colIndex === 0) align = 'left';
              else if (colIndex === options.columns.length - 1) align = 'right';
              else if (/qty|quantity|count/i.test(col.key)) align = 'center';
              else if (/price|revenue|total|amount|value/i.test(col.key)) align = 'right';
              
              doc.text(value, xPosition + 5, rowTop, {
                width: dataColumnWidth - 10,
                align: align,
              });
              
              xPosition += dataColumnWidth;
            });

            doc.restore();

            // Border line under row
            doc.save()
              .moveTo(leftMargin, rowTop + rowHeight)
              .lineTo(pageWidth - rightMargin, rowTop + rowHeight)
              .strokeColor('#F3F4F6')
              .lineWidth(0.5)
              .stroke()
              .restore();

            doc.y = rowTop + rowHeight + 2;
          });

          doc.restore();
        }

        drawTableHeader();
        drawRows();

        // Summary section (if applicable) - styled like invoice totals
        if (data && data.length > 0) {
          // Calculate totals for numeric columns
          const numericColumns = options.columns.filter(col => 
            /revenue|price|total|value|amount|quantity|qty|sold|units|count/i.test(col.key)
          );
          
          if (numericColumns.length > 0) {
            doc.moveDown(1.5);
            const summaryY = doc.y;
            const summaryWidth = 280;
            const summaryX = pageWidth - rightMargin - summaryWidth;
            const padding = 12;
            const lineHeight = 18;
            const totalHeight = padding * 2 + (numericColumns.length * lineHeight) + 5;

            // Summary box border
            doc.save()
              .rect(summaryX, summaryY, summaryWidth, totalHeight)
              .strokeColor('#E5E7EB')
              .lineWidth(1)
              .stroke()
              .restore();

            // Calculate and display totals
            let currentSummaryY = summaryY + padding;
            numericColumns.forEach((col, index) => {
              const total = data.reduce((sum, item) => {
                const val = parseFloat(item[col.key]) || 0;
                return sum + val;
              }, 0);
              
              const label = (col.header || col.key) + (index === numericColumns.length - 1 ? '' : ' Total:');
              const isTotal = /total|revenue|amount/i.test(col.key) && index === numericColumns.length - 1;
              
              // Border line before total (if not first item)
              if (isTotal && index > 0) {
                doc.save()
                  .moveTo(summaryX + 5, currentSummaryY - 3)
                  .lineTo(summaryX + summaryWidth - 5, currentSummaryY - 3)
                  .strokeColor('#E5E7EB')
                  .lineWidth(1)
                  .stroke()
                  .restore();
                currentSummaryY += 5;
              }
              
              doc.save()
                .font(isTotal ? `${theme.fontFamily}-Bold` : theme.fontFamily)
                .fontSize(isTotal ? 12 : 10)
                .fillColor(isTotal ? '#111827' : '#6B7280');
              
              // Label (left side) - use proper width calculation
              const labelWidth = summaryWidth - 100; // Reserve space for value
              doc.text(label, summaryX + padding, currentSummaryY, {
                width: labelWidth,
                align: 'left',
              });
              
              // Value (right side) - positioned correctly
              const valueText = formatCellValue(total, col.key);
              doc.text(valueText, summaryX + padding + labelWidth, currentSummaryY, {
                width: summaryWidth - padding - labelWidth - padding,
                align: 'right',
              });
              
              doc.restore();
              currentSummaryY += lineHeight;
            });

            doc.y = summaryY + totalHeight + 15;
          }
        }
      }

      // Draw footer on final page
      drawInvoiceFooter();

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

