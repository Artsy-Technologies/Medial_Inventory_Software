const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

// POST Create ASN Note
router.post('/', authMiddleware(['admin']), (req, res) => {
  const { po_id, vendor_id, expected_delivery_date, remarks } = req.body;
  const userId = req.user?.user_id || req.session?.user_id;

  const sql = `
    INSERT INTO ASN_Notes (po_id, vendor_id, expected_delivery_date, remarks)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [po_id, vendor_id, expected_delivery_date, remarks], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    logAction(userId, 'create', 'ASN_Notes', result.insertId, 'Created ASN note');
    res.status(201).json({ message: 'ASN Note created', asn_id: result.insertId });
  });
});

// GET All ASN Notes
router.get('/', authMiddleware(['admin']), (req, res) => {
  const sql = `SELECT * FROM ASN_Notes`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// PUT Update ASN Note
router.put('/:asn_id', authMiddleware(['admin']), (req, res) => {
  const asnId = req.params.asn_id;
  const { expected_delivery_date, remarks } = req.body;
  const userId = req.user?.user_id || req.session?.user_id;

  const checkSql = 'SELECT * FROM ASN_Notes WHERE asn_id = ?';
  db.query(checkSql, [asnId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'ASN Note not found' });

    const updateSql = `
      UPDATE ASN_Notes
      SET expected_delivery_date = ?, remarks = ?
      WHERE asn_id = ?
    `;

    db.query(updateSql, [expected_delivery_date, remarks, asnId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      logAction(userId, 'update', 'ASN_Notes', asnId, 'Updated ASN note');
      res.json({ message: 'ASN Note updated' });
    });
  });
});

// DELETE ASN Note
router.delete('/:asn_id', authMiddleware(['admin']), (req, res) => {
  const asnId = req.params.asn_id;
  const userId = req.user?.user_id || req.session?.user_id;

  const checkSql = 'SELECT * FROM ASN_Notes WHERE asn_id = ?';
  db.query(checkSql, [asnId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'ASN Note not found' });

    const deleteSql = `DELETE FROM ASN_Notes WHERE asn_id = ?`;
    db.query(deleteSql, [asnId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      logAction(userId, 'delete', 'ASN_Notes', asnId, 'Deleted ASN note');
      res.json({ message: 'ASN Note deleted' });
    });
  });
});

module.exports = router;
