const express = require('express');
const router = express.Router();
const { runCleanup } = require('../controllers/cleanupController');
const authMiddleware = require('../middleware/authMiddleware'); // Add this line if you want access control

// POST: Run cleanup (manual trigger, admin only)
router.post('/run', authMiddleware(['admin']), async (req, res) => {
  try {
    await runCleanup(false); // false = actual delete
    res.json({ message: 'Cleanup executed successfully.' });
  } catch (error) {
    console.error('Cleanup Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET: Run cleanup in test mode (dry run)
router.get('/test', authMiddleware(['admin']), async (req, res) => {
  try {
    await runCleanup(true); // true = test mode
    res.json({ message: 'Test mode completed. Check console for output.' });
  } catch (error) {
    console.error('Test Cleanup Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
