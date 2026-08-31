const prisma = require('../config/db');
const { calculateOpportunityMatch } = require('../services/matchingEngine.service');

// Get all opportunities with dynamic match calculation
const getAllOpportunities = async (req, res, next) => {
  try {
    const { type, domainId, locationType, search, minScore } = req.query;

    const where = { status: 'OPEN' };
    if (type) where.type = type.toUpperCase();
    if (domainId) where.domainId = domainId;
    if (locationType) where.locationType = locationType.toUpperCase();
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        organization: true,
        domain: true,
        skillRequirements: { include: { skill: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // If user is a student, compute dynamic match score for each opportunity
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

    const enrichedOpportunities = opportunities.map((opp) => {
      const matchResult = calculateOpportunityMatch(studentProfile, opp);
      return {
        ...opp,
        matchScore: matchResult.matchScore,
        matchBreakdown: matchResult.breakdown,
        matchedSkills: matchResult.matchedSkills,
        missingSkills: matchResult.missingSkills
      };
    });

    // Sort by match score if student is logged in
    if (studentProfile) {
      enrichedOpportunities.sort((a, b) => b.matchScore - a.matchScore);
    }

    res.json({
      success: true,
      count: enrichedOpportunities.length,
      data: enrichedOpportunities
    });
  } catch (error) {
    next(error);
  }
};

// Get single opportunity with explainable match details
const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        organization: true,
        domain: true,
        skillRequirements: { include: { skill: true } },
        applications: {
          select: { id: true, studentId: true, status: true }
        }
      }
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    let matchResult = null;
    let hasApplied = false;
    let applicationStatus = null;

    if (req.user && req.user.studentProfile) {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { id: req.user.studentProfile.id },
        include: {
          skills: { include: { skill: true } },
          targetCareer: true
        }
      });

      matchResult = calculateOpportunityMatch(studentProfile, opportunity);

      const existingApp = opportunity.applications.find(
        (a) => a.studentId === req.user.studentProfile.id
      );
      if (existingApp) {
        hasApplied = true;
        applicationStatus = existingApp.status;
      }
    }

    res.json({
      success: true,
      data: {
        ...opportunity,
        matchScore: matchResult ? matchResult.matchScore : null,
        matchDetails: matchResult,
        hasApplied,
        applicationStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new opportunity (Industry / Admin)
const createOpportunity = async (req, res, next) => {
  try {
    const {
      title,
      type = 'INTERNSHIP',
      domainId,
      location,
      locationType = 'HYBRID',
      duration = '6 Months',
      stipendOrSalary = '₹35,000 / month',
      minReadinessScore = 70,
      eligibilityCriteria,
      description,
      responsibilities,
      requirements,
      openingsCount = 5,
      skillRequirements = [] // [{ skillId, minScore, isMandatory }]
    } = req.body;

    const organizationId = req.user.industryProfile?.id;
    if (!organizationId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Only industry organizations can post opportunities.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newOpp = await prisma.opportunity.create({
      data: {
        title,
        slug,
        type: type.toUpperCase(),
        organizationId: organizationId || (await prisma.industryProfile.findFirst())?.id,
        domainId,
        location: location || 'Bengaluru, India',
        locationType: locationType.toUpperCase(),
        duration,
        stipendOrSalary,
        minReadinessScore: parseInt(minReadinessScore, 10) || 65,
        eligibilityCriteria: eligibilityCriteria || 'Pre-final & Final year students with verified skills.',
        description,
        responsibilities: responsibilities || 'Contribute to core engineering modules.',
        requirements: requirements || 'Strong problem solving and fundamental domain skills.',
        openingsCount: parseInt(openingsCount, 10) || 5,
        status: 'OPEN'
      }
    });

    if (skillRequirements.length > 0) {
      for (const reqSkill of skillRequirements) {
        await prisma.opportunitySkillRequirement.create({
          data: {
            opportunityId: newOpp.id,
            skillId: reqSkill.skillId,
            minScore: reqSkill.minScore || 70,
            isMandatory: reqSkill.isMandatory !== undefined ? reqSkill.isMandatory : true
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Opportunity posted successfully.',
      data: newOpp
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity
};
