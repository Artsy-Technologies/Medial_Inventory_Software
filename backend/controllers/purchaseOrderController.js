const db = require('../db/db');

exports.createPO = async (req, res) => {
  const { vendor_id, status = 'created', items = [] } = req.body;

  if (!vendor_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing vendor or items' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // STEP 1: Generate PO number (simplified for now)
    const po_number = `PO-${Date.now()}`;

    // STEP 2: Insert into Purchase_Orders (order_date = today)
    const [poResult] = await conn.query(
      `INSERT INTO Purchase_Orders (po_number, vendor_id, order_date, status, total_amount)
       VALUES (?, ?, CURDATE(), ?, 0)`,
      [po_number, vendor_id, status]
    );
    const po_id = poResult.insertId;

    let poTotal = 0;

    // STEP 3: Insert PO items and compute total
    for (const item of items) {
      const {
        item_id,
        quantity,
        unit_price,
        tax_percent,
        gst_type
      } = item;

      const baseAmount = unit_price * quantity;
      let cgst = 0, sgst = 0, igst = 0;

      if (gst_type === 'intra') {
        cgst = (tax_percent / 2) * baseAmount / 100;
        sgst = (tax_percent / 2) * baseAmount / 100;
      } else if (gst_type === 'inter') {
        igst = tax_percent * baseAmount / 100;
      }

      const total_price = baseAmount + cgst + sgst + igst;
      poTotal += total_price;

      await conn.query(
        `INSERT INTO PO_Items
        (po_id, item_id, quantity, unit_price, total_price, tax_percent, gst_type, cgst, sgst, igst)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [po_id, item_id, quantity, unit_price, total_price, tax_percent, gst_type, cgst, sgst, igst]
      );
    }

    // STEP 4: Update total_amount in Purchase_Orders
    await conn.query(
      `UPDATE Purchase_Orders SET total_amount = ? WHERE po_id = ?`,
      [poTotal, po_id]
    );

    await conn.commit();
    res.status(201).json({ message: 'PO created', po_id, po_number });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'PO creation failed', details: err.message });
  } finally {
    conn.release();
  }
};

exports.getAllPOs = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM Purchase_Orders WHERE is_deleted = 0`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch POs' });
  }
};

exports.getPOById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[po]] = await db.query(`SELECT * FROM Purchase_Orders WHERE po_id = ? AND is_deleted = 0`, [id]);
    if (!po) return res.status(404).json({ error: 'PO not found' });

    const [items] = await db.query(`SELECT * FROM po_items WHERE po_id = ?`, [id]);

    res.json({ ...po, items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch PO' });
  }
};

exports.updatePO = async (req, res) => {
  const { id } = req.params;
  const { status, vendor_id, order_date } = req.body;

  if (!status && !vendor_id && !order_date) {
    return res.status(400).json({ error: 'No update fields provided' });
  }

  try {
    const fields = [];
    const values = [];

    if (status) {
      fields.push('status = ?');
      values.push(status);
    }

    if (vendor_id) {
      fields.push('vendor_id = ?');
      values.push(vendor_id);
    }

    if (order_date) {
      fields.push('order_date = ?');
      values.push(order_date);
    }

    fields.push('updated_at = NOW()'); // Auto-update timestamp

    const query = `UPDATE Purchase_Orders SET ${fields.join(', ')} WHERE po_id = ? AND is_deleted = 0`;
    values.push(id);

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'PO not found or already deleted' });
    }

    res.json({ message: 'Purchase Order updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

exports.deletePO = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      `UPDATE Purchase_Orders SET is_deleted = 1 WHERE po_id = ?`,
      [id]
    );

    await db.query(`DELETE FROM PO_Items WHERE po_id = ?`, [po_id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'PO not found' });

    res.json({ message: 'PO deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};

exports.updatePOItems = async (req, res) => {
  const { po_id } = req.params;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Item list is required' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Step 1: Remove existing items
    await conn.query(`DELETE FROM PO_Items WHERE po_id = ?`, [po_id]);

    let newTotal = 0;

    // Step 2: Add updated items
    for (const item of items) {
      const {
        item_id,
        quantity,
        unit_price,
        tax_percent,
        gst_type
      } = item;

      const baseAmount = unit_price * quantity;
      let cgst = 0, sgst = 0, igst = 0;

      if (gst_type === 'intra') {
        cgst = (tax_percent / 2) * baseAmount / 100;
        sgst = (tax_percent / 2) * baseAmount / 100;
      } else if (gst_type === 'inter') {
        igst = tax_percent * baseAmount / 100;
      }

      const total_price = baseAmount + cgst + sgst + igst;
      newTotal += total_price;

      await conn.query(
        `INSERT INTO PO_Items
        (po_id, item_id, quantity, unit_price, total_price, tax_percent, gst_type, cgst, sgst, igst)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [po_id, item_id, quantity, unit_price, total_price, tax_percent, gst_type, cgst, sgst, igst]
      );
    }

    // Step 3: Update total in Purchase_Orders
    await conn.query(
      `UPDATE Purchase_Orders SET total_amount = ?, updated_at = NOW() WHERE po_id = ?`,
      [newTotal, po_id]
    );

    await conn.commit();
    res.json({ message: 'PO items updated', new_total: newTotal });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Failed to update PO items', details: err.message });
  } finally {
    conn.release();
  }
};
