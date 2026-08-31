const prisma = require('../config/db');
const crypto = require('crypto');

async function getStudentPassportData(studentId) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: { select: { name: true, email: true, avatar: true } },
      domain: true,
      department: true,
      institution: true,
      targetCareer: true,
      skills: {
        include: { skill: { include: { category: true } } },
        where: { verificationLevel: { not: 'SELF_DECLARED' } }
      },
      projectSubmissions: {
        where: { status: 'EVALUATED' },
        include: { project: { include: { industry: true } } }
      },
      certifications: {
        where: { verificationStatus: 'VERIFIED' }
      },
      industryEvaluations: {
        include: { industry: true }
      },
      skillVerifications: {
        include: { skill: true }
      }
    }
  });

  if (!student) throw new Error('Student profile not found');

  const passportCode = student.passportCode || `KSH-2026-${student.id.slice(0, 8).toUpperCase()}`;

  // Generate deterministic verification signature
  const hashPayload = `${passportCode}-${student.user.email}-${student.readinessScore}`;
  const verificationHash = crypto.createHash('sha256').update(hashPayload).digest('hex').slice(0, 16);

  return {
    passportCode,
    verificationHash,
    verificationUrl: `/verify-passport/${passportCode}`,
    studentName: student.user.name,
    email: student.user.email,
    avatar: student.user.avatar,
    domain: student.domain?.name || 'Engineering & Technology',
    department: student.department?.name || 'Computer Science',
    institution: student.institution?.institutionName || 'National Institute of Technology',
    degree: student.degree,
    currentYear: student.currentYear,
    employabilityScore: student.readinessScore,
    scoreBreakdown: {
      technical: student.technicalScore,
      domain: student.domainScore,
      softSkills: student.softSkillsScore,
      projects: student.projectsScore,
      certifications: student.certificationsScore,
      industryExposure: student.industryExposureScore
    },
    verifiedSkills: student.skills.map((s) => ({
      name: s.skill.name,
      score: s.currentScore,
      category: s.skill.category?.name || 'Technical',
      verificationLevel: s.verificationLevel,
      updatedAt: s.updatedAt
    })),
    completedProjects: student.projectSubmissions.map((p) => ({
      title: p.project.title,
      grade: p.grade,
      industryPartner: p.project.industry?.companyName || 'Verified Partner',
      evaluatedAt: p.evaluatedAt,
      feedback: p.mentorFeedback
    })),
    verifiedCertifications: student.certifications.map((c) => ({
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialUrl: c.credentialUrl
    })),
    industryEvaluations: student.industryEvaluations.map((e) => ({
      industry: e.industry.companyName,
      rating: e.rating,
      feedback: e.detailedFeedback,
      verifiedSkills: e.verifiedSkills
    })),
    issuedAt: new Date(),
    status: 'AUTHENTICATED_AND_VERIFIED'
  };
}

async function verifyPassportByCode(code) {
  const student = await prisma.studentProfile.findFirst({
    where: { passportCode: code },
    include: {
      user: { select: { name: true, avatar: true } },
      domain: true,
      institution: true,
      skills: {
        include: { skill: true },
        where: { verificationLevel: { not: 'SELF_DECLARED' } }
      },
      projectSubmissions: {
        where: { status: 'EVALUATED' },
        include: { project: { include: { industry: true } } }
      }
    }
  });

  if (!student) {
    return {
      isValid: false,
      message: 'Passport ID not found or unverified.'
    };
  }

  return {
    isValid: true,
    passportCode: student.passportCode,
    studentName: student.user.name,
    institution: student.institution?.institutionName || 'National Institute of Technology',
    domain: student.domain?.name,
    employabilityScore: student.readinessScore,
    verifiedSkillsCount: student.skills.length,
    completedProjectsCount: student.projectSubmissions.length,
    verifiedAt: new Date().toISOString()
  };
}

module.exports = {
  getStudentPassportData,
  verifyPassportByCode
};
