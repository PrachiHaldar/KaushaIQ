const express = require('express');
const router = express.Router();
const {
  getInstitutionStats,
  getIndustryStats,
  getSkillIntelligence
} = require('../controllers/analytics.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/institution', optionalAuth, getInstitutionStats);
router.get('/industry', optionalAuth, getIndustryStats);
router.get('/skill-intelligence', getSkillIntelligence);

module.exports = router;
