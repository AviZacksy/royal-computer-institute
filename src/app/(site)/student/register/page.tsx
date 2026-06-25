import { db } from "@/lib/db";
import { requireDefaultInstitute } from "@/lib/institute";
import { PageShell } from "@/components/ui/Page";
import { StudentRegisterForm } from "@/components/forms/StudentRegisterForm";

export const dynamic = "force-dynamic";

export default async function StudentRegisterPage() {
  const institute = await requireDefaultInstitute();
  const courses = await db.course.findMany({
    where: { instituteId: institute.id, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <PageShell
      title="Student Registration"
      subtitle="Register for admission at Royal Computer Institute. Admin approval is required before login."
    >
      <StudentRegisterForm courses={courses} />
    </PageShell>
  );
}
