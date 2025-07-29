const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET Reports by type with optional filters
router.get('/:type', authMiddleware(['admin']), (req, res) => {
  const { type } = req.params;
  const { fromDate, toDate, vendor, item, status } = req.query;

  let sql = '';
  const params = [];

  if (type === 'inventory') {
    sql = `SELECT * FROM view_inventory_status`;

  } else if (type === 'pending-pos') {
    sql = `SELECT po.po_id, po.order_date, po.status, v.vendor_name, po.total_amount
           FROM Purchase_Orders po
           JOIN Vendors v ON po.vendor_id = v.vendor_id
           WHERE po.status = 'Pending'`;

    if (fromDate) {
      sql += ` AND po.order_date >= ?`;
      params.push(fromDate);
    }
    if (toDate) {
      sql += ` AND po.order_date <= ?`;
      params.push(toDate);
    }
    if (vendor) {
      sql += ` AND po.vendor_id = ?`;
      params.push(vendor);
    }

  } else if (type === 'vendor-performance') {
    sql = `SELECT v.vendor_name, COUNT(po.po_id) AS total_orders, 
                  SUM(po.total_amount) AS total_value
           FROM Purchase_Orders po
           JOIN Vendors v ON po.vendor_id = v.vendor_id
           WHERE po.status = 'Completed'`;

    if (fromDate) {
      sql += ` AND po.order_date >= ?`;
      params.push(fromDate);
    }
    if (toDate) {
      sql += ` AND po.order_date <= ?`;
      params.push(toDate);
    }
    if (vendor) {
      sql += ` AND po.vendor_id = ?`;
      params.push(vendor);
    }

    sql += ` GROUP BY v.vendor_id`;

  } else {
    return res.status(400).json({ error: 'Invalid report type' });
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
