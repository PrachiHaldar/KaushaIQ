const prisma = require('../config/db');

// Get Admin Overview & System Telemetry
const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const studentsCount = await prisma.studentProfile.count();
    const facultyCount = await prisma.facultyProfile.count();
    const industryCount = await prisma.industryProfile.count();
    const institutionsCount = await prisma.institutionProfile.count();

    const domainsCount = await prisma.domain.count();
    const skillsCount = await prisma.skill.count();
    const careersCount = await prisma.careerPath.count();
    const opportunitiesCount = await prisma.opportunity.count();
    const projectsCount = await prisma.project.count();
    const applicationsCount = await prisma.application.count();

    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        isVerified: true
      }
    });

    const domains = await prisma.domain.findMany({
      include: {
        skills: true,
        careerPaths: true
      }
    });

    res.json({
      success: true,
      data: {
        counts: {
          totalUsers,
          studentsCount,
          facultyCount,
          industryCount,
          institutionsCount,
          domainsCount,
          skillsCount,
          careersCount,
          opportunitiesCount,
          projectsCount,
          applicationsCount
        },
        recentUsers,
        domains
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create Domain (DYNAMIC DOMAIN-AGNOSTIC EXPANSION)
const createDomain = async (req, res, next) => {
  try {
    const { name, code, icon = 'Layers', description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Domain name and code are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const domain = await prisma.domain.create({
      data: {
        name,
        slug,
        code: code.toUpperCase(),
        icon,
        description: description || `Domain curriculum and skill ecosystem for ${name}.`
      }
    });

    res.status(201).json({
      success: true,
      message: `Domain '${name}' added successfully without code changes.`,
      data: domain
    });
  } catch (error) {
    next(error);
  }
};

// Create Skill
const createSkill = async (req, res, next) => {
  try {
    const { name, categoryId, domainId, difficulty = 'Intermediate', requiredLevel = 70, isTrending = false } = req.body;
    if (!name || !categoryId || !domainId) {
      return res.status(400).json({ success: false, message: 'Skill name, categoryId, and domainId are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${Date.now().toString().slice(-4)}`;

    const skill = await prisma.skill.create({
      data: {
        name,
        slug,
        categoryId,
        domainId,
        difficulty,
        requiredLevel: parseInt(requiredLevel, 10),
        isTrending: Boolean(isTrending)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Skill registered successfully.',
      data: skill
    });
  } catch (error) {
    next(error);
  }
};

// Create Career Path
const createCareerPath = async (req, res, next) => {
  try {
    const { name, domainId, description, averageSalary, demandLevel = 'High', skillRequirements = [] } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const career = await prisma.careerPath.create({
      data: {
        name,
        slug,
        domainId,
        description,
        averageSalary: averageSalary || '₹12-20 LPA',
        demandLevel
      }
    });

    for (const reqSkill of skillRequirements) {
      await prisma.careerSkillRequirement.create({
        data: {
          careerPathId: career.id,
          skillId: reqSkill.skillId,
          requiredScore: reqSkill.requiredScore || 75,
          importanceWeight: reqSkill.importanceWeight || 1.0
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Career path registered successfully.',
      data: career
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminOverview,
  createDomain,
  createSkill,
  createCareerPath
};
