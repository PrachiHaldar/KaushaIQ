const express = require('express');
const router = express.Router();
const {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity
} = require('../controllers/opportunities.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/', optionalAuth, getAllOpportunities);
router.get('/:id', optionalAuth, getOpportunityById);
router.post('/create', authenticate, authorize(['INDUSTRY', 'ADMIN']), createOpportunity);

module.exports = router;
