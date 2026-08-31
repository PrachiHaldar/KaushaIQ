const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  updateTargetCareer,
  updateStudentSkill,
  recalculateReadiness
} = require('../controllers/students.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/dashboard', getStudentDashboard);
router.post('/target-career', updateTargetCareer);
router.post('/skills', updateStudentSkill);
router.post('/recalculate', recalculateReadiness);

module.exports = router;
