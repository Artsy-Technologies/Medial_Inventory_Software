const express = require('express');
const router = express.Router();
const {
  createStockRule,
  getAllStockRules,
  getStockRuleById,
  updateStockRule,
  deleteStockRule
} = require('../controllers/stockRuleController');

router.post('/stock-rule', createStockRule);
router.get('/stock-rules', getAllStockRules);
router.get('/stock-rule/:id', getStockRuleById);
router.put('/stock-rule/:id', updateStockRule);
router.delete('/stock-rule/:id', deleteStockRule);

module.exports = router;
