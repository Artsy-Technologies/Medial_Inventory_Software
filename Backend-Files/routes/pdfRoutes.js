const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { generatePOPdf } = require('../controllers/generatePOPdf');
const logAction = require('../middleware/logger');

router.post('/generate-po-pdf', authMiddleware(['admin', 'user']), async (req, res) => {
  try {
    const fileBuffer = await generatePOPdf(req.body);

    logAction(req.session.user_id, 'generate', 'PurchaseOrders', null, 'Generated PO PDF');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=PurchaseOrder.pdf');
    res.send(fileBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
