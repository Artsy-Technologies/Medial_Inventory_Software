const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

// CREATE Binning Log
router.post('/', authMiddleware(['admin']), (req, res) => {
  const { mrn_id, to_location_id } = req.body;
  const binned_by_user_id = req.user?.user_id || req.session?.user_id;

  if (!binned_by_user_id) {
    return res.status(401).json({ error: 'Unauthorized: user not identified' });
  }

  const sql = `
    INSERT INTO Binning_Transactions 
    (mrn_id, to_location_id, binned_by_user_id)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [mrn_id, to_location_id, binned_by_user_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    logAction(binned_by_user_id, 'create', 'Binning_Transactions', result.insertId, 'MRN binned');
    res.status(201).json({ message: 'Binning transaction recorded', binning_id: result.insertId });
  });
});

// GET All Binning Logs (safe version using LEFT JOIN)
router.get('/', authMiddleware(['admin', 'user']), (req, res) => {
  const { item, location, user, date } = req.query;

  let sql = `
    SELECT 
      bt.*, 
      i.item_name, 
      l.location_name, 
      u.username
    FROM Binning_Transactions bt
    LEFT JOIN Users u ON bt.binned_by_user_id = u.user_id
    LEFT JOIN MRN_Items mi ON mi.mrn_id = bt.mrn_id
    LEFT JOIN Items i ON mi.item_id = i.item_id
    LEFT JOIN Locations l ON bt.to_location_id = l.location_id
    WHERE 1=1
  `;

  const params = [];

  if (item) {
    sql += ` AND i.item_id = ?`;
    params.push(item);
  }
  if (location) {
    sql += ` AND l.location_id = ?`;
    params.push(location);
  }
  if (user) {
    sql += ` AND u.user_id = ?`;
    params.push(user);
  }
  if (date) {
    sql += ` AND DATE(bt.transaction_date) = ?`;
    params.push(date);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
