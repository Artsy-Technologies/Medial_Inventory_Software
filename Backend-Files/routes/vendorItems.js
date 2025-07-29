const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

// CREATE vendor-item link (admin only)
router.post('/', authMiddleware(['admin']), (req, res) => {
  const { vendor_id, item_id, price } = req.body;

  const query = `
    INSERT INTO Vendor_Items (vendor_id, item_id, price)
    VALUES (?, ?, ?)
  `;

  db.query(query, [vendor_id, item_id, price], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    logAction(req.session.user_id, 'create', 'Vendor_Items', result.insertId, 'Vendor-Item link created');
    res.status(201).json({ message: 'Vendor-Item linked', id: result.insertId });
  });
});

// READ all vendor-item links
router.get('/', authMiddleware(['admin', 'user']), (req, res) => {
  const query = `
    SELECT 
      vi.vendor_item_id, 
      vi.vendor_id,
      v.vendor_name, 
      vi.item_id,
      i.item_name, 
      vi.price
    FROM Vendor_Items vi
    JOIN Vendors v ON vi.vendor_id = v.vendor_id
    JOIN Items i ON vi.item_id = i.item_id
    ORDER BY v.vendor_name, i.item_name
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ single vendor-item link
router.get('/:id', authMiddleware(['admin', 'user']), (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      vi.vendor_item_id, 
      vi.vendor_id,
      v.vendor_name, 
      vi.item_id,
      i.item_name, 
      vi.price
    FROM Vendor_Items vi
    JOIN Vendors v ON vi.vendor_id = v.vendor_id
    JOIN Items i ON vi.item_id = i.item_id
    WHERE vi.vendor_item_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Vendor-Item link not found' });
    res.json(results[0]);
  });
});

// UPDATE vendor-item link (price only)
router.put('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  const query = `UPDATE Vendor_Items SET price = ? WHERE vendor_item_id = ?`;
  db.query(query, [price, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Vendor-Item link not found' });

    logAction(req.session.user_id, 'update', 'Vendor_Items', id, 'Vendor-Item price updated');
    res.json({ message: 'Price updated' });
  });
});

// DELETE vendor-item link
router.delete('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM Vendor_Items WHERE vendor_item_id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Vendor-Item link not found' });

    logAction(req.session.user_id, 'delete', 'Vendor_Items', id, 'Vendor-Item link deleted');
    res.json({ message: 'Vendor-Item link deleted' });
  });
});

module.exports = router;
