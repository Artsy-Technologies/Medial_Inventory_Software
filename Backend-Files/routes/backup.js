const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load env variables for DB credentials
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'neelu5140';
const DB_NAME = process.env.DB_NAME || 'inventory_mgmt';

router.get('/db-backup', (req, res) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dirPath = path.join(__dirname, '../backups');
  const fileName = `backup_${timestamp}.sql`;
  const filePath = path.join(dirPath, fileName);

  // Ensure backups directory exists
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Create writable stream
  const outStream = fs.createWriteStream(filePath);

  // Spawn mysqldump
  const dumpProcess = spawn('mysqldump', [
    '-u', DB_USER,
    `-p${DB_PASS}`,
    DB_NAME
  ]);

  dumpProcess.stdout.pipe(outStream);

  dumpProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  dumpProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Backup process exited with code ${code}`);
      return res.status(500).json({ error: 'Backup failed' });
    }

    console.log(`Backup created: ${fileName}`);
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }

    });
  });
});

module.exports = router;
