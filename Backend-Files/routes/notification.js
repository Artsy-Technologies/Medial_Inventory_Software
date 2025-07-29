const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

//  CREATE Notification
router.post('/', authMiddleware(['admin']), (req, res) => {
  const { user_id, message, type } = req.body;

  if (!user_id || !message || !type) {
    return res.status(400).json({ error: 'Required fields: user_id, message, type' });
  }

  const sql = `INSERT INTO Notifications (user_id, message, type) VALUES (?, ?, ?)`;
  db.query(sql, [user_id, message, type], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    logAction(req.session.user_id, 'create', 'Notifications', result.insertId, `Notification created for user ${user_id}`);
    res.json({ message: 'Notification created', notification_id: result.insertId });
  });
});

//  GET All Notifications (Admin Only)
router.get('/', authMiddleware(['admin']), (req, res) => {
  const sql = `SELECT * FROM Notifications ORDER BY created_at DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  GET All Notifications for a user
router.get('/:user_id', authMiddleware(['admin', 'user']), (req, res) => {
  const userId = req.params.user_id;
  const sql = `SELECT * FROM Notifications WHERE user_id = ? ORDER BY created_at DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

//  UPDATE Notification as Read
router.put('/:notification_id', authMiddleware(['admin', 'user']), (req, res) => {
  const notificationId = req.params.notification_id;
  const sql = `UPDATE Notifications SET is_read = TRUE WHERE notification_id = ?`;

  db.query(sql, [notificationId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    logAction(req.session.user_id, 'update', 'Notifications', notificationId, 'Notification marked as read');
    res.json({ message: 'Notification marked as read' });
  });
});

//  DELETE Notification
router.delete('/:notification_id', authMiddleware(['admin', 'user']), (req, res) => {
  const notificationId = req.params.notification_id;
  const sql = `DELETE FROM Notifications WHERE notification_id = ?`;

  db.query(sql, [notificationId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    logAction(req.session.user_id, 'delete', 'Notifications', notificationId, 'Notification deleted');
    res.json({ message: 'Notification deleted' });
  });
});

module.exports = router;
