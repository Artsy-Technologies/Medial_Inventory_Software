const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

// CREATE vendor (admin only)
router.post('/', authMiddleware(['admin']), (req, res) => {
  const {
    vendor_name, vendor_code, registration_details,
    address, item_type, logistics_method
  } = req.body;

  const query = `
    INSERT INTO Vendors (
      vendor_name, vendor_code, registration_details,
      address, item_type, logistics_method
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    vendor_name, vendor_code, registration_details,
    address, item_type, logistics_method
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    logAction(req.session.user_id, 'create', 'Vendors', result.insertId, 'Vendor created');
    res.status(201).json({ message: 'Vendor added', vendorId: result.insertId });
  });
});

// GET all vendors (non-deleted)
router.get('/', authMiddleware(['admin']), (req, res) => {
  db.query('SELECT * FROM Vendors WHERE is_deleted = 0', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single vendor
router.get('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Vendors WHERE vendor_id = ? AND is_deleted = 0', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Vendor not found' });
    res.json(results[0]);
  });
});

// UPDATE vendor
router.put('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const {
    vendor_name, vendor_code, registration_details,
    address, item_type, logistics_method
  } = req.body;

  const query = `
    UPDATE Vendors SET
      vendor_name = ?, vendor_code = ?, registration_details = ?,
      address = ?, item_type = ?, logistics_method = ?
    WHERE vendor_id = ? AND is_deleted = 0
  `;

  db.query(query, [
    vendor_name, vendor_code, registration_details,
    address, item_type, logistics_method, id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Vendor not found or deleted' });

    logAction(req.session.user_id, 'update', 'Vendors', id, 'Vendor updated');
    res.json({ message: 'Vendor updated' });
  });
});

// SOFT DELETE vendor
router.delete('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const query = `UPDATE Vendors SET is_deleted = 1 WHERE vendor_id = ? AND is_deleted = 0`;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Vendor not found or already deleted' });

    logAction(req.session.user_id, 'delete', 'Vendors', id, 'Vendor soft deleted');
    res.json({ message: 'Vendor soft deleted' });
  });
});

module.exports = router;
