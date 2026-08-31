const prisma = require('../config/db');
const { analyzeStudentSkillGaps } = require('../services/skillGapEngine.service');

// Get full student dashboard data
const getStudentDashboard = async (req, res, next) => {
  try {
    const student = await prisma.studentProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        user: { select: { name: true, email: true, avatar: true } },
        domain: true,
        department: true,
        institution: true,
        targetCareer: {
          include: { skillRequirements: { include: { skill: true } } }
        },
        skills: {
          include: { skill: { include: { category: true } } },
          orderBy: { currentScore: 'desc' }
        },
        skillGaps: {
          include: { skill: true },
          orderBy: { gapScore: 'desc' }
        },
        projectSubmissions: {
          include: { project: { include: { industry: true } } },
          orderBy: { submittedAt: 'desc' }
        },
        applications: {
          include: { opportunity: { include: { organization: true } } },
          orderBy: { appliedAt: 'desc' }
        },
        certifications: true
      }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    // Dynamic Readiness Score & Breakdown
    const readinessData = {
      score: student.readinessScore,
      breakdown: [
        { label: 'Technical Skills', score: student.technicalScore, target: 85, color: '#6366F1' },
        { label: 'Domain Knowledge', score: student.domainScore, target: 80, color: '#06B6D4' },
        { label: 'Soft Skills', score: student.softSkillsScore, target: 75, color: '#10B981' },
        { label: 'Projects & Labs', score: student.projectsScore, target: 80, color: '#F59E0B' },
        { label: 'Certifications', score: student.certificationsScore, target: 70, color: '#8B5CF6' },
        { label: 'Industry Exposure', score: student.industryExposureScore, target: 65, color: '#EC4899' }
      ]
    };

    res.json({
      success: true,
      data: {
        profile: student,
        readiness: readinessData,
        targetCareer: student.targetCareer,
        skills: student.skills,
        skillGaps: student.skillGaps,
        projects: student.projectSubmissions,
        applications: student.applications,
        certifications: student.certifications
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update target career & recalculate gaps
const updateTargetCareer = async (req, res, next) => {
  try {
    const { careerPathId } = req.body;
    const student = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });

    await prisma.studentProfile.update({
      where: { id: student.id },
      data: { targetCareerId: careerPathId }
    });

    const analysis = await analyzeStudentSkillGaps(student.id, careerPathId);

    res.json({
      success: true,
      message: 'Target career updated and skill gaps recalculated.',
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// Update a single skill or add skill
const updateStudentSkill = async (req, res, next) => {
  try {
    const { skillId, currentScore, verificationLevel = 'ASSESSED' } = req.body;
    const student = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });

    const updatedSkill = await prisma.studentSkill.upsert({
      where: {
        studentId_skillId: {
          studentId: student.id,
          skillId
        }
      },
      update: {
        currentScore: Math.min(100, Math.max(0, parseInt(currentScore, 10))),
        verificationLevel
      },
      create: {
        studentId: student.id,
        skillId,
        currentScore: Math.min(100, Math.max(0, parseInt(currentScore, 10))),
        verificationLevel
      }
    });

    // Re-run gap analysis to update readiness score
    const analysis = await analyzeStudentSkillGaps(student.id, student.targetCareerId);

    res.json({
      success: true,
      message: 'Skill updated successfully.',
      data: {
        skill: updatedSkill,
        readinessScore: analysis.readinessScore
      }
    });
  } catch (error) {
    next(error);
  }
};

// Force recalculate readiness score
const recalculateReadiness = async (req, res, next) => {
  try {
    const student = await prisma.studentProfile.findUnique({ where: { userId: req.user.id } });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found.' });

    const analysis = await analyzeStudentSkillGaps(student.id, student.targetCareerId);

    res.json({
      success: true,
      message: 'Readiness and gaps successfully recalculated.',
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentDashboard,
  updateTargetCareer,
  updateStudentSkill,
  recalculateReadiness
};
