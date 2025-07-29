const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');

//  Create a new stock rule
router.post('/', authMiddleware(['admin']), (req, res) => {
  const {
    item_id,
    moq,
    pack_size,
    pack_density,
    adr_mode,
    adr_months,
    adr,
    lod,
    lod_stock,
    safety_stock,
    rol,
    max_stock
  } = req.body;

  const query = `
    INSERT INTO stock_rules (
      item_id, moq, pack_size, pack_density, adr_mode, adr_months, adr,
      lod, lod_stock, safety_stock, rol, max_stock
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    item_id, moq, pack_size, pack_density, adr_mode, adr_months, adr,
    lod, lod_stock, safety_stock, rol, max_stock
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error creating stock rule:', err);
      return res.status(500).json({ message: 'Failed to create stock rule' });
    }

    res.status(201).json({ message: 'Stock rule created', id: result.insertId });
  });
});

//  Get all stock rules
router.get('/', authMiddleware(['admin', 'manager']), (req, res) => {
  const query = `
    SELECT sr.*, i.item_name
    FROM stock_rules sr
    JOIN items i ON sr.item_id = i.item_id
    ORDER BY sr.rule_id DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching stock rules:', err);
      return res.status(500).json({ message: 'Error retrieving stock rules' });
    }

    res.json(results);
  });
});

//  Update a stock rule
router.put('/:id', authMiddleware(['admin']), (req, res) => {
  const {
    moq,
    pack_size,
    pack_density,
    adr_mode,
    adr_months,
    adr,
    lod,
    lod_stock,
    safety_stock,
    rol,
    max_stock
  } = req.body;

  const { id } = req.params;

  const query = `
    UPDATE stock_rules SET
      moq = ?, pack_size = ?, pack_density = ?, adr_mode = ?, adr_months = ?, adr = ?,
      lod = ?, lod_stock = ?, safety_stock = ?, rol = ?, max_stock = ?
    WHERE rule_id = ?
  `;

  const values = [
    moq, pack_size, pack_density, adr_mode, adr_months, adr,
    lod, lod_stock, safety_stock, rol, max_stock, id
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating stock rule:', err);
      return res.status(500).json({ message: 'Error updating stock rule' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Stock rule not found' });
    }

    res.json({ message: 'Stock rule updated successfully' });
  });
});

//  Delete a stock rule
router.delete('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM stock_rules WHERE rule_id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting stock rule:', err);
      return res.status(500).json({ message: 'Error deleting stock rule' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Stock rule not found' });
    }

    res.json({ message: 'Stock rule deleted successfully' });
  });
});

module.exports = router;
