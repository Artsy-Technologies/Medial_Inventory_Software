const express = require('express');
const router = express.Router();
const vendorItem = require('../controllers/vendorItemController');

router.post('/', vendorItem.linkVendorItem);
router.get('/', vendorItem.getAllLinks);
router.get('/vendor/:id', vendorItem.getItemsByVendor);
router.put('/:id', vendorItem.updateVendorItem);
router.delete('/:id', vendorItem.deleteVendorItem);

module.exports = router;
