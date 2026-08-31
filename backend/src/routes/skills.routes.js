const express = require('express');
const router = express.Router();
const { getAllSkills, getCategories } = require('../controllers/skills.controller');

router.get('/', getAllSkills);
router.get('/categories', getCategories);

module.exports = router;
