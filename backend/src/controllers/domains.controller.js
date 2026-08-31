const prisma = require('../config/db');

// Get all active domains with skill & career counts
const getAllDomains = async (req, res, next) => {
  try {
    const domains = await prisma.domain.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            skills: true,
            careerPaths: true,
            learningModules: true,
            opportunities: true,
            projects: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ success: true, count: domains.length, data: domains });
  } catch (error) {
    next(error);
  }
};

// Get single domain details by slug with skills, careers, modules, and opportunities
const getDomainBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const domain = await prisma.domain.findUnique({
      where: { slug },
      include: {
        departments: true,
        skills: { include: { category: true } },
        careerPaths: {
          include: {
            skillRequirements: { include: { skill: true } }
          }
        },
        learningModules: {
          include: { skill: true, facultyAuthor: { include: { user: true } } }
        },
        opportunities: {
          where: { status: 'OPEN' },
          include: { organization: true }
        },
        projects: {
          where: { status: 'ACTIVE' },
          include: { industry: true }
        }
      }
    });

    if (!domain) {
      return res.status(404).json({ success: false, message: 'Domain not found.' });
    }

    res.json({ success: true, data: domain });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDomains,
  getDomainBySlug
};
