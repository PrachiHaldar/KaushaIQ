const {
  getInstitutionAnalytics,
  getIndustryAnalytics,
  getCrossDomainSkillIntelligence
} = require('../services/analyticsService.service');

const getInstitutionStats = async (req, res, next) => {
  try {
    const institutionId = req.user?.institutionProfile?.id;
    const stats = await getInstitutionAnalytics(institutionId);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const getIndustryStats = async (req, res, next) => {
  try {
    const stats = await getIndustryAnalytics();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

const getSkillIntelligence = async (req, res, next) => {
  try {
    const intelligence = await getCrossDomainSkillIntelligence(req.query);
    res.json({ success: true, data: intelligence });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstitutionStats,
  getIndustryStats,
  getSkillIntelligence
};
