const express = require('express');
const router = express.Router();
const sr = require('../controllers/stockRuleController');

router.post('/', sr.createStockRule);
router.get('/', sr.getAllStockRules);
router.get('/:id', sr.getStockRuleById);
router.put('/:id', sr.updateStockRule);
router.delete('/:id', sr.deleteStockRule);

module.exports = router;
