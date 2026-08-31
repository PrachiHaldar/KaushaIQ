const express = require('express');
const router = express.Router();
const { askCareerCopilot, askStudyAssistant } = require('../controllers/ai.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.post('/career-copilot', optionalAuth, askCareerCopilot);
router.post('/study-assistant', optionalAuth, askStudyAssistant);

module.exports = router;
