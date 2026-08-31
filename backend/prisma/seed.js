const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting KaushIQ Database Seeding...');

  // Clean existing tables (order matters for foreign keys)
  await prisma.notification.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.skillVerification.deleteMany();
  await prisma.industryEvaluation.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.application.deleteMany();
  await prisma.opportunitySkillRequirement.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.projectSubmission.deleteMany();
  await prisma.project.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.quizSubmission.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.lecture.deleteMany();
  await prisma.note.deleteMany();
  await prisma.learningModule.deleteMany();
  await prisma.assessmentAttempt.deleteMany();
  await prisma.assessmentQuestion.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.skillGap.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.careerSkillRequirement.deleteMany();
  await prisma.careerPath.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.skillCategory.deleteMany();
  await prisma.department.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.facultyProfile.deleteMany();
  await prisma.industryProfile.deleteMany();
  await prisma.institutionProfile.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  const defaultPasswordHash = await bcrypt.hash('demo123', 10);

  // ----------------------------------------------------
  // 1. DOMAINS (16 Domains)
  // ----------------------------------------------------
  const domainsData = [
    { name: 'Computer Science & Engineering', slug: 'computer-science', code: 'CSE', icon: 'Code', description: 'Software engineering, algorithms, systems, cloud, cyber security & full-stack development.' },
    { name: 'AI & Data Science', slug: 'ai-data-science', code: 'AIDS', icon: 'Brain', description: 'Machine learning, deep learning, NLP, computer vision, data engineering and neural architectures.' },
    { name: 'Mechanical Engineering', slug: 'mechanical-engineering', code: 'MECH', icon: 'Cpu', description: 'Robotics, thermodynamics, CAD/CAM, automotive, mechatronics and manufacturing automation.' },
    { name: 'Civil Engineering', slug: 'civil-engineering', code: 'CIVIL', icon: 'Building2', description: 'Structural design, GIS, smart urban planning, geotechnical and green infrastructure.' },
    { name: 'Electrical & Electronics', slug: 'electrical-electronics', code: 'EEE', icon: 'Zap', description: 'Smart grids, embedded IoT, power electronics, VLSI circuits and renewable energy.' },
    { name: 'Biotechnology & Bio-Informatics', slug: 'biotechnology', code: 'BIOTECH', icon: 'Dna', description: 'Genomics, drug discovery, bioprocess engineering, bio-analytics and synthetic biology.' },
    { name: 'Medicine & Healthcare Sciences', slug: 'medicine-healthcare', code: 'MED', icon: 'HeartPulse', description: 'Clinical research, biomedical informatics, healthcare diagnostics and epidemiology.' },
    { name: 'AYUSH (Ayurveda, Yoga, Unani, Siddha, Homoeopathy)', slug: 'ayush', code: 'AYUSH', icon: 'Sparkles', description: 'Traditional integrative medicine, phytochemistry, herbal formulations and wellness sciences.' },
    { name: 'Commerce & Business Analytics', slug: 'commerce-business', code: 'COMM', icon: 'TrendingUp', description: 'Corporate accounting, financial modeling, e-commerce operations and business intelligence.' },
    { name: 'Finance & FinTech', slug: 'finance-fintech', code: 'FIN', icon: 'DollarSign', description: 'Algorithmic trading, blockchain, risk management, decentralized finance and banking tech.' },
    { name: 'Law & Legal Informatics', slug: 'law-legal', code: 'LAW', icon: 'Scale', description: 'Cyber law, intellectual property, corporate compliance, legal tech and regulatory affairs.' },
    { name: 'Agriculture & Agri-Tech', slug: 'agriculture-agritech', code: 'AGRI', icon: 'Sprout', description: 'Precision agriculture, drone analytics, hydroponics, soil sensor telemetry and agribusiness.' },
    { name: 'Design & Human-Computer Interaction', slug: 'design-hci', code: 'DESIGN', icon: 'Palette', description: 'UI/UX design, generative design, 3D modeling, spatial computing and design systems.' },
    { name: 'Pure Sciences (Physics, Chemistry, Math)', slug: 'pure-sciences', code: 'SCI', icon: 'Atom', description: 'Quantum computing, computational chemistry, mathematical modeling and materials science.' },
    { name: 'Education & EdTech', slug: 'education-edtech', code: 'EDU', icon: 'GraduationCap', description: 'Pedagogy design, learning analytics, adaptive curriculum and cognitive learning sciences.' },
    { name: 'Arts & Social Sciences', slug: 'arts-humanities', code: 'ARTS', icon: 'BookOpen', description: 'Public policy, digital humanities, behavioral economics and cross-cultural communication.' }
  ];

  const domainMap = {};
  for (const d of domainsData) {
    const created = await prisma.domain.create({ data: d });
    domainMap[d.code] = created;
  }
  console.log('✅ Created 16 Domains.');

  // ----------------------------------------------------
  // 2. SKILL CATEGORIES
  // ----------------------------------------------------
  const categoriesData = [
    { name: 'Technical', description: 'Core programming, engineering tools and algorithms' },
    { name: 'Domain', description: 'Subject matter expertise specific to academic fields' },
    { name: 'Soft Skills', description: 'Interpersonal, teamwork and emotional intelligence' },
    { name: 'Professional', description: 'Workplace standards, project management and agile methods' },
    { name: 'Research', description: 'Academic paper writing, experimentation and methodology' },
    { name: 'Leadership', description: 'Team mentorship, strategic thinking and decision making' },
    { name: 'Tools', description: 'Industry software frameworks, IDEs and platforms' },
    { name: 'Problem Solving', description: 'Critical thinking, optimization and root cause analysis' }
  ];

  const categoryMap = {};
  for (const c of categoriesData) {
    const created = await prisma.skillCategory.create({ data: c });
    categoryMap[c.name] = created;
  }
  console.log('✅ Created 8 Skill Categories.');

  // ----------------------------------------------------
  // 3. SKILLS (45+ Universal Skills across Domains)
  // ----------------------------------------------------
  const skillsData = [
    // CSE & AI Skills
    { name: 'Python Programming', slug: 'python-programming', category: 'Technical', domain: 'CSE', difficulty: 'Intermediate', requiredLevel: 80, isTrending: true, demandGrowth: '+38%' },
    { name: 'Machine Learning', slug: 'machine-learning', category: 'Technical', domain: 'AIDS', difficulty: 'Advanced', requiredLevel: 80, isTrending: true, demandGrowth: '+42%' },
    { name: 'SQL & Database Design', slug: 'sql-database-design', category: 'Technical', domain: 'CSE', difficulty: 'Intermediate', requiredLevel: 70, isTrending: false, demandGrowth: '+22%' },
    { name: 'Statistics & Probability', slug: 'statistics-probability', category: 'Domain', domain: 'AIDS', difficulty: 'Intermediate', requiredLevel: 70, isTrending: false, demandGrowth: '+25%' },
    { name: 'Deep Learning & Neural Networks', slug: 'deep-learning', category: 'Technical', domain: 'AIDS', difficulty: 'Advanced', requiredLevel: 85, isTrending: true, demandGrowth: '+48%' },
    { name: 'Cloud Architecture (AWS/Azure)', slug: 'cloud-architecture', category: 'Technical', domain: 'CSE', difficulty: 'Advanced', requiredLevel: 75, isTrending: true, demandGrowth: '+31%' },
    { name: 'React & Frontend Engineering', slug: 'react-frontend', category: 'Technical', domain: 'CSE', difficulty: 'Intermediate', requiredLevel: 75, isTrending: true, demandGrowth: '+28%' },
    { name: 'Data Structures & Algorithms', slug: 'dsa', category: 'Problem Solving', domain: 'CSE', difficulty: 'Advanced', requiredLevel: 85, isTrending: false, demandGrowth: '+20%' },
    { name: 'Cybersecurity & Ethical Hacking', slug: 'cybersecurity', category: 'Technical', domain: 'CSE', difficulty: 'Advanced', requiredLevel: 80, isTrending: true, demandGrowth: '+35%' },
    { name: 'Data Analytics & Power BI', slug: 'data-analytics', category: 'Tools', domain: 'AIDS', difficulty: 'Intermediate', requiredLevel: 75, isTrending: true, demandGrowth: '+36%' },

    // Cross-Domain & Soft Skills
    { name: 'Effective Communication', slug: 'effective-communication', category: 'Soft Skills', domain: 'ARTS', difficulty: 'Beginner', requiredLevel: 65, isTrending: false, demandGrowth: '+18%' },
    { name: 'Scientific Research Methodology', slug: 'research-methodology', category: 'Research', domain: 'SCI', difficulty: 'Advanced', requiredLevel: 75, isTrending: false, demandGrowth: '+24%' },
    { name: 'Analytical Problem Solving', slug: 'problem-solving', category: 'Problem Solving', domain: 'CSE', difficulty: 'Intermediate', requiredLevel: 80, isTrending: false, demandGrowth: '+22%' },
    { name: 'Agile Project Management', slug: 'agile-project-mgmt', category: 'Professional', domain: 'COMM', difficulty: 'Intermediate', requiredLevel: 70, isTrending: false, demandGrowth: '+19%' },
    { name: 'Technical Leadership', slug: 'technical-leadership', category: 'Leadership', domain: 'CSE', difficulty: 'Advanced', requiredLevel: 75, isTrending: false, demandGrowth: '+20%' },

    // Mechanical & Civil
    { name: 'CAD/CAM SolidWorks Design', slug: 'solidworks-cad', category: 'Tools', domain: 'MECH', difficulty: 'Intermediate', requiredLevel: 75, isTrending: false, demandGrowth: '+16%' },
    { name: 'Robotics & ROS2 Automation', slug: 'robotics-ros', category: 'Technical', domain: 'MECH', difficulty: 'Advanced', requiredLevel: 80, isTrending: true, demandGrowth: '+34%' },
    { name: 'Structural Analysis & AutoCAD', slug: 'autocad-structural', category: 'Tools', domain: 'CIVIL', difficulty: 'Intermediate', requiredLevel: 75, isTrending: false, demandGrowth: '+15%' },
    { name: 'GIS & Remote Sensing', slug: 'gis-remote-sensing', category: 'Technical', domain: 'CIVIL', difficulty: 'Intermediate', requiredLevel: 70, isTrending: true, demandGrowth: '+26%' },

    // Electrical & IoT
    { name: 'Embedded Systems & IoT', slug: 'embedded-iot', category: 'Technical', domain: 'EEE', difficulty: 'Advanced', requiredLevel: 80, isTrending: true, demandGrowth: '+30%' },
    { name: 'Smart Grid Power Systems', slug: 'smart-grids', category: 'Domain', domain: 'EEE', difficulty: 'Advanced', requiredLevel: 75, isTrending: true, demandGrowth: '+29%' },

    // Biotech & Medicine & AYUSH
    { name: 'Genomic Data Analytics', slug: 'genomic-analytics', category: 'Technical', domain: 'BIOTECH', difficulty: 'Advanced', requiredLevel: 80, isTrending: true, demandGrowth: '+41%' },
    { name: 'Drug Design & Molecular Docking', slug: 'molecular-docking', category: 'Research', domain: 'BIOTECH', difficulty: 'Advanced', requiredLevel: 85, isTrending: true, demandGrowth: '+37%' },
    { name: 'Clinical Trial Management (GCP)', slug: 'clinical-trials', category: 'Domain', domain: 'MED', difficulty: 'Intermediate', requiredLevel: 75, isTrending: false, demandGrowth: '+21%' },
    { name: 'Biomedical Informatics', slug: 'biomedical-informatics', category: 'Domain', domain: 'MED', difficulty: 'Advanced', requiredLevel: 80, isTrending: true, demandGrowth: '+33%' },
    { name: 'Ayurvedic Phytochemistry', slug: 'ayurvedic-phytochemistry', category: 'Domain', domain: 'AYUSH', difficulty: 'Intermediate', requiredLevel: 75, isTrending: true, demandGrowth: '+28%' },
    { name: 'Standardization of Herbal Formulations', slug: 'herbal-standardization', category: 'Research', domain: 'AYUSH', difficulty: 'Advanced', requiredLevel: 80, isTrending: true, demandGrowth: '+26%' },

    // Finance, Commerce, Law & Agri
    { name: 'Financial Modeling & Valuation', slug: 'financial-modeling', category: 'Domain', domain: 'FIN', difficulty: 'Intermediate', requiredLevel: 75, isTrending: false, demandGrowth: '+24%' },
    { name: 'Blockchain & Smart Contracts', slug: 'blockchain-smart-contracts', category: 'Technical', domain: 'FIN', difficulty: 'Advanced', requiredLevel: 80, isTrending: true, demandGrowth: '+39%' },
    { name: 'Corporate Compliance & IPR Law', slug: 'corporate-ipr-law', category: 'Domain', domain: 'LAW', difficulty: 'Intermediate', requiredLevel: 75, isTrending: false, demandGrowth: '+18%' },
    { name: 'Precision Agriculture & Drone Telemetry', slug: 'precision-agri', category: 'Domain', domain: 'AGRI', difficulty: 'Intermediate', requiredLevel: 75, isTrending: true, demandGrowth: '+32%' },
    { name: 'UI/UX Design Systems (Figma)', slug: 'ui-ux-figma', category: 'Tools', domain: 'DESIGN', difficulty: 'Intermediate', requiredLevel: 75, isTrending: true, demandGrowth: '+29%' }
  ];

  const skillMap = {};
  for (const s of skillsData) {
    const created = await prisma.skill.create({
      data: {
        name: s.name,
        slug: s.slug,
        categoryId: categoryMap[s.category].id,
        domainId: domainMap[s.domain].id,
        description: `Comprehensive industry competency in ${s.name} covering practical implementations, standards and benchmarks.`,
        difficulty: s.difficulty,
        requiredLevel: s.requiredLevel,
        isTrending: s.isTrending,
        demandGrowth: s.demandGrowth
      }
    });
    skillMap[s.slug] = created;
  }
  console.log('✅ Created 32+ Universal Skills.');

  // ----------------------------------------------------
  // 4. CAREER PATHS & SKILL REQUIREMENTS
  // ----------------------------------------------------
  const careersData = [
    {
      name: 'AI / Machine Learning Engineer',
      slug: 'ai-ml-engineer',
      domain: 'AIDS',
      description: 'Designs, trains and productionizes intelligent models, deep neural networks, and scalable inference microservices.',
      averageSalary: '₹14-28 LPA',
      demandLevel: 'Very High',
      requirements: [
        { skill: 'python-programming', required: 80, weight: 1.2 },
        { skill: 'machine-learning', required: 80, weight: 1.5 },
        { skill: 'sql-database-design', required: 70, weight: 1.0 },
        { skill: 'statistics-probability', required: 70, weight: 1.1 },
        { skill: 'deep-learning', required: 75, weight: 1.3 },
        { skill: 'effective-communication', required: 60, weight: 0.8 },
        { skill: 'problem-solving', required: 80, weight: 1.0 }
      ]
    },
    {
      name: 'Full-Stack Cloud Architect',
      slug: 'full-stack-cloud-architect',
      domain: 'CSE',
      description: 'Architects modern cloud-native distributed web systems, REST/GraphQL APIs and microservices.',
      averageSalary: '₹12-24 LPA',
      demandLevel: 'High',
      requirements: [
        { skill: 'python-programming', required: 75, weight: 1.0 },
        { skill: 'react-frontend', required: 80, weight: 1.3 },
        { skill: 'sql-database-design', required: 75, weight: 1.2 },
        { skill: 'cloud-architecture', required: 80, weight: 1.4 },
        { skill: 'dsa', required: 80, weight: 1.1 }
      ]
    },
    {
      name: 'Genomic Bio-Informatics Specialist',
      slug: 'genomic-bioinformatics',
      domain: 'BIOTECH',
      description: 'Analyzes high-throughput NGS genomic sequences and develops computational drug target pipelines.',
      averageSalary: '₹10-20 LPA',
      demandLevel: 'High',
      requirements: [
        { skill: 'python-programming', required: 70, weight: 1.0 },
        { skill: 'genomic-analytics', required: 85, weight: 1.5 },
        { skill: 'molecular-docking', required: 80, weight: 1.3 },
        { skill: 'research-methodology', required: 75, weight: 1.1 }
      ]
    },
    {
      name: 'Ayurvedic Formulations Scientist',
      slug: 'ayurvedic-formulations-scientist',
      domain: 'AYUSH',
      description: 'Integrates classical Ayurvedic pharmacology with modern chromatographic phytochemistry and clinical validation.',
      averageSalary: '₹8-16 LPA',
      demandLevel: 'Growing',
      requirements: [
        { skill: 'ayurvedic-phytochemistry', required: 85, weight: 1.5 },
        { skill: 'herbal-standardization', required: 80, weight: 1.4 },
        { skill: 'research-methodology', required: 75, weight: 1.0 }
      ]
    },
    {
      name: 'FinTech Quantitative Strategist',
      slug: 'fintech-quant-strategist',
      domain: 'FIN',
      description: 'Builds high-frequency trading models, decentralized smart contracts and risk valuation algorithms.',
      averageSalary: '₹16-32 LPA',
      demandLevel: 'Very High',
      requirements: [
        { skill: 'python-programming', required: 80, weight: 1.2 },
        { skill: 'financial-modeling', required: 85, weight: 1.4 },
        { skill: 'blockchain-smart-contracts', required: 75, weight: 1.3 },
        { skill: 'statistics-probability', required: 75, weight: 1.1 }
      ]
    },
    {
      name: 'Robotics & Automation Engineer',
      slug: 'robotics-automation-engineer',
      domain: 'MECH',
      description: 'Designs industrial robotic manipulators, autonomous navigation controllers and ROS2 pipelines.',
      averageSalary: '₹10-22 LPA',
      demandLevel: 'High',
      requirements: [
        { skill: 'robotics-ros', required: 85, weight: 1.5 },
        { skill: 'solidworks-cad', required: 80, weight: 1.2 },
        { skill: 'embedded-iot', required: 75, weight: 1.3 },
        { skill: 'python-programming', required: 70, weight: 1.0 }
      ]
    }
  ];

  const careerMap = {};
  for (const c of careersData) {
    const createdCareer = await prisma.careerPath.create({
      data: {
        name: c.name,
        slug: c.slug,
        domainId: domainMap[c.domain].id,
        description: c.description,
        averageSalary: c.averageSalary,
        demandLevel: c.demandLevel
      }
    });
    careerMap[c.slug] = createdCareer;

    for (const req of c.requirements) {
      if (skillMap[req.skill]) {
        await prisma.careerSkillRequirement.create({
          data: {
            careerPathId: createdCareer.id,
            skillId: skillMap[req.skill].id,
            requiredScore: req.required,
            importanceWeight: req.weight
          }
        });
      }
    }
  }
  console.log('✅ Created Career Paths & Skill Requirements.');

  // ----------------------------------------------------
  // 5. DEPARTMENTS & INSTITUTIONS
  // ----------------------------------------------------
  // Primary Institution: National Institute of Technology (NIT Demo)
  const nitUser = await prisma.user.create({
    data: {
      email: 'admin@nit.demo.edu',
      passwordHash: defaultPasswordHash,
      role: 'INSTITUTION',
      name: 'NIT Surathkal Demo Campus',
      avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80'
    }
  });

  const nitInstitution = await prisma.institutionProfile.create({
    data: {
      userId: nitUser.id,
      institutionName: 'National Institute of Technology Karnataka (NITK)',
      institutionType: 'Institute of National Importance',
      code: 'NITK-2026',
      state: 'Karnataka',
      city: 'Surathkal',
      accreditation: 'NAAC A++ / NIRF Rank 12',
      studentCount: 5200,
      facultyCount: 340
    }
  });

  // Additional Institution
  const iitUser = await prisma.user.create({
    data: {
      email: 'admin@iitd.demo.edu',
      passwordHash: defaultPasswordHash,
      role: 'INSTITUTION',
      name: 'IIT Delhi Innovation Cell',
      avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80'
    }
  });
  await prisma.institutionProfile.create({
    data: {
      userId: iitUser.id,
      institutionName: 'Indian Institute of Technology Delhi',
      institutionType: 'Institute of National Importance',
      code: 'IITD-2026',
      state: 'Delhi',
      city: 'New Delhi',
      accreditation: 'NIRF Rank 2',
      studentCount: 8500,
      facultyCount: 650
    }
  });

  // Departments
  const cseDept = await prisma.department.create({
    data: { name: 'Computer Science and Engineering', code: 'CSE-DEPT', domainId: domainMap['CSE'].id }
  });
  const aidsDept = await prisma.department.create({
    data: { name: 'Artificial Intelligence & Data Science', code: 'AIDS-DEPT', domainId: domainMap['AIDS'].id }
  });
  const biotechDept = await prisma.department.create({
    data: { name: 'Biotechnology & Bioinformatics', code: 'BIO-DEPT', domainId: domainMap['BIOTECH'].id }
  });
  const mechDept = await prisma.department.create({
    data: { name: 'Mechanical & Automation Engineering', code: 'MECH-DEPT', domainId: domainMap['MECH'].id }
  });

  // ----------------------------------------------------
  // 6. FACULTY ACCOUNTS (Dr. Ananya Sharma & peers)
  // ----------------------------------------------------
  const facultyUser = await prisma.user.create({
    data: {
      email: 'ananya.faculty@kaushiq.edu',
      passwordHash: defaultPasswordHash,
      role: 'FACULTY',
      name: 'Dr. Ananya Sharma',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    }
  });

  const facultyProfile = await prisma.facultyProfile.create({
    data: {
      userId: facultyUser.id,
      domainId: domainMap['AIDS'].id,
      departmentId: aidsDept.id,
      institutionId: nitInstitution.id,
      designation: 'Professor & Head of AI Research',
      experienceYears: 14,
      researchInterests: 'Applied Machine Learning, Explainable AI, Healthcare NLP, Neural Information Retrieval',
      publicationsCount: 24,
      patentsCount: 5,
      fdpCount: 12,
      consultancyCount: 7,
      isVerified: true
    }
  });

  // Additional Faculty
  const facultyBioUser = await prisma.user.create({
    data: {
      email: 'rajesh.biofaculty@kaushiq.edu',
      passwordHash: defaultPasswordHash,
      role: 'FACULTY',
      name: 'Dr. Rajesh Deshmukh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  });
  await prisma.facultyProfile.create({
    data: {
      userId: facultyBioUser.id,
      domainId: domainMap['BIOTECH'].id,
      departmentId: biotechDept.id,
      institutionId: nitInstitution.id,
      designation: 'Associate Professor, Genomic Medicine',
      experienceYears: 10,
      researchInterests: 'Computational Genomics, Herbal Phytochemistry, Proteomics',
      publicationsCount: 16,
      patentsCount: 2
    }
  });

  // ----------------------------------------------------
  // 7. INDUSTRY ACCOUNTS (TechNova Solutions & others)
  // ----------------------------------------------------
  const industryUser = await prisma.user.create({
    data: {
      email: 'technova.industry@kaushiq.com',
      passwordHash: defaultPasswordHash,
      role: 'INDUSTRY',
      name: 'TechNova Solutions',
      avatar: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=150&auto=format&fit=crop&q=80'
    }
  });

  const technovaProfile = await prisma.industryProfile.create({
    data: {
      userId: industryUser.id,
      domainId: domainMap['AIDS'].id,
      companyName: 'TechNova Solutions Inc.',
      companySize: '500-1,000 Employees',
      industryType: 'Enterprise Artificial Intelligence & Cloud Platforms',
      websiteUrl: 'https://technova-demo.ai',
      location: 'Bengaluru, Karnataka',
      description: 'Pioneering generative AI frameworks, biomedical intelligence, and high-performance predictive engines for global enterprises.',
      verificationStatus: 'VERIFIED'
    }
  });

  const bioHealthUser = await prisma.user.create({
    data: {
      email: 'biohealth.industry@kaushiq.com',
      passwordHash: defaultPasswordHash,
      role: 'INDUSTRY',
      name: 'BioHealth Analytics Labs',
      avatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80'
    }
  });
  const biohealthProfile = await prisma.industryProfile.create({
    data: {
      userId: bioHealthUser.id,
      domainId: domainMap['BIOTECH'].id,
      companyName: 'BioHealth Analytics Labs',
      companySize: '250-500 Employees',
      industryType: 'Biopharmaceutical & Genomic Intelligence',
      websiteUrl: 'https://biohealth-demo.com',
      location: 'Hyderabad, Telangana',
      description: 'Accelerating therapeutic molecule discovery and precision health diagnostics using automated biological data science.',
      verificationStatus: 'VERIFIED'
    }
  });

  const greenEnergyUser = await prisma.user.create({
    data: {
      email: 'greenvolt.industry@kaushiq.com',
      passwordHash: defaultPasswordHash,
      role: 'INDUSTRY',
      name: 'GreenVolt Energy Systems',
      avatar: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=150&auto=format&fit=crop&q=80'
    }
  });
  const greenvoltProfile = await prisma.industryProfile.create({
    data: {
      userId: greenEnergyUser.id,
      domainId: domainMap['EEE'].id,
      companyName: 'GreenVolt Energy Systems',
      companySize: '1,000+ Employees',
      industryType: 'Smart Grids & Renewable Power Telemetry',
      websiteUrl: 'https://greenvolt-demo.in',
      location: 'Pune, Maharashtra',
      description: 'Building micro-grid controllers and smart battery energy storage IoT systems.',
      verificationStatus: 'VERIFIED'
    }
  });

  // ----------------------------------------------------
  // 8. ADMIN ACCOUNT
  // ----------------------------------------------------
  await prisma.user.create({
    data: {
      email: 'admin@kaushiq.gov.in',
      passwordHash: defaultPasswordHash,
      role: 'ADMIN',
      name: 'KaushIQ Platform Admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
    }
  });

  // ----------------------------------------------------
  // 9. PRIMARY DEMO STUDENT: RAHUL KUMAR
  // ----------------------------------------------------
  const rahulUser = await prisma.user.create({
    data: {
      email: 'rahul.student@kaushiq.edu',
      passwordHash: defaultPasswordHash,
      role: 'STUDENT',
      name: 'Rahul Kumar',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      phone: '+91 98765 43210'
    }
  });

  // Baseline state: Readiness 61%
  const rahulProfile = await prisma.studentProfile.create({
    data: {
      userId: rahulUser.id,
      domainId: domainMap['CSE'].id,
      departmentId: cseDept.id,
      institutionId: nitInstitution.id,
      rollNumber: 'NITK22CS089',
      currentYear: 4,
      degree: 'B.Tech in Computer Science & Engineering',
      targetCareerId: careerMap['ai-ml-engineer'].id,
      readinessScore: 61, // Critical baseline to demonstrate leap to 87
      technicalScore: 65,
      domainScore: 58,
      softSkillsScore: 84,
      projectsScore: 55,
      certificationsScore: 60,
      industryExposureScore: 45,
      bio: 'Final year B.Tech student passionate about scalable AI pipelines, machine learning applications in medicine, and full-stack software development.',
      githubUrl: 'https://github.com/rahulkumar-demo',
      linkedinUrl: 'https://linkedin.com/in/rahulkumar-demo',
      portfolioUrl: 'https://rahulkumar.dev',
      passportCode: 'KSH-2026-NITK-88219'
    }
  });

  // Rahul's initial Skill Profile
  const rahulInitialSkills = [
    { slug: 'python-programming', score: 82, level: 'PROJECT_VERIFIED' },
    { slug: 'sql-database-design', score: 54, level: 'ASSESSED' },
    { slug: 'machine-learning', score: 42, level: 'SELF_DECLARED' }, // Critical Gap
    { slug: 'statistics-probability', score: 48, level: 'ASSESSED' }, // Critical Gap
    { slug: 'effective-communication', score: 86, level: 'FACULTY_VERIFIED' },
    { slug: 'problem-solving', score: 88, level: 'PROJECT_VERIFIED' },
    { slug: 'research-methodology', score: 74, level: 'FACULTY_VERIFIED' },
    { slug: 'react-frontend', score: 78, level: 'PROJECT_VERIFIED' },
    { slug: 'data-analytics', score: 58, level: 'ASSESSED' }
  ];

  for (const sk of rahulInitialSkills) {
    if (skillMap[sk.slug]) {
      await prisma.studentSkill.create({
        data: {
          studentId: rahulProfile.id,
          skillId: skillMap[sk.slug].id,
          currentScore: sk.score,
          verificationLevel: sk.level
        }
      });
    }
  }

  // Rahul's initial Skill Gaps against AI/ML Engineer target
  const rahulGaps = [
    { slug: 'machine-learning', current: 42, required: 80, severity: 'CRITICAL', action: 'Complete Machine Learning Fundamentals module and submit Industry AI Challenge' },
    { slug: 'statistics-probability', current: 48, required: 70, severity: 'CRITICAL', action: 'Take Applied Statistics & Probability quiz and review case studies' },
    { slug: 'sql-database-design', current: 54, required: 70, severity: 'MODERATE', action: 'Practice Advanced SQL queries and index tuning lab' },
    { slug: 'python-programming', current: 82, required: 80, severity: 'STRONG', action: 'Proficient benchmark achieved; ready for industry-grade tasks' },
    { slug: 'problem-solving', current: 88, required: 80, severity: 'STRONG', action: 'Exceeds target benchmark' },
    { slug: 'effective-communication', current: 86, required: 60, severity: 'STRONG', action: 'Exceeds target benchmark' }
  ];

  for (const gap of rahulGaps) {
    if (skillMap[gap.slug]) {
      await prisma.skillGap.create({
        data: {
          studentId: rahulProfile.id,
          careerPathId: careerMap['ai-ml-engineer'].id,
          skillId: skillMap[gap.slug].id,
          currentScore: gap.current,
          requiredScore: gap.required,
          gapScore: gap.required - gap.current,
          severity: gap.severity,
          recommendedAction: gap.action
        }
      });
    }
  }

  // Additional Students across other domains for institutional analytics
  const peerStudents = [
    { name: 'Priya Nair', email: 'priya.nair@kaushiq.edu', domain: 'AIDS', dept: aidsDept.id, year: 4, readiness: 84, target: 'ai-ml-engineer' },
    { name: 'Aarav Patel', email: 'aarav.patel@kaushiq.edu', domain: 'CSE', dept: cseDept.id, year: 3, readiness: 68, target: 'full-stack-cloud-architect' },
    { name: 'Sneha Sengupta', email: 'sneha.sengupta@kaushiq.edu', domain: 'BIOTECH', dept: biotechDept.id, year: 4, readiness: 79, target: 'genomic-bioinformatics' },
    { name: 'Vikramaditya Roy', email: 'vikram.roy@kaushiq.edu', domain: 'MECH', dept: mechDept.id, year: 3, readiness: 72, target: 'robotics-automation-engineer' },
    { name: 'Neha Kulkarni', email: 'neha.kulkarni@kaushiq.edu', domain: 'CSE', dept: cseDept.id, year: 2, readiness: 52, target: 'full-stack-cloud-architect' },
    { name: 'Devendra Singh', email: 'devendra.singh@kaushiq.edu', domain: 'CSE', dept: cseDept.id, year: 1, readiness: 44, target: 'ai-ml-engineer' }
  ];

  for (const peer of peerStudents) {
    const pUser = await prisma.user.create({
      data: {
        email: peer.email,
        passwordHash: defaultPasswordHash,
        role: 'STUDENT',
        name: peer.name,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`
      }
    });

    const pProfile = await prisma.studentProfile.create({
      data: {
        userId: pUser.id,
        domainId: domainMap[peer.domain].id,
        departmentId: peer.dept,
        institutionId: nitInstitution.id,
        currentYear: peer.year,
        degree: 'B.Tech Engineering',
        targetCareerId: careerMap[peer.target]?.id,
        readinessScore: peer.readiness,
        technicalScore: peer.readiness + 4,
        domainScore: peer.readiness - 3,
        softSkillsScore: 78,
        passportCode: `KSH-2026-NITK-${Math.floor(10000 + Math.random() * 90000)}`
      }
    });

    // Add 2-3 sample skills
    await prisma.studentSkill.create({
      data: {
        studentId: pProfile.id,
        skillId: skillMap['python-programming'].id,
        currentScore: peer.readiness,
        verificationLevel: 'ASSESSED'
      }
    });
  }
  console.log('✅ Created Students, Initial Skill Profiles & Gaps.');

  // ----------------------------------------------------
  // 10. LEARNING MODULES, NOTES, LECTURES & QUIZZES
  // ----------------------------------------------------
  const mlModule = await prisma.learningModule.create({
    data: {
      title: 'Machine Learning Fundamentals & Model Deployment',
      slug: 'machine-learning-fundamentals',
      domainId: domainMap['AIDS'].id,
      skillId: skillMap['machine-learning'].id,
      level: 'Intermediate',
      durationHours: 16,
      authorId: facultyProfile.id,
      authorRole: 'FACULTY',
      overview: 'Comprehensive industry-aligned course covering Supervised Learning, Scikit-Learn, Feature Engineering, Evaluation Metrics, and Production Microservice Deployment.',
      description: 'Designed by Dr. Ananya Sharma in partnership with TechNova Solutions. Provides high-yield revision notes, video lectures, coding labs, interactive quizzes and capstone project guidance.'
    }
  });

  // Notes for ML module
  await prisma.note.create({
    data: {
      moduleId: mlModule.id,
      title: 'Module 1: Supervised Learning & Gradient Descent Notes',
      readTimeMinutes: 18,
      content: `
# Supervised Learning & Cost Optimization

### 1. The Core Objective
In Supervised Learning, we are given a training set of labeled pairs $(x^{(i)}, y^{(i)})$ where $i = 1, \dots, m$.
Our goal is to learn a hypothesis function $h_\theta(x)$ that accurately maps feature vectors $x \in \mathbb{R}^n$ to continuous targets (Regression) or discrete class labels (Classification).

### 2. Loss Function Formulation
For linear regression, the Mean Squared Error (MSE) cost function is defined as:
$$J(\theta) = \frac{1}{2m} \sum_{i=1}^m (h_\theta(x^{(i)}) - y^{(i)})^2$$

### 3. Gradient Descent Updates
To minimize $J(\theta)$, parameters are updated simultaneously along the negative gradient vector:
$$\theta_j := \theta_j - \alpha \frac{\partial}{\partial \theta_j} J(\theta)$$
where $\alpha$ denotes the learning rate hyperparameter.

### 4. Overfitting vs. Regularization ($L_1$ and $L_2$)
- **$L_2$ Regularization (Ridge)**: Adds penalty $\lambda \sum_{j=1}^n \theta_j^2$. Shrinks weights smoothly to prevent high variance.
- **$L_1$ Regularization (Lasso)**: Adds penalty $\lambda \sum_{j=1}^n |\theta_j|$. Induces feature sparsity and automatic feature selection.

### 5. Industry Best Practice: The Bias-Variance Tradeoff
Always evaluate validation curves and ROC-AUC scores rather than raw accuracy when dealing with imbalanced medical or financial datasets.
      `
    }
  });

  await prisma.note.create({
    data: {
      moduleId: mlModule.id,
      title: 'Module 2: Feature Engineering & Cross-Validation Strategies',
      readTimeMinutes: 14,
      content: `
# Feature Engineering & Model Validation

### 1. Handling Missing Data
- **Numerical Imputation**: Median strategy for skewed distributions, iterative KNN imputer for correlated attributes.
- **Categorical Encoding**: Target encoding with cross-fold smoothing, or One-Hot encoding for low-cardinality nominals.

### 2. Stratified $K$-Fold Cross Validation
Ensures each fold maintains identical class proportions to the master population—critical for healthcare predictions.

### 3. Metric Selection Matrix
- High Cost of False Negatives (e.g. Cancer Diagnosis) $\rightarrow$ Prioritize **Recall (Sensitivity)**.
- High Cost of False Positives (e.g. Fraud Flagging) $\rightarrow$ Prioritize **Precision**.
      `
    }
  });

  // Lectures for ML module
  await prisma.lecture.create({
    data: {
      moduleId: mlModule.id,
      title: 'Lecture 1: Foundations of Statistical Learning & Loss Functions',
      videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
      durationMinutes: 28,
      transcript: 'Welcome to Lecture 1. In this session, Dr. Ananya Sharma explains how mathematical loss functions guide parameter optimization and why stochastic gradient descent is the workhorse of modern AI architectures.',
      orderIndex: 1
    }
  });

  await prisma.lecture.create({
    data: {
      moduleId: mlModule.id,
      title: 'Lecture 2: Scikit-Learn Pipelines & Production Deployment with FastAPI',
      videoUrl: 'https://www.youtube.com/embed/Gv9_4yMHFhI',
      durationMinutes: 34,
      transcript: 'In this lecture, we build an end-to-end inference pipeline using Scikit-Learn ColumnTransformer and wrap it inside an asynchronous FastAPI REST endpoint containerized with Docker.',
      orderIndex: 2
    }
  });

  // Quiz for ML module
  const mlQuiz = await prisma.quiz.create({
    data: {
      moduleId: mlModule.id,
      title: 'Machine Learning Mastery Assessment',
      passingScore: 70
    }
  });

  await prisma.quizQuestion.createMany({
    data: [
      {
        quizId: mlQuiz.id,
        questionText: 'Which regularization technique forces less important feature weights to become exactly zero, yielding automatic feature selection?',
        optionA: 'L2 Regularization (Ridge)',
        optionB: 'L1 Regularization (Lasso)',
        optionC: 'Batch Normalization',
        optionD: 'Dropout',
        correctOption: 'B',
        explanation: 'L1 Regularization uses the absolute value penalty, which produces geometric diamond intersections causing non-influential weights to truncate to exactly 0.'
      },
      {
        quizId: mlQuiz.id,
        questionText: 'In a medical disease diagnosis scenario where missing a sick patient (False Negative) is disastrous, which evaluation metric should you maximize?',
        optionA: 'Precision',
        optionB: 'Recall (Sensitivity)',
        optionC: 'Specificity',
        optionD: 'Mean Absolute Error',
        correctOption: 'B',
        explanation: 'Recall = TP / (TP + FN). Maximizing Recall minimizes False Negatives.'
      },
      {
        quizId: mlQuiz.id,
        questionText: 'What is the primary danger of training an ensemble of 500 deep decision trees without depth constraints?',
        optionA: 'Underfitting and High Bias',
        optionB: 'Overfitting and High Variance',
        optionC: 'Vanishing Gradient Problem',
        optionD: 'Data Leakage',
        correctOption: 'B',
        explanation: 'Unconstrained deep decision trees memorize leaf-level noise in training samples, leading to high variance and poor generalization.'
      },
      {
        quizId: mlQuiz.id,
        questionText: 'Which algorithm is best suited for tabular structured data with non-linear feature interactions?',
        optionA: 'Convolutional Neural Networks (CNN)',
        optionB: 'Gradient Boosted Decision Trees (XGBoost / LightGBM)',
        optionC: 'Recurrent Neural Networks (LSTM)',
        optionD: 'Naive Bayes Classifier',
        correctOption: 'B',
        explanation: 'XGBoost and LightGBM consistently outperform other architectures on tabular structured data benchmarks.'
      }
    ]
  });

  // Additional Modules across other domains
  await prisma.learningModule.create({
    data: {
      title: 'Modern Cloud Architecture & Distributed Systems',
      slug: 'cloud-architecture-distributed-systems',
      domainId: domainMap['CSE'].id,
      skillId: skillMap['cloud-architecture'].id,
      level: 'Advanced',
      durationHours: 20,
      overview: 'Master container orchestration, Kubernetes, serverless microservices, and high-availability database replication on AWS/GCP.',
      description: 'Step-by-step masterclass on architecting multi-region fault-tolerant systems with zero-downtime CI/CD.'
    }
  });

  await prisma.learningModule.create({
    data: {
      title: 'Genomic Informatics & Next-Gen Sequencing Data Pipelines',
      slug: 'genomic-informatics-ngs',
      domainId: domainMap['BIOTECH'].id,
      skillId: skillMap['genomic-analytics'].id,
      level: 'Advanced',
      durationHours: 18,
      overview: 'Hands-on genomic sequence alignment (FASTQ/BAM), variant calling pipelines (GATK), and molecular docking simulation tools.',
      description: 'Curated by Dr. Rajesh Deshmukh with datasets from National Center for Biotechnology Information.'
    }
  });

  await prisma.learningModule.create({
    data: {
      title: 'Ayurvedic Phytochemistry & Bioactive Compound Extraction',
      slug: 'ayurvedic-phytochemistry-extraction',
      domainId: domainMap['AYUSH'].id,
      skillId: skillMap['ayurvedic-phytochemistry'].id,
      level: 'Intermediate',
      durationHours: 14,
      overview: 'Chromatographic fingerprinting (HPTLC/HPLC), spectroscopic validation, and phytopharmaceutical standardization protocols.',
      description: 'Bridging ancient Ayurvedic pharmacopeia standards with WHO GMP validation benchmarks.'
    }
  });
  console.log('✅ Created Learning Modules, Notes, Lectures & Quizzes.');

  // ----------------------------------------------------
  // 11. INDUSTRY CHALLENGES & PROJECTS MARKETPLACE
  // ----------------------------------------------------
  const healthProject = await prisma.project.create({
    data: {
      title: 'AI-Based Healthcare Disease Risk Prediction Engine',
      slug: 'ai-healthcare-prediction',
      domainId: domainMap['AIDS'].id,
      industryId: technovaProfile.id,
      facultyId: facultyProfile.id,
      difficulty: 'Advanced',
      durationWeeks: 4,
      stipend: '₹20,000 Completion Grant + Verified Industry Badge',
      problemStatement: 'Develop a high-precision multi-class predictive engine capable of analyzing anonymized patient vitals, lab reports, and lifestyle telemetry to detect early onset cardiovascular and metabolic risk factors.',
      datasetUrl: 'https://datasets.kaushiq.edu/healthcare/cardio-vitals-2026.csv',
      deliverables: '1. Modular Python codebase with Scikit-Learn/XGBoost training pipeline.\n2. Containerized FastAPI microservice.\n3. Detailed model interpretability report using SHAP (SHapley Additive exPlanations).\n4. Unit test suite with >80% coverage.',
      evaluationCriteria: 'Model ROC-AUC > 0.88, inference latency < 50ms, clean modular code structure, and explainable feature impact diagrams.',
      isVerifiedChallenge: true,
      status: 'ACTIVE'
    }
  });

  await prisma.project.create({
    data: {
      title: 'Autonomous Smart Grid Telemetry & Load Balancer',
      slug: 'smart-grid-load-balancer',
      domainId: domainMap['EEE'].id,
      industryId: greenvoltProfile.id,
      difficulty: 'Advanced',
      durationWeeks: 5,
      stipend: '₹25,000 Completion Grant',
      problemStatement: 'Design an IoT simulation system that forecasts renewable peak generation curves and balances municipal power distribution.',
      deliverables: 'Embedded telemetry simulator, MQTT broker integration, and dashboard visualizer.',
      evaluationCriteria: 'Forecasting accuracy, system resilience during simulated grid failure.',
      isVerifiedChallenge: true,
      status: 'ACTIVE'
    }
  });

  await prisma.project.create({
    data: {
      title: 'AyurGenomics Bioactive Molecule Identifier',
      slug: 'ayurgenomics-molecule-identifier',
      domainId: domainMap['BIOTECH'].id,
      industryId: biohealthProfile.id,
      facultyId: facultyBioUser.id ? facultyProfile.id : null,
      difficulty: 'Advanced',
      durationWeeks: 4,
      stipend: '₹18,000 Grant',
      problemStatement: 'Perform computational molecular docking between active Ayurvedic botanical compounds and inflammatory cytokine receptors.',
      deliverables: 'Docking score matrix, PyMOL binding visualization, and pharmacokinetics summary.',
      evaluationCriteria: 'Valid binding affinity calculations and reproducible docking scripts.',
      isVerifiedChallenge: true,
      status: 'ACTIVE'
    }
  });
  console.log('✅ Created Industry Challenges & Projects.');

  // ----------------------------------------------------
  // 12. OPPORTUNITIES (25+ Internships, Jobs & Training)
  // ----------------------------------------------------
  const opp1 = await prisma.opportunity.create({
    data: {
      title: 'AI / Machine Learning Engineering Intern',
      slug: 'ai-ml-intern-technova',
      type: 'INTERNSHIP',
      organizationId: technovaProfile.id,
      domainId: domainMap['AIDS'].id,
      location: 'Bengaluru (Hybrid)',
      locationType: 'HYBRID',
      duration: '6 Months',
      stipendOrSalary: '₹40,000 / month + Pre-Placement Offer (₹18 LPA)',
      minReadinessScore: 70,
      eligibilityCriteria: 'B.Tech/M.Tech/MCA pre-final and final year students with verified Python, Machine Learning, and SQL competencies.',
      description: 'Join TechNova’s flagship Core AI Research Lab. You will work on real-time neural search engines, automated feature stores, and production LLM fine-tuning pipelines serving over 2 million queries daily.',
      responsibilities: '1. Build and benchmark supervised and reinforcement learning models.\n2. Optimize real-time inference latency using ONNX and TensorRT.\n3. Collaborate with senior architects and publish internal research whitepapers.',
      requirements: 'Strong foundation in Python, Scikit-Learn/PyTorch, SQL databases, and scientific problem-solving. Prior verified project experience strongly preferred.',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      openingsCount: 8,
      status: 'OPEN'
    }
  });

  // Attach required skills to Opportunity 1
  await prisma.opportunitySkillRequirement.createMany({
    data: [
      { opportunityId: opp1.id, skillId: skillMap['python-programming'].id, minScore: 75, isMandatory: true },
      { opportunityId: opp1.id, skillId: skillMap['machine-learning'].id, minScore: 70, isMandatory: true },
      { opportunityId: opp1.id, skillId: skillMap['sql-database-design'].id, minScore: 65, isMandatory: true },
      { opportunityId: opp1.id, skillId: skillMap['effective-communication'].id, minScore: 60, isMandatory: false }
    ]
  });

  const opp2 = await prisma.opportunity.create({
    data: {
      title: 'Junior Cloud Solutions & Full-Stack Engineer',
      slug: 'junior-cloud-engineer-technova',
      type: 'JOB',
      organizationId: technovaProfile.id,
      domainId: domainMap['CSE'].id,
      location: 'Hyderabad (On-Site)',
      locationType: 'ON_SITE',
      duration: 'Full-Time',
      stipendOrSalary: '₹14,50,000 per annum',
      minReadinessScore: 75,
      eligibilityCriteria: 'Graduating Batch 2026 with verified full-stack & cloud competencies.',
      description: 'Engineer high-throughput enterprise backend microservices and modern React UI interfaces deployed across distributed AWS cloud clusters.',
      responsibilities: 'Develop REST/GraphQL microservices, implement Docker/Kubernetes CI/CD automation, and maintain 99.99% service availability.',
      requirements: 'Proficiency in React, Node.js/Python, SQL databases, Docker, and AWS fundamentals.',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      openingsCount: 12,
      status: 'OPEN'
    }
  });

  await prisma.opportunitySkillRequirement.createMany({
    data: [
      { opportunityId: opp2.id, skillId: skillMap['react-frontend'].id, minScore: 75, isMandatory: true },
      { opportunityId: opp2.id, skillId: skillMap['cloud-architecture'].id, minScore: 70, isMandatory: true },
      { opportunityId: opp2.id, skillId: skillMap['sql-database-design'].id, minScore: 70, isMandatory: true }
    ]
  });

  const opp3 = await prisma.opportunity.create({
    data: {
      title: 'Computational Biology & Genomics Research Intern',
      slug: 'computational-biology-intern-biohealth',
      type: 'INTERNSHIP',
      organizationId: biohealthProfile.id,
      domainId: domainMap['BIOTECH'].id,
      location: 'Hyderabad / Remote',
      locationType: 'HYBRID',
      duration: '6 Months',
      stipendOrSalary: '₹35,000 / month',
      minReadinessScore: 70,
      eligibilityCriteria: 'Students in Biotechnology, Bioinformatics, or Life Sciences.',
      description: 'Analyze multi-omic clinical datasets, identify biomarker candidates, and simulate molecular interactions.',
      responsibilities: 'Run NGS analysis pipelines, execute docking simulations, and write research reports.',
      requirements: 'Knowledge of Genomic Analytics, Python, and Molecular Docking.',
      openingsCount: 4,
      status: 'OPEN'
    }
  });

  const opp4 = await prisma.opportunity.create({
    data: {
      title: 'Smart Grid IoT Systems Graduate Trainee',
      slug: 'smart-grid-iot-trainee-greenvolt',
      type: 'APPRENTICESHIP',
      organizationId: greenvoltProfile.id,
      domainId: domainMap['EEE'].id,
      location: 'Pune',
      locationType: 'ON_SITE',
      duration: '12 Months',
      stipendOrSalary: '₹32,000 / month + Full Benefits',
      minReadinessScore: 65,
      eligibilityCriteria: 'Graduates in Electrical, Electronics, or Mechanical Engineering.',
      description: 'Hands-on industrial training in smart grid telemetry protocols, power converter testing, and embedded firmware deployment.',
      responsibilities: 'Configure hardware sensors, validate power efficiency benchmarks, and assist field engineers.',
      requirements: 'Embedded systems, IoT, smart grid fundamentals.',
      openingsCount: 10,
      status: 'OPEN'
    }
  });
  console.log('✅ Created Opportunities & Skill Linkages.');

  // ----------------------------------------------------
  // 13. CERTIFICATIONS & NOTIFICATIONS & RECOMMENDATIONS
  // ----------------------------------------------------
  await prisma.certification.createMany({
    data: [
      {
        studentId: rahulProfile.id,
        title: 'NPTEL Elite Gold: Deep Learning Foundations',
        issuer: 'IIT Madras & NPTEL',
        issueDate: new Date('2025-11-15'),
        credentialUrl: 'https://nptel.ac.in/verify/NPTEL25CS98124',
        verificationStatus: 'VERIFIED'
      },
      {
        studentId: rahulProfile.id,
        title: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        issueDate: new Date('2025-08-20'),
        credentialUrl: 'https://aws.amazon.com/verification/AWS-882190',
        verificationStatus: 'VERIFIED'
      },
      {
        studentId: rahulProfile.id,
        title: 'Algorithmic Problem Solving & Data Structures',
        issuer: 'ACM NITK Chapter',
        issueDate: new Date('2025-04-10'),
        credentialUrl: 'https://nitk.ac.in/acm/credentials/88219',
        verificationStatus: 'VERIFIED'
      },
      {
        studentId: rahulProfile.id,
        title: 'Effective Technical Communication for Engineers',
        issuer: 'British Council & NITK Humanities',
        issueDate: new Date('2024-12-05'),
        credentialUrl: 'https://britishcouncil.in/verify/88219',
        verificationStatus: 'VERIFIED'
      }
    ]
  });

  // Initial Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: rahulUser.id,
        title: '🎯 Skill Gap Alert: AI/ML Career Target',
        message: 'Your baseline readiness for AI/ML Engineer is 61%. Complete the Machine Learning Fundamentals module to bridge critical gaps.',
        type: 'WARNING',
        link: '/learning/machine-learning-fundamentals'
      },
      {
        userId: rahulUser.id,
        title: '🚀 New Industry Challenge Active',
        message: 'TechNova Solutions published "AI-Based Healthcare Disease Risk Prediction Engine". Verified completion grants +26 Readiness points!',
        type: 'OPPORTUNITY',
        link: '/projects/ai-healthcare-prediction'
      },
      {
        userId: technovaProfile.userId,
        title: '📈 Talent Intelligence Updated',
        message: 'AI/ML talent demand surged by +42% across regional engineering institutions this quarter.',
        type: 'INFO',
        link: '/industry/dashboard'
      },
      {
        userId: nitInstitution.userId,
        title: '📊 Institutional Skill Gap Insights Ready',
        message: '4th-year CSE & AIDS cohorts identified with moderate gaps in Production ML & Cloud Architecture. Automated intervention suggestions generated.',
        type: 'INFO',
        link: '/institution/dashboard'
      }
    ]
  });

  // Institutional Recommendations
  await prisma.recommendation.createMany({
    data: [
      {
        institutionId: nitInstitution.id,
        title: 'Launch 4-Week Industry AI & ML Bootcamp',
        category: 'BOOTCAMP',
        reason: '38% of final-year CSE students display moderate gaps in production model deployment.',
        suggestedAction: 'Partner with TechNova Solutions to host weekend hands-on labs with cloud credits.',
        impactLevel: 'HIGH'
      },
      {
        institutionId: nitInstitution.id,
        title: 'Faculty Upskilling: Generative AI & MLOps Architectures',
        category: 'FACULTY_UPSKILLING',
        reason: 'Curriculum requires modernization to meet 2026 AI industry standards.',
        suggestedAction: 'Organize 5-day AICTE-approved Faculty Development Program (FDP).',
        impactLevel: 'HIGH'
      },
      {
        institutionId: nitInstitution.id,
        title: 'Setup BioHealth Genomics Analytics Sandbox',
        category: 'INDUSTRY_LAB',
        reason: 'Biotechnology students require GPU-enabled high-throughput sequencing computing nodes.',
        suggestedAction: 'Co-sponsor joint computational research sandbox with BioHealth Analytics Labs.',
        impactLevel: 'MEDIUM'
      }
    ]
  });

  console.log('🎉 KaushIQ Database successfully seeded with 100% relational integrity!');
  console.log('===========================================================');
  console.log('Demo Accounts Ready:');
  console.log('  Student:     rahul.student@kaushiq.edu       / demo123');
  console.log('  Faculty:     ananya.faculty@kaushiq.edu     / demo123');
  console.log('  Industry:    technova.industry@kaushiq.com  / demo123');
  console.log('  Institution: admin@nit.demo.edu             / demo123');
  console.log('  Admin:       admin@kaushiq.gov.in           / demo123');
  console.log('===========================================================');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
