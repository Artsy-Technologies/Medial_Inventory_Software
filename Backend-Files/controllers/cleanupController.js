const db = require('../db/db');

// Clean a specific table: permanently delete soft-deleted records older than 6 months
async function cleanTable(tableName, primaryKey, isTest = false) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 6);

  const selectQuery = `
    SELECT ${primaryKey} AS id
    FROM ${tableName}
    WHERE is_deleted = 1 AND updated_at < ?
  `;

  const deleteQuery = `
    DELETE FROM ${tableName}
    WHERE ${primaryKey} = ?
  `;

  const insertLogQuery = `
    INSERT INTO Deletion_Log (table_name, record_id, deleted_by, deleted_at)
    VALUES (?, ?, 'SYSTEM', NOW())
  `;

  try {
    const [rows] = await db.promise().query(selectQuery, [cutoffDate]);

    if (rows.length === 0) {
      console.log(` No stale records to delete in ${tableName}`);
      return;
    }

    for (const row of rows) {
      const recordId = row.id;

      if (isTest) {
        console.log(` [TEST] Would delete from ${tableName}, ID: ${recordId}`);
        continue;
      }

      const connection = await db.promise().getConnection();
      try {
        await connection.beginTransaction();

        // Log deletion
        await connection.query(insertLogQuery, [tableName, recordId]);

        // Delete the record
        await connection.query(deleteQuery, [recordId]);

        await connection.commit();
        console.log(`  Deleted from ${tableName}, ID: ${recordId}`);
      } catch (err) {
        await connection.rollback();
        console.error(`  Transaction failed for ${tableName}, ID: ${recordId}:`, err.message);
      } finally {
        connection.release();
      }
    }
  } catch (err) {
    console.error(`  Error cleaning ${tableName}:`, err.message);
  }
}

// Master Cleanup Function
exports.runCleanup = async (isTest = false) => {
  console.log(`\n Starting ${isTest ? '[TEST] ' : ''}scheduled cleanup...`);

  const tablesToClean = [
    { name: 'Users', key: 'user_id' },
    { name: 'Vendors', key: 'vendor_id' },
    { name: 'Items', key: 'item_id' },
    { name: 'Purchase_Orders', key: 'po_id' },
  ];

  for (const table of tablesToClean) {
    await cleanTable(table.name, table.key, isTest);
  }

  console.log(`\n Cleanup ${isTest ? '[TEST] ' : ''}process finished.\n`);
};
