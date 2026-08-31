const express = require('express');
const router = express.Router();
const {
  getFacultyDashboard,
  verifyStudentSkill,
  updateFacultyProfile
} = require('../controllers/faculty.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);

router.get('/dashboard', authorize(['FACULTY', 'ADMIN']), getFacultyDashboard);
router.post('/verify-skill', authorize(['FACULTY', 'ADMIN']), verifyStudentSkill);
router.put('/profile', authorize(['FACULTY', 'ADMIN']), updateFacultyProfile);

module.exports = router;
