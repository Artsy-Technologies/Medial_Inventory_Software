const express = require('express');
const router = express.Router();
const db = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');
const { logAction } = require('../middleware/logger'); // ✅ Import logAction

// GET all activity logs (admin only)
router.get('/', authMiddleware(['admin']), (req, res) => {
  const query = `
    SELECT a.log_id, u.username, a.action, a.table_name,
           a.record_id, a.description, a.timestamp
    FROM Activity_Log a
    JOIN Users u ON a.user_id = u.user_id
    ORDER BY a.timestamp DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// DELETE user and their activity logs (admin only)
router.delete('/admin/delete-user-with-logs/:userId', authMiddleware(['admin']), (req, res) => {
  const { userId } = req.params;

  // Check if the user exists
  const checkUser = 'SELECT user_id FROM users WHERE user_id = ?';
  db.query(checkUser, [userId], (err, userResults) => {
    if (err) return res.status(500).json({ error: 'Error checking user existence' });

    if (userResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deleteLogs = 'DELETE FROM activity_log WHERE user_id = ?';
    const deleteUser = 'DELETE FROM users WHERE user_id = ?';

    db.query(deleteLogs, [userId], (err) => {
      if (err) return res.status(500).json({ error: 'Error deleting activity logs' });

      db.query(deleteUser, [userId], (err2) => {
        if (err2) return res.status(500).json({ error: 'Error deleting user' });

        //  Use req.user.user_id from authMiddleware
        logAction(req.session.user_id, 'delete', 'users', userId, 'User and activity logs deleted');
        res.json({ message: `User ${userId} and their activity logs deleted` });
      });
    });
  });
});

module.exports = router;
