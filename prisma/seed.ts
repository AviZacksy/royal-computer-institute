import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED_COURSES = [
  {
    name: "ADCA",
    description: "Advance Diploma in Computer Application",
    duration: "12 MONTH",
    actualFee: 8500,
    installmentFee: 7500,
    oneTimeFee: 6500,
    imagePath: "/courses/adca.png",
    sortOrder: 1,
  },
  {
    name: "DCA",
    description: "Diploma in Computer Application",
    duration: "6 MONTH",
    actualFee: 5000,
    installmentFee: 4000,
    oneTimeFee: 3500,
    imagePath: "/courses/dca.png",
    sortOrder: 2,
  },
  {
    name: "DTP",
    description: "Desktop Publishing",
    duration: "3 MONTH",
    actualFee: 4500,
    installmentFee: 4000,
    oneTimeFee: 3500,
    imagePath: "/courses/dtp.png",
    sortOrder: 3,
  },
  {
    name: "CFA",
    description: "Computer Financial Accounting",
    duration: "3 MONTH",
    actualFee: 4500,
    installmentFee: 4000,
    oneTimeFee: 3500,
    imagePath: "/courses/cfa.png",
    sortOrder: 4,
  },
  {
    name: "DFA",
    description: "Diploma in Financial Accounting",
    duration: "9 MONTH",
    actualFee: 6000,
    installmentFee: 5000,
    oneTimeFee: 4500,
    imagePath: "/courses/dfa.png",
    sortOrder: 5,
  },
  {
    name: "CCC",
    description: "Course on Computer Concepts",
    duration: "3 MONTH",
    actualFee: 4500,
    installmentFee: 4000,
    oneTimeFee: 3500,
    imagePath: "/courses/ccc.png",
    sortOrder: 6,
  },
  {
    name: "MS OFFICE",
    description: "Microsoft Office",
    duration: "3 MONTH",
    actualFee: 4000,
    installmentFee: 3500,
    oneTimeFee: 3000,
    imagePath: "/courses/ms_office.png",
    sortOrder: 7,
  },
  {
    name: "TYPING",
    description: "English & Hindi Typing",
    duration: "3 MONTH",
    actualFee: 1500,
    installmentFee: 1500,
    oneTimeFee: 1200,
    imagePath: "/courses/typing.png",
    sortOrder: 8,
  },
  {
    name: "ACCOUNTING",
    description: "Financial Accounting",
    duration: "3 MONTH",
    actualFee: 4500,
    installmentFee: 4000,
    oneTimeFee: 3500,
    imagePath: "/courses/accounting.png",
    sortOrder: 9,
  },
  {
    name: "GRAPHICS",
    description: "Graphic Designing",
    duration: "3 MONTH",
    actualFee: 5000,
    installmentFee: 4500,
    oneTimeFee: 4000,
    imagePath: "/courses/graphics.png",
    sortOrder: 10,
  },
];

const COURSE_SYLLABUS: Record<string, string> = {
  ADCA: "Fundamentals of Computer\nMicrosoft Windows\nMicrosoft Office\nDTP\nTally Prime\nHTML Basics\nInternet & Multimedia",
  DCA: "Fundamentals of Computer\nMicrosoft Windows\nMicrosoft Office\nHTML Basics\nInternet & Multimedia\nFile & Folder Management",
  DTP: "Adobe PageMaker\nAdobe Photoshop\nAdobe Illustrator\nCorelDRAW\nCanva\nAlbum, poster, card and certificate design",
  CFA: "Computer Fundamentals\nAccounting Fundamentals\nTally Prime\nGST Basics\nMicrosoft Excel\nPractical Business Accounting",
  DFA: "Fundamentals of Computer\nMicrosoft Office\nAccounting Fundamentals\nTally Prime\nTaxation\nAdvanced Excel\nBanking & Finance\nPractical Training",
  CCC: "Introduction to Computer\nComputer Fundamentals\nOperating System (Windows)\nInternet & Multimedia\nPractical Training",
  "MS OFFICE": "Microsoft Word\nMicrosoft Excel\nMicrosoft PowerPoint\nMicrosoft Access\nMicrosoft Outlook",
  TYPING: "English Typing\nHindi Typing\nRemington Gail Layout\nTyping speed improvement\nAccuracy and productivity practice",
  ACCOUNTING: "Basic Accounting\nTally Prime\nGST & TDS\nVoucher Creation\nStock Maintenance\nReports & Financial Statements",
  GRAPHICS: "Photoshop\nCorelDRAW\nIllustrator\nCanva\nPoster and banner design\nCertificate and card design",
};

const ABOUT_CONTENT = {
  title: "Welcome to Royal Computer Institute",
  description:
    "Bihar's premier computer training center dedicated to building professional careers through practical education.",
  content: {
    introduction:
      "Royal Computer Institute is a premier institute for Programming and Coding Classes located in Motihari. We offer expert training in Python, Java, C, C++, Full-Stack Web Development, Data Analysis, Data Science, and AI.",
    mission:
      "We believe that theoretical knowledge must be paired with hands-on practice. That's why our state-of-the-art computer labs are designed to provide every student with the independent practice time they need to master their chosen technologies and secure successful placements.",
    vision:
      "To make practical, job-ready computer education accessible to every learner through disciplined training, updated course content, and student-first support.",
    sections: [
      { title: "Practical Lab Training", description: "1:1 computer ratio for hands-on experience." },
      { title: "Online Admission Portal", description: "Easy, paperless registration from anywhere." },
      { title: "Mock & Final Exams", description: "Online portal to prepare for final certifications." },
      { title: "Govt. Recognized", description: "Verifiable certificates useful for job placements." },
    ],
  },
};

async function main() {
  const slug = process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci";
  const instituteName = process.env.DEFAULT_INSTITUTE_NAME ?? "Royal Computer Institute";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@royalci.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  const institute = await prisma.institute.upsert({
    where: { slug },
    update: { name: instituteName, isActive: true },
    create: { slug, name: instituteName, isActive: true },
  });

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: {
      instituteId_email: {
        instituteId: institute.id,
        email: adminEmail.toLowerCase(),
      },
    },
    update: {},
    create: {
      instituteId: institute.id,
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const course of SEED_COURSES) {
    const totalFee = course.oneTimeFee;

    await prisma.course.upsert({
      where: {
        instituteId_name: {
          instituteId: institute.id,
          name: course.name,
        },
      },
      update: {
        description: course.description,
        duration: course.duration,
        totalFee,
        syllabus: COURSE_SYLLABUS[course.name],
        actualFee: course.actualFee,
        installmentFee: course.installmentFee,
        oneTimeFee: course.oneTimeFee,
        imagePath: course.imagePath,
        sortOrder: course.sortOrder,
        isActive: true,
        isEnquiryEnabled: true,
      },
      create: {
        instituteId: institute.id,
        ...course,
        syllabus: COURSE_SYLLABUS[course.name],
        totalFee,
      },
    });
  }

  await prisma.course.updateMany({
    where: {
      instituteId: institute.id,
      name: { notIn: SEED_COURSES.map((course) => course.name) },
    },
    data: { isActive: false },
  });

  await prisma.websiteContent.upsert({
    where: {
      instituteId_page: {
        instituteId: institute.id,
        page: "about",
      },
    },
    update: {},
    create: {
      instituteId: institute.id,
      page: "about",
      ...ABOUT_CONTENT,
    },
  });

  console.log("Seed complete.");
  console.log(`Institute: ${institute.name} (${institute.slug})`);
  console.log(`Courses: ${SEED_COURSES.length}`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
