const prisma = require('../config/db');
const { getInstitutionAnalytics } = require('../services/analyticsService.service');

// Get Institution Dashboard (CRITICAL STEP 10)
const getInstitutionDashboard = async (req, res, next) => {
  try {
    const institutionId = req.user?.institutionProfile?.id;
    const analytics = await getInstitutionAnalytics(institutionId);

    const students = await prisma.studentProfile.findMany({
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        department: true,
        targetCareer: true,
        projectSubmissions: true
      },
      orderBy: { readinessScore: 'desc' },
      take: 10
    });

    res.json({
      success: true,
      data: {
        analytics,
        topStudents: students
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new institutional recommendation or intervention
const createIntervention = async (req, res, next) => {
  try {
    const { title, category, reason, suggestedAction, impactLevel = 'HIGH' } = req.body;
    const institutionId = req.user?.institutionProfile?.id;

    const recommendation = await prisma.recommendation.create({
      data: {
        institutionId: institutionId || null,
        title,
        category: category || 'BOOTCAMP',
        reason,
        suggestedAction,
        impactLevel
      }
    });

    res.status(201).json({
      success: true,
      message: 'Intervention recommendation created successfully.',
      data: recommendation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInstitutionDashboard,
  createIntervention
};
