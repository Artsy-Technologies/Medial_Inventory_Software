const express = require('express');
const router = express.Router();
const vendor = require('../controllers/vendorController');

router.post('/', vendor.createVendor);
router.get('/', vendor.getAllVendors);
router.get('/:id', vendor.getVendorById);
router.put('/:id', vendor.updateVendor);
router.delete('/:id', vendor.deleteVendor);

module.exports = router;
