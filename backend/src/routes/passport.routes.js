const express = require('express');
const router = express.Router();
const { getMyPassport, verifyPublicPassport } = require('../controllers/passport.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/my', authenticate, getMyPassport);
router.get('/verify/:code', verifyPublicPassport);

module.exports = router;
