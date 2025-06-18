const express = require('express');
const router = express.Router();
const poController = require('../controllers/poController');

router.post('/', poController.createPO);
router.get('/', poController.getAllPOs);
router.get('/:id', poController.getPOById);
router.put('/:id', poController.updatePO);
router.delete('/:id', poController.deletePO);

module.exports = router;
