const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middleware/authMiddleware');
const logAction = require('../middleware/logger');

// Register
router.post('/register', async (req, res) => {
  const { username, email, phone_number, password, role = 'user' } = req.body;

  if (!username || !email || !phone_number || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const query = `INSERT INTO Users (username, email, phone_number, password_hash, role) VALUES (?, ?, ?, ?, ?)`;

    db.query(query, [username, email, phone_number, password_hash, role], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error registering user' });
      }

      logAction(result.insertId, 'register', 'Users', result.insertId, 'User registered');
      res.status(201).json({ message: 'User registered', userId: result.insertId });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Password hashing failed' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  db.query(`SELECT * FROM Users WHERE username = ?`, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Login query error' });
    }
    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.isAuthenticated = true;
    req.session.user_id = user.user_id;
    req.session.role = user.role;

    db.query(`UPDATE Users SET last_login = NOW() WHERE user_id = ?`, [user.user_id]);
    logAction(user.user_id, 'login', 'Users', user.user_id, 'User logged in');
    res.json({ message: 'Login successful', user });
  });
});

// Logout
router.get('/logout', (req, res) => {
  const userId = req.session?.user_id;
  if (!userId) return res.status(401).json({ message: 'Not logged in' });

  req.session.destroy(() => {
    logAction(userId, 'logout', 'Users', userId, 'User logged out');
    res.json({ message: 'Logout successful' });
  });
});

// Get all users (admin only)
router.get('/', authMiddleware(['admin']), (req, res) => {
  db.query('SELECT user_id, username, email, phone_number, role, status FROM Users', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Unable to fetch users' });
    }
    res.json(results);
  });
});

// Delete user with logs
router.delete('/delete-user-with-logs/:userId', authMiddleware(['admin']), (req, res) => {
  const userId = req.params.userId;

  const deleteLogsQuery = 'DELETE FROM activity_log WHERE user_id = ?';
  const deleteUserQuery = 'DELETE FROM Users WHERE user_id = ?';

  db.query(deleteLogsQuery, [userId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error deleting activity logs' });
    }

    db.query(deleteUserQuery, [userId], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ error: 'Error deleting user' });
      }

      return res.json({ message: `User ${userId} and related logs deleted.` });
    });
  });
});

module.exports = router;
