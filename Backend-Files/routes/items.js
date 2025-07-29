const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

// CREATE Item (Admin only)
router.post('/', authMiddleware(['admin']), (req, res) => {
  const {
    item_name, item_code, item_specification,
    item_type, pack_size, uom,
    latest_price = 0.0, avg_price_10_batches = 0.0,
    status = 'active'
  } = req.body;

  const query = `
    INSERT INTO Items (
      item_name, item_code, item_specification,
      item_type, pack_size, uom,
      latest_price, avg_price_10_batches, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    item_name, item_code, item_specification,
    item_type, pack_size, uom,
    latest_price, avg_price_10_batches, status
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    logAction(req.session.user_id, 'create', 'Items', result.insertId, 'Item created');
    res.status(201).json({ message: 'Item added', itemId: result.insertId });
  });
});

// READ all Items (Admin + User)
router.get('/', authMiddleware(['admin', 'user']), (req, res) => {
  db.query('SELECT * FROM Items WHERE is_deleted = 0', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ Item by ID (Admin + User)
router.get('/:id', authMiddleware(['admin', 'user']), (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Items WHERE item_id = ? AND is_deleted = 0', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Item not found' });
    res.json(results[0]);
  });
});

// UPDATE Item (Admin only)
router.put('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const {
    item_name, item_code, item_specification,
    item_type, pack_size, uom,
    latest_price = 0.0, avg_price_10_batches = 0.0,
    status = 'active'
  } = req.body;

  const query = `
    UPDATE Items SET
      item_name = ?, item_code = ?, item_specification = ?,
      item_type = ?, pack_size = ?, uom = ?,
      latest_price = ?, avg_price_10_batches = ?, status = ?
    WHERE item_id = ? AND is_deleted = 0
  `;

  db.query(query, [
    item_name, item_code, item_specification,
    item_type, pack_size, uom,
    latest_price, avg_price_10_batches, status, id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found or already deleted' });

    logAction(req.session.user_id, 'update', 'Items', id, 'Item updated');
    res.json({ message: 'Item updated' });
  });
});

// SOFT DELETE Item (Admin only)
router.delete('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;

  const query = `UPDATE Items SET is_deleted = 1 WHERE item_id = ? AND is_deleted = 0`;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found or already deleted' });

    logAction(req.session.user_id, 'delete', 'Items', id, 'Item soft deleted');
    res.json({ message: 'Item soft deleted' });
  });
});

module.exports = router;
