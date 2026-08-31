/**
 * KaushIQ Deterministic Matching Engine
 *
 * Weight Distribution:
 * - Skill Match: 40%
 * - Domain Match: 20%
 * - Career Interest Alignment: 15%
 * - Eligibility Criteria: 10%
 * - Verified Projects: 10%
 * - Soft Skills Competency: 5%
 */

function calculateOpportunityMatch(studentProfile, opportunity) {
  if (!studentProfile || !opportunity) {
    return {
      matchScore: 50,
      breakdown: { skillMatch: 50, domainMatch: 50, careerMatch: 50, eligibility: 50, projects: 50, softSkills: 50 },
      matchedSkills: [],
      missingSkills: [],
      strengths: [],
      improvementSuggestions: ['Complete profile and assessment to improve match accuracy.']
    };
  }

  const studentSkills = studentProfile.skills || [];
  const requiredSkills = opportunity.skillRequirements || [];

  // 1. Skill Match (40%)
  let skillPoints = 0;
  const matchedSkills = [];
  const missingSkills = [];
  const strengths = [];
  const improvementSuggestions = [];

  if (requiredSkills.length === 0) {
    skillPoints = 80;
  } else {
    let totalSkillRatio = 0;

    for (const req of requiredSkills) {
      const sSkill = studentSkills.find((s) => s.skillId === req.skillId || (s.skill && s.skill.name === req.skill?.name));
      const reqName = req.skill?.name || 'Required Skill';
      const targetScore = req.minScore || 70;

      if (sSkill) {
        const studentScore = sSkill.currentScore || 0;
        const ratio = Math.min(studentScore / targetScore, 1.25);
        totalSkillRatio += ratio;

        if (studentScore >= targetScore) {
          matchedSkills.push({
            name: reqName,
            studentScore,
            requiredScore: targetScore,
            status: 'STRONG',
            verified: sSkill.verificationLevel !== 'SELF_DECLARED'
          });
          strengths.push(`${reqName} (${studentScore}/100) exceeds role requirement of ${targetScore}`);
        } else {
          matchedSkills.push({
            name: reqName,
            studentScore,
            requiredScore: targetScore,
            status: 'NEEDS_IMPROVEMENT',
            verified: sSkill.verificationLevel !== 'SELF_DECLARED'
          });
          improvementSuggestions.push(`Improve ${reqName} from ${studentScore} → ${targetScore} to maximize compatibility.`);
        }
      } else {
        missingSkills.push({
          name: reqName,
          requiredScore: targetScore,
          isMandatory: req.isMandatory
        });
        improvementSuggestions.push(`Acquire baseline competency in ${reqName} (Target: ${targetScore}).`);
      }
    }

    const avgSkillRatio = totalSkillRatio / (requiredSkills.length || 1);
    skillPoints = Math.min(Math.round(avgSkillRatio * 100), 100);
  }

  // 2. Domain Match (20%)
  let domainPoints = 50;
  if (studentProfile.domainId && opportunity.domainId) {
    if (studentProfile.domainId === opportunity.domainId) {
      domainPoints = 100;
    } else {
      domainPoints = 65; // Allied cross-domain
    }
  }

  // 3. Career Interest Alignment (15%)
  let careerPoints = 70;
  if (studentProfile.targetCareer) {
    const careerDomain = studentProfile.targetCareer.domainId;
    if (careerDomain === opportunity.domainId) {
      careerPoints = 95;
    }
  }

  // 4. Eligibility Criteria (10%)
  let eligibilityPoints = 85;
  if (opportunity.minReadinessScore) {
    const studentReadiness = studentProfile.readinessScore || 60;
    if (studentReadiness >= opportunity.minReadinessScore) {
      eligibilityPoints = 100;
    } else {
      const diff = opportunity.minReadinessScore - studentReadiness;
      eligibilityPoints = Math.max(40, 100 - diff * 2);
    }
  }

  // 5. Verified Projects (10%)
  const projectsScore = studentProfile.projectsScore || 50;
  const projectPoints = Math.min(100, Math.round((projectsScore / 80) * 100));

  // 6. Soft Skills (5%)
  const softSkillsScore = studentProfile.softSkillsScore || 75;
  const softSkillsPoints = Math.min(100, softSkillsScore);

  // Compute final weighted composite score (0 - 100)
  const weightedScore = Math.round(
    skillPoints * 0.40 +
    domainPoints * 0.20 +
    careerPoints * 0.15 +
    eligibilityPoints * 0.10 +
    projectPoints * 0.10 +
    softSkillsPoints * 0.05
  );

  const finalMatchScore = Math.min(Math.max(weightedScore, 20), 98);

  return {
    matchScore: finalMatchScore,
    breakdown: {
      skillMatch: skillPoints,
      domainMatch: domainPoints,
      careerMatch: careerPoints,
      eligibility: eligibilityPoints,
      projects: projectPoints,
      softSkills: softSkillsPoints
    },
    matchedSkills,
    missingSkills,
    strengths,
    improvementSuggestions
  };
}

module.exports = { calculateOpportunityMatch };
