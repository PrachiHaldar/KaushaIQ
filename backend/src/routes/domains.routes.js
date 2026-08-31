const express = require('express');
const router = express.Router();
const { getAllDomains, getDomainBySlug } = require('../controllers/domains.controller');

router.get('/', getAllDomains);
router.get('/:slug', getDomainBySlug);

module.exports = router;
