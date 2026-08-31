const express = require('express');
const router = express.Router();
const { getInstitutionDashboard, createIntervention } = require('../controllers/institution.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);

router.get('/dashboard', authorize(['INSTITUTION', 'ADMIN']), getInstitutionDashboard);
router.post('/interventions', authorize(['INSTITUTION', 'ADMIN']), createIntervention);

module.exports = router;
