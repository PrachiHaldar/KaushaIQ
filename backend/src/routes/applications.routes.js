const express = require('express');
const router = express.Router();
const {
  applyToOpportunity,
  getMyApplications,
  updateApplicationStatus
} = require('../controllers/applications.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);

router.post('/apply', authorize(['STUDENT']), applyToOpportunity);
router.get('/my', authorize(['STUDENT']), getMyApplications);
router.patch('/:applicationId/status', authorize(['INDUSTRY', 'ADMIN']), updateApplicationStatus);

module.exports = router;
