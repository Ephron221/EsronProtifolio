const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', protect, getMe);

module.exports = router;
