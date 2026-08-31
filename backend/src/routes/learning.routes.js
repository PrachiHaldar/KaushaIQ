const express = require('express');
const router = express.Router();
const {
  getAllModules,
  getModuleBySlug,
  submitQuiz,
  createModule
} = require('../controllers/learning.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/', optionalAuth, getAllModules);
router.get('/:slug', optionalAuth, getModuleBySlug);
router.post('/quiz/submit', authenticate, submitQuiz);
router.post('/create', authenticate, authorize(['FACULTY', 'INDUSTRY', 'ADMIN']), createModule);

module.exports = router;
