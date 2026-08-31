const prisma = require('../config/db');
const { calculateOpportunityMatch } = require('../services/matchingEngine.service');

// Get Explainable Matching details for a specific opportunity & student
const getMatchExplanation = async (req, res, next) => {
  try {
    const { opportunityId } = req.params;

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        organization: true,
        domain: true,
        skillRequirements: { include: { skill: true } }
      }
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    let studentProfile = null;
    if (req.user && req.user.studentProfile) {
      studentProfile = await prisma.studentProfile.findUnique({
        where: { id: req.user.studentProfile.id },
        include: {
          skills: { include: { skill: true } },
          targetCareer: true
        }
      });
    }

    const matchResult = calculateOpportunityMatch(studentProfile, opportunity);

    res.json({
      success: true,
      data: {
        opportunityTitle: opportunity.title,
        organizationName: opportunity.organization.companyName,
        matchScore: matchResult.matchScore,
        breakdown: matchResult.breakdown,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills,
        strengths: matchResult.strengths,
        improvementSuggestions: matchResult.improvementSuggestions
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMatchExplanation
};
