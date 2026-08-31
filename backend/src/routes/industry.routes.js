const express = require('express');
const router = express.Router();
const { getIndustryDashboard, getCandidateDiscovery } = require('../controllers/industry.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);

router.get('/dashboard', authorize(['INDUSTRY', 'ADMIN']), getIndustryDashboard);
router.get('/candidates', authorize(['INDUSTRY', 'FACULTY', 'INSTITUTION', 'ADMIN']), getCandidateDiscovery);

module.exports = router;
