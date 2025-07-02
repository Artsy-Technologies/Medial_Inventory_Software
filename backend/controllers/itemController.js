const db = require('../db/db');

// POST /api/items
exports.createItem = async (req, res) => {
  try {
    const {
      item_name, item_code, item_specification, item_type,
      pack_size, uom, latest_price, avg_price_10_batches
    } = req.body;

    const query = `
      INSERT INTO Items
      (item_name, item_code, item_specification, item_type,
      pack_size, uom, latest_price, avg_price_10_batches)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(query, [
      item_name, item_code, item_specification, item_type,
      pack_size, uom, latest_price, avg_price_10_batches
    ]);

    res.status(201).json({ message: 'Item created', item_id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: 'Item creation failed', details: err.message });
  }
};

// GET all
exports.getAllItems = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM Items WHERE is_deleted = 0`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// GET by ID
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const [[item]] = await db.query(`SELECT * FROM Items WHERE item_id = ? AND is_deleted = 0`, [id]);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// PUT /api/items/:id
exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const {
    item_name, item_code, item_specification, item_type,
    pack_size, uom, latest_price, avg_price_10_batches, status
  } = req.body;

  try {
    const query = `
      UPDATE Items SET
      item_name = ?, item_code = ?, item_specification = ?, item_type = ?,
      pack_size = ?, uom = ?, latest_price = ?, avg_price_10_batches = ?,
      status = ?, updated_at = NOW()
      WHERE item_id = ?`;

    const [result] = await db.query(query, [
      item_name, item_code, item_specification, item_type,
      pack_size, uom, latest_price, avg_price_10_batches,
      status, id
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item updated' });

  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
    console.error(err);
  }
};

// DELETE (soft)
exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(`UPDATE Items SET is_deleted = 1 WHERE item_id = ?`, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
