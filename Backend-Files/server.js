// server.js or index.js

require('dotenv').config();
const app = require('./app');
const cron = require('node-cron');
const { runCleanup } = require('./controllers/cleanupController');

// Start Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});

// Schedule cleanup: 1st Jan & 1st July at 12:00 AM
cron.schedule('0 0 1 1,7 *', async () => {
  console.log('🧹 Running scheduled soft-delete cleanup...');

  try {
    await runCleanup(false); // false = only soft deletes
    console.log(' Cleanup completed successfully.');
  } catch (err) {
    console.error(' Cleanup failed:', err.message);
  }
});
