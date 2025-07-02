const express = require('express');
const router = express.Router();
const po = require('../controllers/purchaseOrderController');

router.post('/', po.createPO);
router.get('/', po.getAllPOs);
router.get('/:id', po.getPOById);
router.put('/:id', po.updatePO);
router.delete('/:id', po.deletePO);
router.put('/:id/items', po.updatePOItems);

module.exports = router;
