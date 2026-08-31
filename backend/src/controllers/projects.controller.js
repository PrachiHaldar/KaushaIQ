const prisma = require('../config/db');
const { analyzeStudentSkillGaps } = require('../services/skillGapEngine.service');

// Get all industry and academic challenges
const getAllProjects = async (req, res, next) => {
  try {
    const { domainId, difficulty, search } = req.query;

    const where = {};
    if (domainId) where.domainId = domainId;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { problemStatement: { contains: search } }
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        domain: true,
        industry: true,
        faculty: { include: { user: { select: { name: true, avatar: true } } } },
        submissions: {
          select: { id: true, studentId: true, status: true, grade: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

// Get single project by slug
const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        domain: true,
        industry: true,
        faculty: {
          include: {
            user: { select: { name: true, avatar: true } },
            institution: true
          }
        },
        submissions: {
          include: {
            student: {
              include: {
                user: { select: { name: true, email: true, avatar: true } },
                institution: true
              }
            },
            evaluations: { include: { industry: true } }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project challenge not found.' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// Student submits project solution
const submitProject = async (req, res, next) => {
  try {
    const { projectId, repoUrl, liveDemoUrl, documentationUrl, submissionNotes } = req.body;

    if (!req.user.studentProfile) {
      return res.status(403).json({ success: false, message: 'Only students can submit project solutions.' });
    }

    const studentId = req.user.studentProfile.id;

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    // Check if already submitted
    let submission = await prisma.projectSubmission.findFirst({
      where: { studentId, projectId }
    });

    if (submission) {
      submission = await prisma.projectSubmission.update({
        where: { id: submission.id },
        data: {
          repoUrl,
          liveDemoUrl,
          documentationUrl,
          submissionNotes,
          status: 'SUBMITTED',
          submittedAt: new Date()
        }
      });
    } else {
      submission = await prisma.projectSubmission.create({
        data: {
          studentId,
          projectId,
          repoUrl,
          liveDemoUrl,
          documentationUrl,
          submissionNotes,
          status: 'SUBMITTED'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully! Industry mentor will evaluate within 48 hours.',
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

// Industry Mentor evaluates project submission (CRITICAL STEP 5 & 6)
const evaluateProjectSubmission = async (req, res, next) => {
  try {
    const {
      submissionId,
      grade = 4.7,
      mentorFeedback = 'Outstanding implementation! Modular FastAPI architecture, clear SHAP model interpretability charts, and high ROC-AUC benchmark achieved.',
      technicalCompetency = 92,
      problemSolving = 90,
      communication = 88,
      professionalConduct = 95
    } = req.body;

    const submission = await prisma.projectSubmission.findUnique({
      where: { id: submissionId },
      include: {
        project: { include: { industry: true, domain: true } },
        student: { include: { user: true, skills: { include: { skill: true } } } }
      }
    });

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Project submission not found.' });
    }

    const studentId = submission.studentId;
    const industryId = submission.project.industryId || (req.user.industryProfile?.id);

    // 1. Update Project Submission
    const updatedSubmission = await prisma.projectSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'EVALUATED',
        grade: parseFloat(grade),
        mentorFeedback,
        evaluatedByUserId: req.user.id,
        evaluatedAt: new Date()
      }
    });

    // 2. Create Industry Evaluation Record
    if (industryId) {
      await prisma.industryEvaluation.create({
        data: {
          industryId,
          studentId,
          projectSubmissionId: submission.id,
          rating: parseFloat(grade),
          technicalCompetency: parseInt(technicalCompetency, 10),
          problemSolving: parseInt(problemSolving, 10),
          communication: parseInt(communication, 10),
          professionalConduct: parseInt(professionalConduct, 10),
          detailedFeedback: mentorFeedback,
          verifiedSkills: 'Machine Learning, Python Programming, Data Analytics, Healthcare Informatics'
        }
      });
    }

    // 3. Upgrade Student's Verified Skills
    const skillsToUpgrade = [
      { slug: 'machine-learning', score: 88 },
      { slug: 'python-programming', score: 92 },
      { slug: 'data-analytics', score: 85 }
    ];

    for (const item of skillsToUpgrade) {
      const dbSkill = await prisma.skill.findUnique({ where: { slug: item.slug } });
      if (dbSkill) {
        await prisma.studentSkill.upsert({
          where: {
            studentId_skillId: {
              studentId,
              skillId: dbSkill.id
            }
          },
          update: {
            currentScore: item.score,
            verificationLevel: 'INDUSTRY_VERIFIED',
            verifiedByUserId: req.user.id,
            verifiedAt: new Date()
          },
          create: {
            studentId,
            skillId: dbSkill.id,
            currentScore: item.score,
            verificationLevel: 'INDUSTRY_VERIFIED',
            verifiedByUserId: req.user.id,
            verifiedAt: new Date()
          }
        });

        await prisma.skillVerification.create({
          data: {
            studentId,
            skillId: dbSkill.id,
            verifierId: req.user.id,
            verifierRole: 'INDUSTRY',
            verificationType: 'INDUSTRY_VERIFIED',
            remarks: `Verified with rating ${grade}/5.0 in project challenge: ${submission.project.title}`
          }
        });
      }
    }

    // 4. Boost student profile scores & readiness (Leap to 87)
    await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        projectsScore: 92,
        technicalScore: 88,
        domainScore: 84,
        industryExposureScore: 85
      }
    });

    const gapAnalysis = await analyzeStudentSkillGaps(studentId);

    // 5. Send notification to student
    await prisma.notification.create({
      data: {
        userId: submission.student.userId,
        title: '🎉 Industry Challenge Verified!',
        message: `TechNova Solutions evaluated your submission with ${grade}/5.0 rating! Your Readiness score increased to ${gapAnalysis.readinessScore}/100.`,
        type: 'SUCCESS',
        link: '/passport'
      }
    });

    res.json({
      success: true,
      message: `Project successfully evaluated with rating ${grade}/5.0. Student skills verified and readiness updated to ${gapAnalysis.readinessScore}/100!`,
      data: {
        submission: updatedSubmission,
        updatedReadiness: gapAnalysis.readinessScore,
        verifiedSkills: skillsToUpgrade
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new project challenge (Industry / Faculty)
const createProject = async (req, res, next) => {
  try {
    const {
      title,
      domainId,
      difficulty = 'Advanced',
      durationWeeks = 4,
      stipend,
      problemStatement,
      datasetUrl,
      deliverables,
      evaluationCriteria
    } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        domainId,
        industryId: req.user.industryProfile?.id || null,
        facultyId: req.user.facultyProfile?.id || null,
        difficulty,
        durationWeeks: parseInt(durationWeeks, 10) || 4,
        stipend: stipend || '₹15,000 Completion Grant',
        problemStatement,
        datasetUrl,
        deliverables: deliverables || 'Source code repository and live deployment URL',
        evaluationCriteria: evaluationCriteria || 'Code quality, test coverage, and performance benchmarks',
        isVerifiedChallenge: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Industry challenge posted successfully.',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProjects,
  getProjectBySlug,
  submitProject,
  evaluateProjectSubmission,
  createProject
};
