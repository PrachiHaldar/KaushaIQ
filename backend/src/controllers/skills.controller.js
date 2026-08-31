const prisma = require('../config/db');

// Get all universal skills
const getAllSkills = async (req, res, next) => {
  try {
    const { domainId, categoryId, search, trending } = req.query;

    const where = {};
    if (domainId) where.domainId = domainId;
    if (categoryId) where.categoryId = categoryId;
    if (trending === 'true') where.isTrending = true;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const skills = await prisma.skill.findMany({
      where,
      include: {
        category: true,
        domain: true
      },
      orderBy: { name: 'asc' }
    });

    const categories = await prisma.skillCategory.findMany();

    res.json({
      success: true,
      count: skills.length,
      data: {
        skills,
        categories
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all skill categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.skillCategory.findMany({
      include: { _count: { select: { skills: true } } }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSkills,
  getCategories
};
