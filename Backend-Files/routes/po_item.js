const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

//  Add PO Item
router.post('/:po_id/item', authMiddleware(['admin']), (req, res) => {
  const { item_id, quantity, unit_price, tax_percent, gst_type } = req.body;

  const q = Number(quantity);
  const u = Number(unit_price);
  const tax = Number(tax_percent);

  if (!item_id || isNaN(q) || isNaN(u) || isNaN(tax)) {
    return res.status(400).json({ error: 'Invalid item_id, quantity, unit_price or tax_percent' });
  }

  const total_price = q * u;
  const cgst = gst_type === 'intra' ? tax / 2 : 0;
  const sgst = gst_type === 'intra' ? tax / 2 : 0;
  const igst = gst_type === 'inter' ? tax : 0;

  const sql = `
    INSERT INTO PO_Items (
      po_id, item_id, quantity, unit_price, total_price,
      tax_percent, gst_type, cgst, sgst, igst
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    req.params.po_id, item_id, q, u, total_price,
    tax, gst_type, cgst, sgst, igst
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    logAction(req.session.user_id, 'create', 'PO_Items', result.insertId, `Item ${item_id} added to PO ${req.params.po_id}`);
    res.status(201).json({ message: 'PO item added', po_item_id: result.insertId });
  });
});

//  Get All PO Items by PO ID
router.get('/:po_id/items', authMiddleware(['admin', 'user']), (req, res) => {
  const sql = `
    SELECT poi.*, i.item_name
    FROM PO_Items poi
    JOIN Items i ON poi.item_id = i.item_id
    WHERE poi.po_id = ?
  `;

  db.query(sql, [req.params.po_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  Update PO Item
router.put('/item/:po_item_id', authMiddleware(['admin']), (req, res) => {
  const { quantity, unit_price, tax_percent, gst_type } = req.body;

  const q = Number(quantity);
  const u = Number(unit_price);
  const tax = Number(tax_percent);

  if (isNaN(q) || isNaN(u) || isNaN(tax)) {
    return res.status(400).json({ error: 'Invalid quantity, unit_price or tax_percent' });
  }

  const total_price = q * u;
  const cgst = gst_type === 'intra' ? tax / 2 : 0;
  const sgst = gst_type === 'intra' ? tax / 2 : 0;
  const igst = gst_type === 'inter' ? tax : 0;

  const sql = `
    UPDATE PO_Items SET 
      quantity = ?, unit_price = ?, total_price = ?,
      tax_percent = ?, gst_type = ?, cgst = ?, sgst = ?, igst = ?
    WHERE po_item_id = ?
  `;

  db.query(sql, [
    q, u, total_price,
    tax, gst_type, cgst, sgst, igst,
    req.params.po_item_id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'PO item not found' });

    logAction(req.session.user_id, 'update', 'PO_Items', req.params.po_item_id, 'PO item updated');
    res.json({ message: 'PO item updated' });
  });
});

//  Delete PO Item
router.delete('/item/:po_item_id', authMiddleware(['admin']), (req, res) => {
  const sql = `DELETE FROM PO_Items WHERE po_item_id = ?`;

  db.query(sql, [req.params.po_item_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'PO item not found' });

    logAction(req.session.user_id, 'delete', 'PO_Items', req.params.po_item_id, 'PO item deleted');
    res.json({ message: 'PO item deleted' });
  });
});

module.exports = router;
