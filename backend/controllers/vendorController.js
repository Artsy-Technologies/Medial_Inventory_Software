const db = require('../db/db');

// POST /api/vendors
exports.createVendor = async (req, res) => {
  try {
    const {
      vendor_name, vendor_code, registration_details, address, item_type,
      logistics_method, contact_email, contact_number,
      phone_number, email, gst_no, contact_person
    } = req.body;

    const query = `
      INSERT INTO Vendors
      (vendor_name, vendor_code, registration_details, address, item_type, logistics_method, phone_number, email, gst_no, contact_person, contact_email, contact_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(query, [
      vendor_name, vendor_code, registration_details, address, item_type, logistics_method,
      phone_number, email, gst_no, contact_person, contact_email, contact_number
    ]);

    res.status(201).json({ message: 'Vendor created', vendor_id: result.insertId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Vendor creation failed', details: err.message });
  }
};

// GET /api/vendors
exports.getAllVendors = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM Vendors WHERE is_deleted = 0`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// GET /api/vendors/:id
exports.getVendorById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[vendor]] = await db.query(
      `SELECT * FROM Vendors WHERE vendor_id = ? AND is_deleted = 0`,
      [id]
    );

    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);

  } catch (err) {
    res.status(500).json({ error: 'Fetch failed' });
  }
};

// PUT /api/vendors/:id
exports.updateVendor = async (req, res) => {
  const { id } = req.params;
  const {
    vendor_name, vendor_code, registration_details, address, item_type, logistics_method,
    phone_number, email, gst_no, contact_person, contact_email, contact_number, status
  } = req.body;

  try {
    const query = `
      UPDATE Vendors SET
        vendor_name = ?, vendor_code = ?, registration_details = ?, address = ?, 
        item_type = ?, logistics_method = ?, phone_number = ?, email = ?, 
        gst_no = ?, contact_person = ?, contact_email = ?, contact_number = ?, 
        status = ?, updated_at = NOW() 
      WHERE vendor_id = ?`;

    const [result] = await db.query(query, [
      vendor_name, vendor_code, registration_details, address, item_type, logistics_method,
      phone_number, email, gst_no, contact_person, contact_email, contact_number, status, id
    ]);

    if (result.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor updated' });

  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

// DELETE /api/vendors/:id
exports.deleteVendor = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      `UPDATE Vendors SET is_deleted = 1, status = 'inactive' WHERE vendor_id = ?`,
      [id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};
