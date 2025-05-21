const db = require('../db/db');

// POST /api/signup
exports.signup = (req, res) => {
  const { username, password } = req.body;

  const query = 'INSERT INTO USERS (username, password) VALUES (?, ?);';

  db.query(query, [username, password], (err, results) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'DB error' })
    };

    if (results.length === 0) {
      return res.status(401).json({ error: 'Something went wrong!' });
    };

    req.session.user = results[0];
    res.json({ message: 'Signup successful', user: results[0] });
  });
};

// POST /api/login
exports.login = (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'DB error' })
    };

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    };

    req.session.user = results[0];
    res.json({ message: 'Login successful', user: results[0] });
  });
};

// GET /api/logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
};

// GET /api/delete-acc
exports.deleteAcc = (req, res) => {
  const {username, password} = req.body;

  const query = 'DELETE FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'DB error' });
    }

    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'Logout failed' });
      }

      res.clearCookie('connect.sid');
      res.json({ message: 'Account deleted successfully' });
    });
  });
};


// GET /api/check-auth
exports.checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
};
