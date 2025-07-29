const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

//  CREATE Inventory
router.post('/', authMiddleware(['admin']), (req, res) => {
  const { item_id, location_id, quantity } = req.body;

  if (!item_id || !location_id || quantity == null) {
    return res.status(400).json({ error: 'Required fields: item_id, location_id, quantity' });
  }

  const checkSql = `SELECT * FROM Inventory WHERE item_id = ? AND location_id = ?`;

  db.query(checkSql, [item_id, location_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      return res.status(409).json({ message: 'Duplicate entry for item and location' });
    }

    const insertSql = `
      INSERT INTO Inventory (item_id, location_id, quantity, last_updated)
      VALUES (?, ?, ?, NOW())
    `;

    db.query(insertSql, [item_id, location_id, quantity], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      logAction(req.session.user_id, 'create', 'Inventory', result.insertId, `Created inventory for item ${item_id}`);
      res.json({ message: 'Inventory created', inventory_id: result.insertId });
    });
  });
});

//  GET All Inventory
router.get('/', authMiddleware(['admin', 'user']), (req, res) => {
  const sql = `
    SELECT i.*, itm.item_name, loc.location_name
    FROM Inventory i
    JOIN Items itm ON i.item_id = itm.item_id
    JOIN Locations loc ON i.location_id = loc.location_id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  GET Inventory by Item ID
router.get('/:item_id', authMiddleware(['admin', 'user']), (req, res) => {
  const { item_id } = req.params;

  const sql = `
    SELECT i.*, loc.location_name
    FROM Inventory i
    JOIN Locations loc ON i.location_id = loc.location_id
    WHERE i.item_id = ?
  `;

  db.query(sql, [item_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  UPDATE Inventory Quantity
router.put('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity == null || quantity < 0) {
    return res.status(400).json({ error: 'Quantity must be a non-negative number' });
  }

  const sql = `
    UPDATE Inventory
    SET quantity = ?, last_updated = NOW()
    WHERE inventory_id = ?
  `;

  db.query(sql, [quantity, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    logAction(req.session.user_id, 'update', 'Inventory', id, `Updated quantity to ${quantity}`);
    res.json({ message: 'Inventory updated' });
  });
});

//  DELETE Inventory (Hard delete since soft delete column doesn't exist)
router.delete('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM Inventory WHERE inventory_id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    logAction(req.session.user_id, 'delete', 'Inventory', id, 'Deleted inventory entry');
    res.json({ message: 'Inventory deleted' });
  });
});

//  GET Inventory Summary
router.get('/summary', authMiddleware(['admin', 'user']), (req, res) => {
  const sql = `
    SELECT 
      i.item_id,
      itm.item_name,
      loc.location_name,
      i.quantity
    FROM Inventory i
    JOIN Items itm ON i.item_id = itm.item_id
    JOIN Locations loc ON i.location_id = loc.location_id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const summary = {};

    results.forEach(row => {
      if (!summary[row.item_id]) {
        summary[row.item_id] = {
          item_name: row.item_name,
          total_quantity: 0,
          locations: []
        };
      }

      summary[row.item_id].total_quantity += row.quantity;
      summary[row.item_id].locations.push({
        location_name: row.location_name,
        quantity: row.quantity
      });
    });

    res.json(Object.values(summary));
  });
});

module.exports = router;
