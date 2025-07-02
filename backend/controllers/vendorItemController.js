const db = require('../db/db');

// POST /api/vendor-items
exports.linkVendorItem = async (req, res) => {
  const { vendor_id, item_id, price } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Vendor_Items (vendor_id, item_id, price, created_at)
      VALUES (?, ?, ?, NOW())`,
      [vendor_id, item_id, price]);

    res.status(201).json({ message: 'Vendor linked to item', id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: 'Linking failed', details: err.message });
  }
};

// GET all links
exports.getAllLinks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT vi.vendor_item_id, v.vendor_name, i.item_name, vi.price, vi.is_active
      FROM Vendor_Items vi
      JOIN Vendors v ON vi.vendor_id = v.vendor_id
      JOIN Items i ON vi.item_id = i.item_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// GET items by vendor ID
exports.getItemsByVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT vi.vendor_item_id, vi.item_id, i.item_name, vi.price, vi.is_active
      FROM Vendor_Items vi
      JOIN Items i ON vi.item_id = i.item_id
      WHERE vi.vendor_id = ?
    `, [id]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// PUT /api/vendor-items/:id
exports.updateVendorItem = async (req, res) => {
  const { id } = req.params;
  const { price, is_active } = req.body;

  try {
    const [result] = await db.query(`
      UPDATE Vendor_Items
      SET price = ?, is_active = ?, updated_at = NOW()
      WHERE vendor_item_id = ?
    `, [price, is_active, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Vendor item updated' });

  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

// DELETE /api/vendor-items/:id
exports.deleteVendorItem = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      `UPDATE Vendor_Items SET is_active = 0 WHERE vendor_item_id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }

    res.json({ message: 'Vendor item link deleted' });

  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
