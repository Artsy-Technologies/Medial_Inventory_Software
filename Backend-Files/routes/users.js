const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');

//  Create User (no password set manually)
router.post('/create', authMiddleware(['admin']), (req, res) => {
  const { username, name, email, phone_number, role } = req.body;
  const sql = `INSERT INTO Users (username, email, phone_number, role) VALUES (?, ?, ?, ?)`;
  db.query(sql, [username, email, phone_number, role], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User created. Send reset link for password.' });
  });
});

//  Edit User
router.put('/:id', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const { username, email, phone_number, role, status } = req.body;
  const sql = `UPDATE Users SET username=?, email=?, phone_number=?, role=?, status=? WHERE user_id=?`;
  db.query(sql, [username, email, phone_number, role, status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
});

//  Activate/Deactivate User
router.patch('/:id/status', authMiddleware(['admin']), (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' or 'inactive'
  db.query(`UPDATE Users SET status = ? WHERE user_id = ?`, [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `User ${status}` });
  });
});

//  View All Users
router.get('/', authMiddleware(['admin']), (req, res) => {
  db.query(`SELECT user_id, username, email, phone_number, role, status FROM Users WHERE is_deleted = 0`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
