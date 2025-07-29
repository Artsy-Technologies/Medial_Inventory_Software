const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

//  CREATE Purchase Order WITH ITEMS
router.post('/', authMiddleware(['admin']), (req, res) => {
  const { vendor_id, items } = req.body;

  if (!vendor_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Vendor ID and at least one item are required.' });
  }

  const order_date = new Date();
  const status = 'pending';
  const po_number = 'PO' + Date.now();
  const total_amount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  const insertPOQuery = `
    INSERT INTO Purchase_Orders (po_number, vendor_id, order_date, status, total_amount)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertPOQuery, [po_number, vendor_id, order_date, status, total_amount], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to create PO', details: err.message });

    const po_id = result.insertId;

    const values = items.map(item => {
      const total_price = item.quantity * item.unit_price;
      const cgst = item.gst_type === 'intra' ? item.gst / 2 : 0;
      const sgst = item.gst_type === 'intra' ? item.gst / 2 : 0;
      const igst = item.gst_type === 'inter' ? item.gst : 0;

      return [
        po_id,
        item.item_id,
        item.quantity,
        item.unit_price,
        total_price,
        item.gst,
        item.gst_type,
        cgst,
        sgst,
        igst
      ];
    });

    const insertItemsQuery = `
      INSERT INTO PO_Items (
        po_id, item_id, quantity, unit_price, total_price,
        tax_percent, gst_type, cgst, sgst, igst
      ) VALUES ?
    `;

    db.query(insertItemsQuery, [values], (err2) => {
      if (err2) return res.status(500).json({ error: 'PO created but failed to add items', details: err2.message });

      logAction(req.session.user_id, 'create', 'Purchase_Orders', po_id, 'PO with items created');
      res.status(201).json({ message: 'PO with items created successfully', po_id });
    });
  });
});

//  GET All Purchase Orders
router.get('/', (req, res) => {
  const { status, fromDate, toDate } = req.query;
  let sql = `SELECT * FROM view_full_po_details WHERE 1=1`;
  const params = [];

  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (fromDate && toDate) {
    sql += ' AND order_date BETWEEN ? AND ?';
    params.push(fromDate, toDate);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  GET Single PO by ID
router.get('/:po_id', (req, res) => {
  const sql = `SELECT * FROM view_full_po_details WHERE po_id = ?`;
  db.query(sql, [req.params.po_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// UPDATE PO (status or date)
router.put('/:po_id', authMiddleware(['admin']), (req, res) => {
  const { status, order_date } = req.body;

  const sql = `UPDATE Purchase_Orders SET status = ?, order_date = ? WHERE po_id = ?`;
  db.query(sql, [status, order_date, req.params.po_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'PO updated' });
  });
});

module.exports = router;
