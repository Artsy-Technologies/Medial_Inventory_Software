const db = require('../db/db');

exports.createPO = async (req, res) => {
    const { vendor_id, created_by, payment_terms, expected_delivery_date, items } = req.body;

    if (!vendor_id || !created_by || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields or items' });
    }

    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        // Insert into purchase_orders
        const [poResult] = await conn.query(
            `INSERT INTO purchase_orders (vendor_id, created_by, payment_terms, expected_delivery_date)
       VALUES (?, ?, ?, ?)`,
            [vendor_id, created_by, payment_terms, expected_delivery_date]
        );
        const po_id = poResult.insertId;

        // Insert each PO item
        for (let item of items) {
            const { item_id, quantity, unit_price, gst } = item;
            const total_amount = quantity * unit_price + (quantity * unit_price * gst) / 100;

            await conn.query(
                `INSERT INTO po_items (po_id, item_id, quantity, unit_price, gst, total_amount)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [po_id, item_id, quantity, unit_price, gst, total_amount]
            );
        }

        await conn.commit();
        res.status(201).json({ message: 'PO created', po_id });
    } catch (error) {
        await conn.rollback();
        console.error(error);
        res.status(500).json({ error: 'PO creation failed' });
    } finally {
        conn.release();
    }
};

exports.getAllPOs = async (req, res) => {
    try {
        const [result] = await db.query(
            `SELECT * FROM purchase_orders WHERE is_deleted = 0 ORDER BY created_at DESC`
        );
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch POs' });
    }
};

exports.getPOById = async (req, res) => {
    const { id } = req.params;
    try {
        const [[po]] = await db.query(
            `SELECT * FROM purchase_orders WHERE po_id = ? AND is_deleted = 0`,
            [id]
        );

        if (!po) return res.status(404).json({ error: 'PO not found' });

        const [items] = await db.query(
            `SELECT * FROM po_items WHERE po_id = ?`,
            [id]
        );

        res.json({ ...po, items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch PO' });
    }
};

exports.updatePO = async (req, res) => {
    const { id } = req.params;
    const { payment_terms, expected_delivery_date, status } = req.body;

    try {
        const [result] = await db.query(
            `UPDATE purchase_orders
       SET payment_terms = ?, expected_delivery_date = ?, status = ?
       WHERE po_id = ? AND is_deleted = 0`,
            [payment_terms, expected_delivery_date, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'PO not found or already deleted' });
        }

        res.json({ message: 'PO updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update PO' });
    }
};

exports.deletePO = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            `UPDATE purchase_orders SET is_deleted = 1 WHERE po_id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'PO not found or already deleted' });
        }

        res.json({ message: 'PO deleted successfully (soft delete)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete PO' });
    }
};
