const express = require('express');
const router = express.Router();
const { getMatchExplanation } = require('../controllers/matching.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/explain/:opportunityId', authenticate, getMatchExplanation);

module.exports = router;
