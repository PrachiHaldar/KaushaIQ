const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const jwtConfig = require('../config/jwt');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

// Standard User Login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
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
      return res.status(401).json({ success: false, message: 'Invalid credentials. User does not exist.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user.id, user.role);

    // Remove password hash from response
    const { passwordHash, ...userSafe } = user;

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: userSafe
    });
  } catch (error) {
    next(error);
  }
};

// 1-Click Demo Login Switcher (Student, Faculty, Industry, Institution, Admin)
const demoLogin = async (req, res, next) => {
  try {
    const { role = 'STUDENT' } = req.body;

    let targetEmail = 'rahul.student@kaushiq.edu';
    if (role === 'FACULTY') targetEmail = 'ananya.faculty@kaushiq.edu';
    if (role === 'INDUSTRY') targetEmail = 'technova.industry@kaushiq.com';
    if (role === 'INSTITUTION') targetEmail = 'admin@nit.demo.edu';
    if (role === 'ADMIN') targetEmail = 'admin@kaushiq.gov.in';

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
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
      return res.status(404).json({
        success: false,
        message: `Demo account for role '${role}' not found. Please run seed script.`
      });
    }

    const token = generateToken(user.id, user.role);
    const { passwordHash, ...userSafe } = user;

    res.json({
      success: true,
      message: `Switched demo mode to ${user.name} (${user.role}).`,
      token,
      user: userSafe
    });
  } catch (error) {
    next(error);
  }
};

// Register New User
const register = async (req, res, next) => {
  try {
    const { email, password, name, role = 'STUDENT', domainId, departmentId, institutionId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        role: role.toUpperCase(),
        name
      }
    });

    // Create corresponding profile based on role
    if (newUser.role === 'STUDENT') {
      let assignedDomainId = domainId || null;
      let assignedCareerId = null;

      if (!assignedDomainId) {
        const defaultDomain = (await prisma.domain.findFirst({ where: { slug: 'cs-ai' } })) || (await prisma.domain.findFirst());
        if (defaultDomain) {
          assignedDomainId = defaultDomain.id;
        }
      }

      if (assignedDomainId) {
        const defaultCareer = await prisma.careerPath.findFirst({ where: { domainId: assignedDomainId } });
        if (defaultCareer) {
          assignedCareerId = defaultCareer.id;
        }
      }

      const newStudentProfile = await prisma.studentProfile.create({
        data: {
          userId: newUser.id,
          domainId: assignedDomainId,
          departmentId: departmentId || null,
          institutionId: institutionId || null,
          targetCareerId: assignedCareerId,
          readinessScore: 65,
          technicalScore: 68,
          domainScore: 64,
          softSkillsScore: 78,
          projectsScore: 60,
          certificationsScore: 55,
          industryExposureScore: 50,
          passportCode: `KSH-2026-${newUser.id.slice(0, 8).toUpperCase()}`
        }
      });

      // Initialize baseline skills for the student
      if (assignedDomainId) {
        const initialSkills = await prisma.skill.findMany({
          where: { domainId: assignedDomainId },
          take: 4
        });
        for (const sk of initialSkills) {
          await prisma.studentSkill.create({
            data: {
              studentId: newStudentProfile.id,
              skillId: sk.id,
              currentScore: 65,
              verificationLevel: 'ASSESSED'
            }
          });
        }
      }
    } else if (newUser.role === 'FACULTY') {
      let assignedDomainId = domainId || null;
      if (!assignedDomainId) {
        const defaultDomain = await prisma.domain.findFirst();
        if (defaultDomain) assignedDomainId = defaultDomain.id;
      }
      await prisma.facultyProfile.create({
        data: {
          userId: newUser.id,
          domainId: assignedDomainId,
          departmentId: departmentId || null,
          institutionId: institutionId || null
        }
      });
    } else if (newUser.role === 'INDUSTRY') {
      let assignedDomainId = domainId || null;
      if (!assignedDomainId) {
        const defaultDomain = await prisma.domain.findFirst();
        if (defaultDomain) assignedDomainId = defaultDomain.id;
      }
      await prisma.industryProfile.create({
        data: {
          userId: newUser.id,
          companyName: name,
          domainId: assignedDomainId
        }
      });
    } else if (newUser.role === 'INSTITUTION') {
      await prisma.institutionProfile.create({
        data: {
          userId: newUser.id,
          institutionName: name,
          code: `INST-${Math.floor(1000 + Math.random() * 9000)}`
        }
      });
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        studentProfile: true,
        facultyProfile: true,
        industryProfile: true,
        institutionProfile: true
      }
    });

    const token = generateToken(newUser.id, newUser.role);
    const { passwordHash: _, ...userSafe } = fullUser;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userSafe
    });
  } catch (error) {
    next(error);
  }
};

// Get Current User Profile
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        studentProfile: {
          include: {
            domain: true,
            department: true,
            targetCareer: true,
            skills: { include: { skill: { include: { category: true } } } },
            skillGaps: { include: { skill: true } }
          }
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
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { passwordHash, ...userSafe } = user;
    res.json({ success: true, user: userSafe });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  demoLogin,
  register,
  getMe
};
