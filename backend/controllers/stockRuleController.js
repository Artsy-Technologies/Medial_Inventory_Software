const StockRule = require('../models/stockRuleModel');
const db = require('../db/db');

// Create Stock Rule
exports.createStockRule = async (req, res) => {
  try {
    const {
      item_id, moq, pack_size, pack_density,
      adr_mode, adr_months, adr, lod, lod_stock,
      safety_stock, rol, max_stock
    } = req.body;

    if (!item_id || !adr_mode || (!adr && adr_mode === 'manual')) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO Stock_Rules (
        item_id, moq, pack_size, pack_density,
        adr_mode, adr_months, adr, lod, lod_stock,
        safety_stock, rol, max_stock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      item_id, moq, pack_size, pack_density,
      adr_mode, adr_months || null, adr || null,
      lod, lod_stock, safety_stock, rol, max_stock
    ];

    const [result] = await db.query(query, values);
    res.status(201).json({ message: 'Stock rule created', rule_id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Creation failed' });
  }
};

// Get all stock rules
exports.getAllStockRules = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM Stock_Rules`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stock rules' });
  }
};

// Get stock rule by ID
exports.getStockRuleById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[rule]] = await db.query(`SELECT * FROM Stock_Rules WHERE rule_id = ?`, [id]);
    if (!rule) return res.status(404).json({ error: 'Stock rule not found' });
    res.json(rule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// Update stock rule
exports.updateStockRule = async (req, res) => {
  const { id } = req.params;
  const {
    moq, pack_size, pack_density, adr_mode, adr_months, adr,
    lod, lod_stock, safety_stock, rol, max_stock
  } = req.body;

  try {
    const query = `
      UPDATE Stock_Rules SET
        moq = ?, pack_size = ?, pack_density = ?,
        adr_mode = ?, adr_months = ?, adr = ?,
        lod = ?, lod_stock = ?, safety_stock = ?,
        rol = ?, max_stock = ?, updated_at = NOW()
      WHERE rule_id = ?
    `;

    const values = [
      moq, pack_size, pack_density,
      adr_mode, adr_months || null, adr || null,
      lod, lod_stock, safety_stock, rol, max_stock,
      id
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rule not found' });
    res.json({ message: 'Stock rule updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
};

// Soft delete rule
exports.deleteStockRule = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(`DELETE FROM Stock_Rules WHERE rule_id = ?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Rule not found' });
    res.json({ message: 'Stock rule deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
};
