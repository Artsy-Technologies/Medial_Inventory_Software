const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

// CREATE MRN + MRN_Items
router.post('/', authMiddleware(['admin']), (req, res) => {
  const {
    mrn_number,
    po_id,
    vendor_id,
    invoice_number,
    invoice_date,
    receipt_date,
    transaction_reference,
    scanned_by,
    received_by,
    total_invoice_value,
    tax_details_json,
    remarks,
    items
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  const insertMRN = `
    INSERT INTO Material_Receipt_Notes (
      mrn_number, po_id, vendor_id, invoice_number, invoice_date,
      receipt_date, transaction_reference, scanned_by, received_by,
      total_invoice_value, tax_details_json, remarks
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertMRN,
    [
      mrn_number, po_id, vendor_id, invoice_number, invoice_date,
      receipt_date, transaction_reference, scanned_by, received_by,
      total_invoice_value, JSON.stringify(tax_details_json), remarks
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const mrn_id = result.insertId;

      const itemValues = items.map(item => [
        mrn_id,
        po_id,
        item.item_id,
        item.quantity,
        item.batch_number,
        item.price,
        item.uom,
        item.expiry_date,
        item.manufacture_date,
        item.receiving_location_id
      ]);

      const insertMRNItems = `
        INSERT INTO MRN_Items (
          mrn_id, po_id, item_id, quantity, batch_number,
          price, uom, expiry_date, manufacture_date, receiving_location_id
        )
        VALUES ?
      `;

      db.query(insertMRNItems, [itemValues], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        const userId = req.user?.user_id || req.session?.user_id;
        logAction(userId, 'create', 'Material_Receipt_Notes', mrn_id, 'MRN created with items');
        res.status(201).json({ message: 'MRN created', mrn_id });
      });
    }
  );
});

// GET all MRNs
router.get('/', authMiddleware(['admin', 'user']), (req, res) => {
  const query = `SELECT * FROM Material_Receipt_Notes`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single MRN with its items
router.get('/:id', authMiddleware(['admin', 'user']), (req, res) => {
  const { id } = req.params;

  const queryMRN = `SELECT * FROM Material_Receipt_Notes WHERE mrn_id = ?`;
  db.query(queryMRN, [id], (err, mrnResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (mrnResults.length === 0) return res.status(404).json({ message: 'MRN not found' });

    const queryItems = `SELECT * FROM MRN_Items WHERE mrn_id = ?`;
    db.query(queryItems, [id], (err2, itemResults) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ mrn: mrnResults[0], items: itemResults });
    });
  });
});

// PUT Update MRN
router.put('/:mrn_id', authMiddleware(['admin']), (req, res) => {
  const mrnId = req.params.mrn_id;
  const { status, remarks } = req.body;
  const sql = `UPDATE Material_Receipt_Notes SET status = ?, remarks = ? WHERE mrn_id = ?`;
  db.query(sql, [status, remarks, mrnId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'MRN updated' });
  });
});

// DELETE MRN — SAFE DELETE with children cleanup and validation
router.delete('/:mrn_id', authMiddleware(['admin']), (req, res) => {
  const mrnId = req.params.mrn_id;
  const userId = req.user?.user_id || req.session?.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: user not identified' });
  }

  // Check if MRN exists before deleting
  const checkMRN = `SELECT * FROM Material_Receipt_Notes WHERE mrn_id = ?`;
  db.query(checkMRN, [mrnId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'MRN not found' });

    // Step 1: Delete Binning Transactions
    const deleteBinning = `DELETE FROM Binning_Transactions WHERE mrn_id = ?`;
    db.query(deleteBinning, [mrnId], (err1) => {
      if (err1) return res.status(500).json({ error: err1.message });

      // Step 2: Delete MRN Items
      const deleteMRNItems = `DELETE FROM MRN_Items WHERE mrn_id = ?`;
      db.query(deleteMRNItems, [mrnId], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });

        // Step 3: Delete MRN
        const deleteMRN = `DELETE FROM Material_Receipt_Notes WHERE mrn_id = ?`;
        db.query(deleteMRN, [mrnId], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });

          logAction(userId, 'delete', 'Material_Receipt_Notes', mrnId, 'MRN and related records deleted');
          res.json({ message: 'MRN, items & binning transactions deleted successfully' });
        });
      });
    });
  });
});

module.exports = router;
