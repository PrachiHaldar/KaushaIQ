const prisma = require('../config/db');
const { analyzeStudentSkillGaps } = require('../services/skillGapEngine.service');

// Get all learning modules
const getAllModules = async (req, res, next) => {
  try {
    const { domainId, skillId, level, search } = req.query;

    const where = {};
    if (domainId) where.domainId = domainId;
    if (skillId) where.skillId = skillId;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { overview: { contains: search } }
      ];
    }

    const modules = await prisma.learningModule.findMany({
      where,
      include: {
        domain: true,
        skill: true,
        facultyAuthor: { include: { user: { select: { name: true, avatar: true } } } },
        quizzes: { select: { id: true, title: true } },
        notes: { select: { id: true, title: true, readTimeMinutes: true } },
        lectures: { select: { id: true, title: true, durationMinutes: true } }
      },
      orderBy: { publishedAt: 'desc' }
    });

    res.json({ success: true, data: modules });
  } catch (error) {
    next(error);
  }
};

// Get single module by slug
const getModuleBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const moduleData = await prisma.learningModule.findUnique({
      where: { slug },
      include: {
        domain: true,
        skill: true,
        facultyAuthor: {
          include: {
            user: { select: { name: true, avatar: true, email: true } },
            institution: true
          }
        },
        notes: true,
        lectures: { orderBy: { orderIndex: 'asc' } },
        quizzes: {
          include: {
            questions: true
          }
        },
        assignments: true
      }
    });

    if (!moduleData) {
      return res.status(404).json({ success: false, message: 'Learning module not found.' });
    }

    res.json({ success: true, data: moduleData });
  } catch (error) {
    next(error);
  }
};

// Submit Quiz & update skill score automatically
const submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body; // answers = { [questionId]: 'B', ... }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
        module: { include: { skill: true } }
      }
    });

    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

    let correctCount = 0;
    const questionResults = quiz.questions.map((q) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctOption;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        questionText: q.questionText,
        selectedOption: selected,
        correctOption: q.correctOption,
        isCorrect,
        explanation: q.explanation
      };
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / (totalQuestions || 1)) * 100);
    const isPassed = percentage >= quiz.passingScore;

    let updatedReadiness = null;

    // If user is a student, record submission and boost skill score
    if (req.user && req.user.studentProfile) {
      const studentId = req.user.studentProfile.id;

      await prisma.quizSubmission.create({
        data: {
          studentId,
          quizId: quiz.id,
          score: percentage,
          totalQuestions,
          isPassed
        }
      });

      // If passed, upgrade the student's skill score
      if (quiz.module.skillId) {
        const targetSkillScore = Math.max(78, percentage);
        await prisma.studentSkill.upsert({
          where: {
            studentId_skillId: {
              studentId,
              skillId: quiz.module.skillId
            }
          },
          update: {
            currentScore: targetSkillScore,
            verificationLevel: 'ASSESSED'
          },
          create: {
            studentId,
            skillId: quiz.module.skillId,
            currentScore: targetSkillScore,
            verificationLevel: 'ASSESSED'
          }
        });

        // Trigger dynamic gap recalculation
        const gapAnalysis = await analyzeStudentSkillGaps(studentId);
        updatedReadiness = gapAnalysis.readinessScore;
      }
    }

    res.json({
      success: true,
      data: {
        score: percentage,
        correctCount,
        totalQuestions,
        isPassed,
        questionResults,
        updatedReadiness
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new module (Faculty / Industry / Admin)
const createModule = async (req, res, next) => {
  try {
    const { title, domainId, skillId, level, durationHours, overview, description, notes, lectures, quiz } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newModule = await prisma.learningModule.create({
      data: {
        title,
        slug,
        domainId,
        skillId: skillId || null,
        level: level || 'Intermediate',
        durationHours: parseInt(durationHours, 10) || 10,
        authorId: req.user.facultyProfile?.id || null,
        authorRole: req.user.role,
        overview: overview || title,
        description: description || overview || title
      }
    });

    // Add note if provided
    if (notes && notes.length > 0) {
      for (const n of notes) {
        await prisma.note.create({
          data: {
            moduleId: newModule.id,
            title: n.title,
            content: n.content,
            readTimeMinutes: n.readTimeMinutes || 15
          }
        });
      }
    }

    // Add lecture if provided
    if (lectures && lectures.length > 0) {
      for (let i = 0; i < lectures.length; i++) {
        const l = lectures[i];
        await prisma.lecture.create({
          data: {
            moduleId: newModule.id,
            title: l.title,
            videoUrl: l.videoUrl || 'https://www.youtube.com/embed/aircAruvnKk',
            durationMinutes: l.durationMinutes || 20,
            orderIndex: i + 1
          }
        });
      }
    }

    // Add quiz if provided
    if (quiz && quiz.questions && quiz.questions.length > 0) {
      const createdQuiz = await prisma.quiz.create({
        data: {
          moduleId: newModule.id,
          title: quiz.title || `${title} Quiz`,
          passingScore: quiz.passingScore || 70
        }
      });

      for (const q of quiz.questions) {
        await prisma.quizQuestion.create({
          data: {
            quizId: createdQuiz.id,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation || ''
          }
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Learning module created successfully.',
      data: newModule
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllModules,
  getModuleBySlug,
  submitQuiz,
  createModule
};
