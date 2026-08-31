const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const prisma = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        studentProfile: {
          include: { domain: true, department: true, targetCareer: true }
        },
        facultyProfile: {
          include: { domain: true, department: true, institution: true }
        },
        industryProfile: {
          include: { domain: true }
        },
        institutionProfile: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User session invalid or user not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          studentProfile: true,
          facultyProfile: true,
          industryProfile: true,
          institutionProfile: true
        }
      });
      req.user = user;
    }
  } catch (e) {
    // Ignore invalid token in optionalAuth
  }
  next();
};

module.exports = { authenticate, optionalAuth };
