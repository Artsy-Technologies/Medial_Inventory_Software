const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

//  CREATE a new Location
router.post('/', authMiddleware(['admin']), (req, res) => {
  const { location_name, location_type, location_code, qr_barcode } = req.body;

  if (!location_name || !location_type || !location_code) {
    return res.status(400).json({ error: 'Required fields: location_name, location_type, location_code' });
  }

  const query = `
    INSERT INTO Locations (location_name, location_type, location_code, qr_barcode)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [location_name, location_type, location_code, qr_barcode], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    logAction(req.session.user_id, 'create', 'Locations', result.insertId, 'New location added');
    res.status(201).json({ message: 'Location added successfully', location_id: result.insertId });
  });
});

//  GET all Locations
router.get('/', authMiddleware(['admin', 'user']), (req, res) => {
  const query = `SELECT * FROM Locations`;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  UPDATE Location by ID
router.put('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const { location_name, location_type, location_code, qr_barcode } = req.body;

  if (!location_name || !location_type || !location_code) {
    return res.status(400).json({ error: 'Required fields: location_name, location_type, location_code' });
  }

  const query = `
    UPDATE Locations
    SET location_name = ?, location_type = ?, location_code = ?, qr_barcode = ?
    WHERE location_id = ?
  `;

  db.query(query, [location_name, location_type, location_code, qr_barcode, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    logAction(req.session.user_id, 'update', 'Locations', id, 'Location updated');
    res.json({ message: 'Location updated successfully' });
  });
});

//  DELETE Location (Hard Delete)
router.delete('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Locations WHERE location_id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Location not found' });
    }

    logAction(req.session.user_id, 'delete', 'Locations', id, 'Location deleted');
    res.json({ message: 'Location deleted successfully' });
  });
});

module.exports = router;
