import { db } from "@/lib/db";

const DEFAULT_SLUG = process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci";

export async function getDefaultInstitute() {
  return db.institute.findUnique({
    where: { slug: DEFAULT_SLUG },
  });
}

export async function requireDefaultInstitute() {
  const institute = await getDefaultInstitute();
  if (!institute) {
    throw new Error(
      `Default institute "${DEFAULT_SLUG}" not found. Run: npx prisma db seed`,
    );
  }
  return institute;
}
