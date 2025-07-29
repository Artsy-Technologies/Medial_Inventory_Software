const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');

// GET items where stock < ROL (Reorder Level)
router.get('/reorder-needed', authMiddleware(['admin', 'user']), (req, res) => {
  const query = `
    SELECT 
      i.item_id,
      i.item_name,
      inv.quantity AS current_stock,
      sr.rol AS reorder_level,
      sr.moq AS min_order_qty,
      sr.max_stock AS max_stock_level
    FROM 
      Items i
    JOIN 
      Inventory inv ON i.item_id = inv.item_id
    JOIN 
      Stock_Rules sr ON i.item_id = sr.item_id
    WHERE 
      inv.quantity < sr.rol
    ORDER BY 
      inv.quantity ASC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    res.status(200).json({
      message: 'Items that need reordering',
      items_to_order: results
    });
  });
});

module.exports = router;
