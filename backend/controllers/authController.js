const db = require('../db/db');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const { username, email, phone_number, password, role = 'user' } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const query = `INSERT INTO Users (username, email, phone_number, password_hash, role) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [username, email, phone_number, password_hash, role]);

    res.status(201).json({ message: 'User registered', userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query(`SELECT * FROM Users WHERE username = ? AND is_deleted = 0`, [username]);

    if (!users.length) return res.status(404).json({ error: 'User not found' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    req.session.user = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    };

    res.json({ message: 'Login successful', user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
};

exports.checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.session.user?.user_id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    await db.query(`UPDATE Users SET is_deleted = 1, status = 'inactive' WHERE user_id = ?`, [userId]);
    req.session.destroy(() => res.json({ message: 'Account deleted' }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Account deletion failed' });
  }
};
