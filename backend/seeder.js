require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./src/models/User');
const Company = require('./src/models/Company');
const Job = require('./src/models/Job');
const Application = require('./src/models/Application');
const Resume = require('./src/models/Resume');
const Interview = require('./src/models/Interview');
const MockInterview = require('./src/models/MockInterview');
const ROLES = require('./src/utils/roles');

// Connection logic
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_job_portal';
    console.log(`📡 Connecting to database: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected successfully for seeding.');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Seeding Data Lists
const indianLocations = ['Bangalore', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Remote', 'Chennai'];
const globalLocations = ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Singapore'];

const sampleSkills = [
  ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
  ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'REST API', 'Redis'],
  ['Java', 'Spring Boot', 'MySQL', 'Kubernetes', 'Microservices', 'Docker', 'Kafka'],
  ['Python', 'TensorFlow', 'PyTorch', 'Data Science', 'Machine Learning', 'Pandas', 'SQL'],
  ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping', 'Wireframing', 'User Research'],
  ['DevOps', 'AWS', 'Kubernetes', 'CI/CD', 'Terraform', 'Docker', 'Bash', 'Prometheus'],
  ['Swift', 'iOS Development', 'UIKit', 'SwiftUI', 'CoreData', 'Combine', 'Git'],
  ['Kotlin', 'Android Development', 'Jetpack Compose', 'MVVM', 'Coroutines', 'Retrofit']
];

const degreeTemplates = [
  { degree: 'B.Tech in Computer Science', university: 'IIT Delhi' },
  { degree: 'B.E. in Information Technology', university: 'BITS Pilani' },
  { degree: 'Master of Computer Applications', university: 'NIT Trichy' },
  { degree: 'B.Sc. in Computer Science', university: 'Delhi University' },
  { degree: 'M.S. in Data Science', university: 'Stanford University' },
  { degree: 'B.Des in Communication Design', university: 'NID Ahmedabad' }
];

const roleTemplates = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Scientist', 'UI/UX Designer', 'DevOps Specialist', 'iOS Developer', 'Mobile Engineer'
];

const companyNames = ['TechCorp', 'InnovateLabs', 'FinTech Solutions', 'HealthSphere', 'EduFlow'];
const companyDetails = [
  { name: 'TechCorp', desc: 'A leading global software development enterprise building next-gen AI applications.', web: 'https://techcorp.example.com', loc: 'Bangalore', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'InnovateLabs', desc: 'Pioneering blockchain, Web3, and intelligent cloud optimization for modern SaaS companies.', web: 'https://innovatelabs.example.com', loc: 'San Francisco', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'FinTech Solutions', desc: 'Secure, robust, and highly scalable banking APIs and peer-to-peer digital lending platforms.', web: 'https://fintech.example.com', loc: 'Mumbai', logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'HealthSphere', desc: 'Bridging patients and modern doctors via smart clinical diagnosis systems powered by vision AI.', web: 'https://healthsphere.example.com', loc: 'Hyderabad', logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'EduFlow', desc: 'Modern gamified learning management systems helping students conquer advanced mathematical principles.', web: 'https://eduflow.example.com', loc: 'Pune', logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200&h=200' }
];

const seedDB = async () => {
  try {
    // 1. Connect
    await connectDB();

    // 2. Clear Existing Records
    console.log('🧹 Clearing old data...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Resume.deleteMany({});
    await Interview.deleteMany({});
    await MockInterview.deleteMany({});
    console.log('🗑️ Database cleared successfully.');

    // 3. Pre-hash password for clean login compatibility
    console.log('🔑 Generating secure hashed passwords...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 4. Create 5 Recruiters
    console.log('👥 Creating 5 Recruiter users...');
    const recruitersData = [];
    const recruiterNames = ['Karan Mehra', 'Sophia Davis', 'Rajesh Sen', 'Emily Brown', 'Aditi Rao'];

    for (let i = 0; i < 5; i++) {
      recruitersData.push({
        fullname: recruiterNames[i],
        email: `recruiter${i + 1}@example.com`,
        countryCode: '+91',
        phoneNumber: `987654320${i}`,
        location: i % 2 === 0 ? 'Bangalore' : 'Mumbai',
        password: hashedPassword,
        role: ROLES.RECRUITER,
        hasCompanyProfile: true,
        isOtpVerified: true,
        isHiringOtpVerified: true
      });
    }
    const recruiters = await User.insertMany(recruitersData);
    console.log(`✅ 5 Recruiters inserted successfully.`);

    // 5. Create 5 Companies (Linked to the 5 Recruiters)
    console.log('🏢 Creating Companies linked to Recruiters...');
    const companiesData = [];
    for (let i = 0; i < 5; i++) {
      companiesData.push({
        name: companyDetails[i].name,
        description: companyDetails[i].desc,
        website: companyDetails[i].web,
        location: companyDetails[i].loc,
        logo: companyDetails[i].logo,
        userId: recruiters[i]._id
      });
    }
    const companies = await Company.insertMany(companiesData);
    console.log(`✅ 5 Companies seeded.`);

    // 6. Create 45 Candidates (Making total 50 users)
    console.log('👨‍💻 Generating 45 Candidate users with detailed resumes/skills...');
    const candidatesData = [];
    const firstNames = ['Amit', 'Rahul', 'Priya', 'Neha', 'Vikram', 'Rohan', 'Sneha', 'Anjali', 'Deepak', 'Sanjay', 'John', 'Jane', 'Alice', 'Bob', 'David', 'Emma'];
    const lastNames = ['Sharma', 'Patel', 'Verma', 'Gupta', 'Malhotra', 'Sen', 'Rao', 'Nair', 'Singh', 'Kumar', 'Doe', 'Smith', 'Johnson', 'Davis', 'Miller', 'Wilson'];

    for (let i = 0; i < 45; i++) {
      const skillsIdx = i % sampleSkills.length;
      const skills = sampleSkills[skillsIdx];
      const targetRole = roleTemplates[i % roleTemplates.length];
      const targetLocation = i % 2 === 0 ? indianLocations[i % indianLocations.length] : globalLocations[i % globalLocations.length];
      const expYears = (i % 8) + 1; // 1 to 8 years experience
      const edu = degreeTemplates[i % degreeTemplates.length];

      candidatesData.push({
        fullname: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
        email: `candidate${i + 1}@example.com`,
        countryCode: '+91',
        phoneNumber: `98123456${String(i).padStart(2, '0')}`,
        location: targetLocation,
        password: hashedPassword,
        role: ROLES.CANDIDATE,
        bio: `Passionate ${targetRole} with ${expYears}+ years of hands-on experience developing top-tier products, collaborating with agile frameworks, and scaling cloud infrastructures.`,
        skills: skills,
        experience: expYears,
        isOtpVerified: true,
        isPremium: i % 5 === 0, // Make every 5th candidate premium
        education: [{
          degree: edu.degree,
          university: edu.university,
          cgpa: (8.0 + (i % 2) * 0.8).toFixed(1),
          year: String(2023 - expYears)
        }],
        workExperience: [{
          role: targetRole,
          company: companyNames[i % companyNames.length],
          duration: `${expYears} Years`,
          description: `Worked as a key ${targetRole} to design, implement, and test core microservices, increasing application performance by 25% and reducing system load.`
        }],
        projects: [{
          title: `Intelligent ${targetRole} Dashboard`,
          stack: [skills[0], skills[1], 'TailwindCSS'],
          description: 'A fully custom, enterprise-ready data dashboard managing real-time websocket integrations, modern analytics visualization, and spring animations.',
          link: 'https://github.com/example/dashboard'
        }],
        resume: 'https://res.cloudinary.com/demo/image/upload/v1580823818/sample.pdf' // Cloudinary URL
      });
    }

    const candidates = await User.insertMany(candidatesData);
    console.log(`✅ 45 Candidates inserted successfully.`);

    // 7. Create 20 Jobs (Linked to Companies and Recruiters)
    console.log('💼 Seeding 20 Job Postings with realistic requirements...');
    const jobsData = [];
    const jobTitles = [
      'Senior Full Stack Developer', 'Backend Spring Boot Engineer', 'React UI Architect',
      'Lead Data Scientist', 'UI/UX Visual Designer', 'Kubernetes Cloud Administrator',
      'iOS Swift developer', 'Android Compose Developer', 'Junior Node.js Developer',
      'Product Management Lead', 'Python Django Engineer', 'Product Analyst',
      'Staff Software Engineer', 'Machine Learning Architect', 'Figma Product Designer',
      'Release & CI/CD Engineer', 'iOS Engineer (CoreData)', 'React Native Developer',
      'Database Reliability Architect', 'Principal Security Analyst'
    ];
    const categories = [
      'Software Engineering', 'Software Engineering', 'Software Engineering',
      'Data Science', 'UI/UX Design', 'DevOps',
      'Software Engineering', 'Software Engineering', 'Software Engineering',
      'Product Management', 'Software Engineering', 'Product Management',
      'Software Engineering', 'Data Science', 'UI/UX Design',
      'DevOps', 'Software Engineering', 'Software Engineering',
      'DevOps', 'Software Engineering'
    ];
    const salaries = [
      '$120k - $150k', '₹15,00,000 - ₹20,00,000', '₹12,00,000 - ₹16,00,000',
      '$140k - $180k', '₹10,00,000 - ₹14,00,000', '$130k - $160k',
      '$110k - $140k', '₹12,00,000 - ₹18,00,000', '₹6,00,000 - ₹9,00,000',
      '$150k - $190k', '₹10,00,000 - ₹15,00,000', '₹8,00,000 - ₹12,00,000',
      '$160k - $210k', '$150k - $200k', '₹8,00,000 - ₹12,00,000',
      '$110k - $140k', '₹14,00,000 - ₹19,00,000', '₹9,00,000 - ₹13,00,000',
      '$140k - $180k', '$130k - $170k'
    ];

    for (let i = 0; i < 20; i++) {
      const compIdx = i % companies.length;
      const recIdx = compIdx; // Linked recruiter
      const reqList = sampleSkills[i % sampleSkills.length];

      jobsData.push({
        title: jobTitles[i],
        description: `We are looking for a highly capable professional to join our fast-paced squad. You will lead development pipelines, participate in architectural design, and write high-efficiency codes.\n\nQualifications:\n- Strong capability with ${reqList.slice(0, 3).join(', ')}\n- Understanding of design patterns\n- Collaborative background.`,
        requirements: reqList,
        salary: salaries[i],
        location: companyDetails[compIdx].loc,
        jobType: i % 4 === 0 ? 'Contract' : i % 5 === 0 ? 'Internship' : 'Full-time',
        experience: (i % 6) + 1,
        category: categories[i],
        companyId: companies[compIdx]._id,
        postedBy: recruiters[recIdx]._id,
        applications: []
      });
    }

    const jobs = await Job.insertMany(jobsData);
    console.log(`✅ 20 Jobs posted successfully.`);

    // 8. Create 30 Resume Analysis records (Linked to Candidate Users)
    console.log('📄 Seeding 30 Resume Analyses...');
    const resumesData = [];
    for (let i = 0; i < 30; i++) {
      const cand = candidates[i];
      const targetRole = roleTemplates[i % roleTemplates.length];
      const score = 70 + (i % 26); // Score range 70 to 95

      resumesData.push({
        userId: cand._id,
        fileUrl: cand.resume,
        isDefault: true,
        isAnalyzed: true,
        score: score,
        summary: `Excellent professional background showing deep expertise in modern web frameworks and production scaling. Highly qualified for ${targetRole} positions.`,
        skills: cand.skills,
        strengths: ['Agile execution', 'Robust code documentation', 'Critical problem-solving capabilities'],
        weaknesses: ['Public speaking confidence', 'Advanced Rust programming', 'High scale distributed systems orchestration'],
        coachingTips: [
          'Enhance system design scaling concepts specifically targeting large event-driven microservices.',
          'Consider contributing directly to modern npm packages or open-source libraries to demonstrate leadership.',
          'Optimize your ATS formatting to focus on structural performance and quantitative outcomes rather than just responsibilities.'
        ],
        experience: score > 85 ? 'Senior' : score > 75 ? 'Mid' : 'Entry',
        recommendedRoles: [targetRole, 'Senior Developer', 'Software Architect']
      });
    }

    await Resume.insertMany(resumesData);
    console.log(`✅ 30 Resumes analyzed and seeded.`);

    // 9. Create 40 Applications (Candidates applying to Jobs)
    console.log('📝 Seeding 40 Applications with AI Scores...');
    const applicationsData = [];

    // Choose 40 candidates to apply to some jobs
    for (let i = 0; i < 40; i++) {
      const cand = candidates[i % candidates.length];
      const job = jobs[i % jobs.length];
      const aiScore = 65 + (i % 30); // AI match compatibility score 65 to 95
      const statuses = ['applied', 'shortlisted', 'interviewing', 'hired', 'rejected'];
      const status = statuses[i % statuses.length];

      applicationsData.push({
        jobId: job._id,
        applicantId: cand._id,
        status: status,
        aiScore: aiScore
      });
    }

    const applications = await Application.insertMany(applicationsData);

    // Update Jobs with applications arrays
    console.log('🔗 Linking Applications back to Jobs...');
    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      await Job.findByIdAndUpdate(app.jobId, {
        $push: { applications: app._id }
      });
    }
    console.log(`✅ 40 Applications created and mapped.`);

    // 10. Create 15 Mock Interviews (Candidate Practice)
    console.log('🎤 Seeding 15 Mock Interviews...');
    const mockInterviewsData = [];
    for (let i = 0; i < 15; i++) {
      const cand = candidates[i];
      const targetRole = roleTemplates[i % roleTemplates.length];
      const isCompleted = i % 3 !== 0;

      mockInterviewsData.push({
        userId: cand._id,
        jobTitle: targetRole,
        jobDescription: `Looking for a skilled ${targetRole} with understanding of responsive structures and modern state controllers.`,
        questions: [
          { question: `Describe how you optimize performance in a large-scale ${cand.skills[0]} application.`, category: 'Technical' },
          { question: 'Tell me about a time when you disagreed with your manager. How did you resolve it?', category: 'Behavioral' },
          { question: `What are the pros and cons of using ${cand.skills[1]} on the backend?`, category: 'Technical' }
        ],
        responses: isCompleted ? [
          {
            questionId: 'q1',
            answerText: 'I use code splitting, lazy loading, memorization hooks, and compress bundled packages to minimize render times.',
            aiFeedback: 'Excellent explanation of front-end performance principles. Mentioning network optimizations would make it perfect.',
            score: 88
          },
          {
            questionId: 'q2',
            answerText: 'I scheduled a separate meeting to show visual mockups and proof-of-concept benchmarks. We agreed to execute a hybrid method.',
            aiFeedback: 'Great display of maturity, emotional intelligence, and data-backed resolution strategies.',
            score: 92
          }
        ] : [],
        overallScore: isCompleted ? 85 + (i % 10) : 0,
        technicalScore: isCompleted ? 87 + (i % 8) : 0,
        confidenceScore: isCompleted ? 84 + (i % 12) : 0,
        overallFeedback: isCompleted ? 'Great clarity of thoughts and solid system engineering fundamentals shown. Keep practicing key database scaling items.' : '',
        status: isCompleted ? 'completed' : 'pending'
      });
    }
    await MockInterview.insertMany(mockInterviewsData);
    console.log(`✅ 15 Practice Mock Interviews seeded.`);

    // 11. Create 10 Real/Scheduled Interviews (Shortlisted Candidate Applications)
    console.log('📅 Seeding 10 Real Recruiter Interviews...');
    const interviewsData = [];

    // Filter out some interviewing/shortlisted applications
    const activeApps = applications.filter(app => app.status === 'interviewing' || app.status === 'shortlisted').slice(0, 10);

    for (let i = 0; i < activeApps.length; i++) {
      const app = activeApps[i];
      const job = await Job.findById(app.jobId);

      const interviewDate = new Date();
      interviewDate.setDate(interviewDate.getDate() + (i + 1)); // Next few days

      interviewsData.push({
        jobId: job._id,
        candidateId: app.applicantId,
        companyId: job.companyId,
        date: interviewDate,
        time: `${10 + (i % 5)}:00 AM`,
        mode: 'Google Meet',
        meetingLink: `https://meet.google.com/abc-defg-hij`,
        status: i % 5 === 0 ? 'completed' : 'scheduled',
        feedback: i % 5 === 0 ? 'Strong engineering skills and impressive live coding performance.' : '',
        rating: i % 5 === 0 ? 4 : undefined
      });
    }
    await Interview.insertMany(interviewsData);
    console.log(`✅ 10 Recruiter Interviews scheduled and seeded.`);

    // 12. Seed Super Admin
    console.log('👤 Seeding Super Admin...');
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'kuldeepkumawat2383@gmail.com';
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD || 'Admin@123';
    
    const superAdmin = new User({
      fullname: 'Super Admin',
      email: adminEmail,
      countryCode: '+91',
      phoneNumber: '9876543210',
      password: adminPassword,
      role: ROLES.SUPER_ADMIN,
      isOtpVerified: true,
      isHiringOtpVerified: true,
      isActive: true,
    });
    await superAdmin.save();
    console.log('✅ Super Admin seeded.');

    console.log('\n🌟 DATABASE SEEDING COMPLETED SUCCESSFULY! 🌟');
    console.log(`📊 TOTAL SEEDED RECORDS:`);
    console.log(`   - 👤 Recruiters:  5`);
    console.log(`   - 👨‍💻 Candidates:  45`);
    console.log(`   - 🏢 Companies:   5`);
    console.log(`   - 💼 Jobs Posted: 20`);
    console.log(`   - 📄 Resumes:     30`);
    console.log(`   - 📝 Applications:40`);
    console.log(`   - 🎤 Practice Mocks:15`);
    console.log(`   - 📅 Recruiter Live:10`);
    console.log(`   - 👤 Super Admin: 1\n`);

    // Exit
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding process failed:', error.message);
    process.exit(1);
  }
};

// Start Seeding
seedDB();
