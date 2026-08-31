const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectBySlug,
  submitProject,
  evaluateProjectSubmission,
  createProject
} = require('../controllers/projects.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.get('/', optionalAuth, getAllProjects);
router.get('/:slug', optionalAuth, getProjectBySlug);
router.post('/submit', authenticate, authorize(['STUDENT']), submitProject);
router.post('/evaluate', authenticate, authorize(['INDUSTRY', 'FACULTY', 'ADMIN']), evaluateProjectSubmission);
router.post('/create', authenticate, authorize(['INDUSTRY', 'FACULTY', 'ADMIN']), createProject);

module.exports = router;
