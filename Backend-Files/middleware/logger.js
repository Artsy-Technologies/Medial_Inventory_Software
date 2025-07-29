// middleware/logger.js

const db = require('../db/db');

/**
 * Logs user activity to the Activity_Log table.
 * 
 * @param {number|string} userId - ID of the user performing the action.
 * @param {string} action - Type of action performed (e.g., 'CREATE', 'UPDATE', 'DELETE').
 * @param {string} tableName - The database table where the action occurred.
 * @param {number|string|null} recordId - ID of the record affected (nullable).
 * @param {string|null} description - Optional description of the action.
 */
function logAction(userId, action, tableName, recordId = null, description = null) {
  const query = `
    INSERT INTO Activity_Log (user_id, action, table_name, record_id, description, timestamp)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(query, [userId, action, tableName, recordId, description], (err) => {
    if (err) {
      console.error(' Error logging action:', err.message);
    } else {
      console.log(` Logged action: ${action} on ${tableName} by User ${userId}`);
    }
  });
}

module.exports = logAction;
