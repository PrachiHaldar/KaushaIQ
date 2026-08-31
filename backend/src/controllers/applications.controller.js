const prisma = require('../config/db');
const { calculateOpportunityMatch } = require('../services/matchingEngine.service');

// Student applies to an opportunity (CRITICAL DEMO STEP 8)
const applyToOpportunity = async (req, res, next) => {
  try {
    const { opportunityId, coverNote } = req.body;

    if (!req.user.studentProfile) {
      return res.status(403).json({ success: false, message: 'Only students can apply to opportunities.' });
    }

    const studentId = req.user.studentProfile.id;

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
      include: {
        organization: true,
        skillRequirements: { include: { skill: true } }
      }
    });

    if (!opportunity) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    // Check if already applied
    const existing = await prisma.application.findUnique({
      where: {
        studentId_opportunityId: {
          studentId,
          opportunityId
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this opportunity.',
        data: existing
      });
    }

    // Compute match score at time of application
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        skills: { include: { skill: true } },
        targetCareer: true
      }
    });

    const match = calculateOpportunityMatch(studentProfile, opportunity);

    const application = await prisma.application.create({
      data: {
        studentId,
        opportunityId,
        status: 'APPLIED',
        matchScoreAtApplication: match.matchScore,
        coverNote: coverNote || 'Passionate candidate with verified practical skills eager to contribute to core engineering workflows.'
      },
      include: {
        opportunity: { include: { organization: true } }
      }
    });

    // Notify organization
    if (opportunity.organization?.userId) {
      await prisma.notification.create({
        data: {
          userId: opportunity.organization.userId,
          title: '📄 New Candidate Application Received',
          message: `${req.user.name} (${match.matchScore}% Match) applied for ${opportunity.title}.`,
          type: 'INFO',
          link: '/industry/candidates'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: `Successfully applied to ${opportunity.title}! Application status is now APPLIED.`,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// Get current student's application history & timeline
const getMyApplications = async (req, res, next) => {
  try {
    if (!req.user.studentProfile) {
      return res.status(403).json({ success: false, message: 'Only students have personal applications.' });
    }

    const applications = await prisma.application.findMany({
      where: { studentId: req.user.studentProfile.id },
      include: {
        opportunity: {
          include: {
            organization: true,
            domain: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// Update Application Status (Industry / Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // APPLIED, UNDER_REVIEW, SHORTLISTED, INTERVIEW, SELECTED, REJECTED

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        opportunity: true,
        student: { include: { user: true } }
      }
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status.toUpperCase() }
    });

    // Notify student
    await prisma.notification.create({
      data: {
        userId: application.student.userId,
        title: `📢 Application Status Update: ${status}`,
        message: `Your application for ${application.opportunity.title} is now '${status}'.`,
        type: status === 'SELECTED' || status === 'SHORTLISTED' ? 'SUCCESS' : 'INFO',
        link: '/applications'
      }
    });

    res.json({
      success: true,
      message: `Application status updated to ${status}.`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyToOpportunity,
  getMyApplications,
  updateApplicationStatus
};
