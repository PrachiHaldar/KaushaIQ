const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const studentsRoutes = require('./students.routes');
const facultyRoutes = require('./faculty.routes');
const industryRoutes = require('./industry.routes');
const institutionRoutes = require('./institution.routes');
const adminRoutes = require('./admin.routes');
const domainsRoutes = require('./domains.routes');
const skillsRoutes = require('./skills.routes');
const learningRoutes = require('./learning.routes');
const opportunitiesRoutes = require('./opportunities.routes');
const projectsRoutes = require('./projects.routes');
const applicationsRoutes = require('./applications.routes');
const matchingRoutes = require('./matching.routes');
const passportRoutes = require('./passport.routes');
const aiRoutes = require('./ai.routes');
const analyticsRoutes = require('./analytics.routes');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'KaushIQ AI Platform (SIH 2026)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/students', studentsRoutes);
router.use('/faculty', facultyRoutes);
router.use('/industry', industryRoutes);
router.use('/institution', institutionRoutes);
router.use('/admin', adminRoutes);
router.use('/domains', domainsRoutes);
router.use('/skills', skillsRoutes);
router.use('/learning', learningRoutes);
router.use('/opportunities', opportunitiesRoutes);
router.use('/projects', projectsRoutes);
router.use('/applications', applicationsRoutes);
router.use('/matching', matchingRoutes);
router.use('/passport', passportRoutes);
router.use('/ai', aiRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
