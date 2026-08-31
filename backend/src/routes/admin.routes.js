const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  createDomain,
  createSkill,
  createCareerPath
} = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

router.use(authenticate);
router.use(authorize(['ADMIN']));

router.get('/overview', getAdminOverview);
router.post('/domains', createDomain);
router.post('/skills', createSkill);
router.post('/careers', createCareerPath);

module.exports = router;
