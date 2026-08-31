const express = require('express');
const router = express.Router();
const { login, demoLogin, register, getMe } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/register', register);
router.get('/me', authenticate, getMe);

module.exports = router;
