const prisma = require('../config/db');

/**
 * Recalculate student skill gaps and aggregate readiness score
 */
async function analyzeStudentSkillGaps(studentId, targetCareerId) {
  const student = await prisma.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      skills: { include: { skill: true } },
      projectSubmissions: { include: { project: true, evaluations: true } },
      certifications: true
    }
  });

  if (!student) throw new Error('Student profile not found');

  const careerId = targetCareerId || student.targetCareerId;
  if (!careerId) {
    return { gaps: [], readinessScore: student.readinessScore };
  }

  const careerRequirements = await prisma.careerSkillRequirement.findMany({
    where: { careerPathId: careerId },
    include: { skill: true }
  });

  const calculatedGaps = [];
  let totalTarget = 0;
  let totalCurrent = 0;

  for (const req of careerRequirements) {
    const sSkill = student.skills.find((s) => s.skillId === req.skillId);
    const currentScore = sSkill ? sSkill.currentScore : 0;
    const requiredScore = req.requiredScore;
    const gapScore = requiredScore - currentScore;

    let severity = 'STRONG';
    let action = 'Maintain proficiency and participate in advanced industry challenges.';

    if (gapScore > 20) {
      severity = 'CRITICAL';
      action = `Urgent remediation: Complete learning module and submit capstone project for ${req.skill.name}.`;
    } else if (gapScore > 0) {
      severity = 'MODERATE';
      action = `Review practice notes and complete intermediate assessment for ${req.skill.name}.`;
    }

    calculatedGaps.push({
      studentId: student.id,
      careerPathId: careerId,
      skillId: req.skillId,
      skillName: req.skill.name,
      currentScore,
      requiredScore,
      gapScore,
      severity,
      recommendedAction: action
    });

    totalTarget += requiredScore;
    totalCurrent += Math.min(currentScore, requiredScore);
  }

  // Update SkillGap table in DB
  for (const gap of calculatedGaps) {
    await prisma.skillGap.upsert({
      where: {
        studentId_careerPathId_skillId: {
          studentId: gap.studentId,
          careerPathId: gap.careerPathId,
          skillId: gap.skillId
        }
      },
      update: {
        currentScore: gap.currentScore,
        requiredScore: gap.requiredScore,
        gapScore: gap.gapScore,
        severity: gap.severity,
        recommendedAction: gap.recommendedAction
      },
      create: {
        studentId: gap.studentId,
        careerPathId: gap.careerPathId,
        skillId: gap.skillId,
        currentScore: gap.currentScore,
        requiredScore: gap.requiredScore,
        gapScore: gap.gapScore,
        severity: gap.severity,
        recommendedAction: gap.recommendedAction
      }
    });
  }

  // Recompute aggregate Readiness Score (0 - 100)
  // Technical (35%) + Domain (25%) + Soft Skills (15%) + Projects (15%) + Certifications (10%)
  const skillRatio = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 60;
  
  // Calculate verified projects score
  const evaluatedSubmissions = student.projectSubmissions.filter((p) => p.status === 'EVALUATED');
  let projScore = student.projectsScore;
  if (evaluatedSubmissions.length > 0) {
    const avgGrade = evaluatedSubmissions.reduce((acc, curr) => acc + (curr.grade || 4.0), 0) / evaluatedSubmissions.length;
    projScore = Math.min(95, Math.round((avgGrade / 5.0) * 100));
  }

  const updatedReadiness = Math.min(100, Math.round(
    skillRatio * 0.40 +
    student.domainScore * 0.20 +
    student.softSkillsScore * 0.15 +
    projScore * 0.15 +
    student.certificationsScore * 0.10
  ));

  const updatedStudent = await prisma.studentProfile.update({
    where: { id: studentId },
    data: {
      readinessScore: updatedReadiness,
      technicalScore: Math.round(skillRatio),
      projectsScore: projScore
    }
  });

  return {
    gaps: calculatedGaps,
    readinessScore: updatedStudent.readinessScore,
    technicalScore: updatedStudent.technicalScore,
    projectsScore: updatedStudent.projectsScore
  };
}

module.exports = { analyzeStudentSkillGaps };
