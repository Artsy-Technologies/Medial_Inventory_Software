const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

console.log('📄 Ready to generate PO PDFs');

// Function to generate and return PDF buffer
exports.generatePOPdf = (poData) => {
  return new Promise((resolve, reject) => {
    try {
      // Destructure with defaults
      const {
        po_number = "PO001",
        po_date = new Date().toISOString().split('T')[0],
        vendor_name = "Default Vendor",
        vendor_code = "V001",
        store_name = "My Store",
        store_address = "123 Main Street",
        items = []
      } = poData;

      if (!Array.isArray(items)) {
        return reject(new Error('Invalid or missing "items" array.'));
      }

      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });

      // Content builder
      generatePDFContent(doc, {
        po_number,
        po_date,
        vendor_name,
        vendor_code,
        store_name,
        store_address,
        items
      });

      doc.end();
    } catch (err) {
      console.error('PDF generation failed:', err);
      reject(err);
    }
  });
};

// 🔧 Shared content builder
function generatePDFContent(doc, {
  po_number,
  po_date,
  vendor_name,
  vendor_code,
  store_name,
  store_address,
  items
}) {
  // Header
  doc.fontSize(18).text('Purchase Order', { align: 'center' });
  doc.moveDown().fontSize(12);
  doc.text(store_name, { align: 'center' });
  doc.text(store_address, { align: 'center' });

  doc.moveDown();
  doc.text(`PO Number     : ${po_number}`);
  doc.text(`PO Date       : ${po_date}`);
  doc.text(`Vendor Name   : ${vendor_name}`);
  doc.text(`Vendor Code   : ${vendor_code}`);
  doc.moveDown();

  // Table header
  const headers = ['SN', 'Item Code', 'Description', 'UOM', 'Unit Price', 'Qty', 'CGST%', 'SGST%', 'IGST%', 'PO Value'];
  const colWidths = [30, 60, 100, 40, 60, 40, 50, 50, 50, 60];
  const startX = 50;
  let y = doc.y + 10;

  headers.forEach((header, i) => {
    doc.font('Helvetica-Bold').text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
      width: colWidths[i],
      align: 'left'
    });
  });

  y += 20;

  // Table rows
  let sn = 1;
  items.forEach(item => {
    const row = [
      sn++,
      item.item_code || '',
      item.description || '',
      item.uom || '',
      Number(item.unit_price || 0).toFixed(2),
      item.quantity || 0,
      Number(item.cgst || 0).toFixed(2),
      Number(item.sgst || 0).toFixed(2),
      Number(item.igst || 0).toFixed(2),
      Number(item.po_value || 0).toFixed(2)
    ];

    row.forEach((text, i) => {
      doc.font('Helvetica').text(String(text), startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, {
        width: colWidths[i],
        align: 'left'
      });
    });

    y += 20;

    // Page break if too long
    if (y > 750) {
      doc.addPage();
      y = 50;
    }
  });

  doc.moveDown(2);
  doc.text('--- End of Purchase Order ---', { align: 'center' });
}
