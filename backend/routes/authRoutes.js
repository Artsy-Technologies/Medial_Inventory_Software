const express = require('express');
const router = express.Router();
const { signup, login, logout, checkAuth, deleteAcc } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/check-auth', checkAuth);
router.delete('/delete-acc', deleteAcc);

module.exports = router;
