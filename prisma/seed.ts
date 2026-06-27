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
        actualFee: course.actualFee,
        installmentFee: course.installmentFee,
        oneTimeFee: course.oneTimeFee,
        imagePath: course.imagePath,
        sortOrder: course.sortOrder,
        isActive: true,
      },
      create: {
        instituteId: institute.id,
        ...course,
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
