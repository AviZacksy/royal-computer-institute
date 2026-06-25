import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SEED_COURSES = [
  { name: "ADCA", description: "Advanced Diploma in Computer Applications", duration: "12 Months", totalFee: 12000, sortOrder: 1 },
  { name: "DCA", description: "Diploma in Computer Applications", duration: "6 Months", totalFee: 8000, sortOrder: 2 },
  { name: "Tally", description: "Accounting + GST basics", duration: "3 Months", totalFee: 5000, sortOrder: 3 },
  { name: "DTP", description: "Desktop Publishing tools", duration: "3 Months", totalFee: 4500, sortOrder: 4 },
  { name: "Typing", description: "Hindi/English typing practice", duration: "2 Months", totalFee: 2000, sortOrder: 5 },
  { name: "CCC", description: "Course on Computer Concepts", duration: "3 Months", totalFee: 3500, sortOrder: 6 },
  { name: "Graphic Designing", description: "Design fundamentals + tools", duration: "6 Months", totalFee: 10000, sortOrder: 7 },
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
        totalFee: course.totalFee,
        sortOrder: course.sortOrder,
        isActive: true,
      },
      create: {
        instituteId: institute.id,
        ...course,
      },
    });
  }

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
