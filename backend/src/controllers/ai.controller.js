const { generateCareerCopilotResponse, generateStudyAssistantResponse } = require('../services/aiCopilotService.service');
const prisma = require('../config/db');

// AI Career Copilot Query
const askCareerCopilot = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    let studentProfile = null;
    if (req.user && req.user.studentProfile) {
      studentProfile = await prisma.studentProfile.findUnique({
        where: { id: req.user.studentProfile.id },
        include: {
          user: true,
          domain: true,
          targetCareer: true,
          skills: { include: { skill: true } }
        }
      });
    }

    const response = await generateCareerCopilotResponse(studentProfile || {}, prompt);
    res.json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
};

// AI Study Assistant Query
const askStudyAssistant = async (req, res, next) => {
  try {
    const { moduleId, action, question } = req.body;
    const response = await generateStudyAssistantResponse(moduleId, action, question);
    res.json({ success: true, data: response });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askCareerCopilot,
  askStudyAssistant
};
