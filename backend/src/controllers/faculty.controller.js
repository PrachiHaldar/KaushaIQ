const prisma = require('../config/db');

// Get Faculty Dashboard & Academic Metrics
const getFacultyDashboard = async (req, res, next) => {
  try {
    const faculty = await prisma.facultyProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        domain: true,
        department: true,
        institution: true,
        learningModules: {
          include: {
            quizzes: true,
            notes: true,
            lectures: true
          }
        },
        createdProjects: {
          include: { submissions: true }
        }
      }
    });

    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found.' });
    }

    // Pending student skills awaiting verification
    const pendingVerifications = await prisma.studentSkill.findMany({
      where: { verificationLevel: 'ASSESSED' },
      include: {
        student: { include: { user: true, department: true } },
        skill: true
      },
      take: 8
    });

    res.json({
      success: true,
      data: {
        profile: faculty,
        modules: faculty.learningModules,
        projects: faculty.createdProjects,
        pendingVerifications
      }
    });
  } catch (error) {
    next(error);
  }
};

// Faculty verifies a student skill
const verifyStudentSkill = async (req, res, next) => {
  try {
    const { studentId, skillId, remarks = 'Academic competency verified through lab assessments.' } = req.body;

    const studentSkill = await prisma.studentSkill.update({
      where: {
        studentId_skillId: {
          studentId,
          skillId
        }
      },
      data: {
        verificationLevel: 'FACULTY_VERIFIED',
        verifiedByUserId: req.user.id,
        verifiedAt: new Date()
      }
    });

    await prisma.skillVerification.create({
      data: {
        studentId,
        skillId,
        verifierId: req.user.id,
        verifierRole: 'FACULTY',
        verificationType: 'FACULTY_VERIFIED',
        remarks
      }
    });

    res.json({
      success: true,
      message: 'Student skill successfully verified by Faculty.',
      data: studentSkill
    });
  } catch (error) {
    next(error);
  }
};

// Update faculty research & achievements
const updateFacultyProfile = async (req, res, next) => {
  try {
    const { designation, researchInterests, publicationsCount, patentsCount, fdpCount, consultancyCount } = req.body;

    const updated = await prisma.facultyProfile.update({
      where: { userId: req.user.id },
      data: {
        designation,
        researchInterests,
        publicationsCount: parseInt(publicationsCount, 10),
        patentsCount: parseInt(patentsCount, 10),
        fdpCount: parseInt(fdpCount, 10),
        consultancyCount: parseInt(consultancyCount, 10)
      }
    });

    res.json({ success: true, message: 'Faculty profile updated.', data: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFacultyDashboard,
  verifyStudentSkill,
  updateFacultyProfile
};
