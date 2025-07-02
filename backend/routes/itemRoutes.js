const express = require('express');
const router = express.Router();
const item = require('../controllers/itemController');

router.post('/', item.createItem);
router.get('/', item.getAllItems);
router.get('/:id', item.getItemById);
router.put('/:id', item.updateItem);
router.delete('/:id', item.deleteItem);

module.exports = router;