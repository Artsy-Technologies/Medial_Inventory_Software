const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Exported function to generate and return the PDF buffer
exports.generatePOPdf = (poData) => {
  return new Promise((resolve, reject) => {
    try {
      // Fallbacks for missing fields
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
        return reject(new Error("Invalid PO: items must be an array"));
      }

      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(18).text('Purchase Order', { align: 'center' });
      doc.moveDown().fontSize(12);
      doc.text(store_name, { align: 'center' });
      doc.text(store_address, { align: 'center' });

      doc.moveDown();
      doc.font('Courier-Bold');
      doc.text(`PO Number     : ${po_number}`);
      doc.text(`PO Date       : ${po_date}`);
      doc.text(`Vendor Name   : ${vendor_name}`);
      doc.text(`Vendor Code   : ${vendor_code}`);
      doc.moveDown();

      // Table header
      const headers = ['SN', 'Item Code', 'Description', 'UOM', 'Unit Price', 'Qty', 'CGST%', 'SGST%', 'IGST%', 'PO Value'];
      const colWidths = [30, 70, 140, 40, 60, 40, 50, 50, 50, 60];
      let y = doc.y;
      let x = 50;

      headers.forEach((header, i) => {
        doc.font('Courier-Bold').text(header, x, y);
        x += colWidths[i];
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
          Number(item.quantity || 0),
          Number(item.cgst || 0).toFixed(2),
          Number(item.sgst || 0).toFixed(2),
          Number(item.igst || 0).toFixed(2),
          Number(item.po_value || 0).toFixed(2)
        ];

        x = 50;
        row.forEach((cell, i) => {
          doc.font('Courier').text(String(cell), x, y);
          x += colWidths[i];
        });

        y += 20;
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
      });

      doc.moveDown(2);
      doc.font('Courier-Bold').text('--- End of Purchase Order ---', { align: 'center' });

      doc.end();
    } catch (err) {
      console.error('PDF generation failed:', err);
      reject(err);
    }
  });
};
