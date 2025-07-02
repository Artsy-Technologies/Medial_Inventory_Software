const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.get('/check-auth', auth.checkAuth);
router.delete('/delete-account', auth.deleteAccount);

module.exports = router;
