const prisma = require('../config/db');
const { getIndustryAnalytics } = require('../services/analyticsService.service');

// Get Industry Dashboard
const getIndustryDashboard = async (req, res, next) => {
  try {
    const analytics = await getIndustryAnalytics();

    const opportunities = await prisma.opportunity.findMany({
      include: {
        domain: true,
        applications: {
          include: {
            student: { include: { user: { select: { name: true, avatar: true, email: true } }, institution: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const projects = await prisma.project.findMany({
      include: {
        domain: true,
        submissions: {
          include: {
            student: { include: { user: { select: { name: true, avatar: true } } } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: {
        analytics,
        opportunities,
        projects
      }
    });
  } catch (error) {
    next(error);
  }
};

// Candidate Discovery with Dynamic Multi-Filter & Compatibility Matching (CRITICAL STEP 9)
const getCandidateDiscovery = async (req, res, next) => {
  try {
    const { domainId, skillSlug, minReadiness, verifiedOnly, search } = req.query;

    const where = {};
    if (domainId) where.domainId = domainId;
    if (minReadiness) where.readinessScore = { gte: parseInt(minReadiness, 10) };

    const students = await prisma.studentProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        domain: true,
        department: true,
        institution: true,
        targetCareer: true,
        skills: {
          include: { skill: true }
        },
        projectSubmissions: {
          include: { project: true }
        },
        certifications: true,
        industryEvaluations: true
      },
      orderBy: { readinessScore: 'desc' }
    });

    let candidates = students.map((s) => {
      const verifiedSkillsCount = s.skills.filter((sk) => sk.verificationLevel !== 'SELF_DECLARED').length;
      const completedProjectsCount = s.projectSubmissions.filter((p) => p.status === 'EVALUATED').length;
      
      // Calculate dynamic compatibility
      const compatibility = Math.min(96, Math.max(50, Math.round(s.readinessScore * 1.05)));

      return {
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        email: s.user.email,
        avatar: s.user.avatar,
        domain: s.domain?.name,
        institution: s.institution?.institutionName || 'NIT Surathkal',
        degree: s.degree,
        currentYear: s.currentYear,
        targetCareer: s.targetCareer?.name,
        readinessScore: s.readinessScore,
        compatibilityScore: compatibility,
        verifiedSkillsCount,
        completedProjectsCount,
        certificationsCount: s.certifications.length,
        skills: s.skills.map((sk) => ({
          name: sk.skill.name,
          score: sk.currentScore,
          verification: sk.verificationLevel
        })),
        passportCode: s.passportCode
      };
    });

    if (search) {
      const q = search.toLowerCase();
      candidates = candidates.filter((c) => c.name.toLowerCase().includes(q) || (c.targetCareer && c.targetCareer.toLowerCase().includes(q)));
    }

    if (verifiedOnly === 'true') {
      candidates = candidates.filter((c) => c.verifiedSkillsCount >= 2 || c.completedProjectsCount >= 1);
    }

    res.json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIndustryDashboard,
  getCandidateDiscovery
};
