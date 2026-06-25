import { PageShell } from "@/components/ui/Page";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getPublicCourses } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function QueryPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;
  const courses = await getPublicCourses();

  return (
    <PageShell title="Student Enquiry" subtitle="Send your query and we will contact you soon.">
      <EnquiryForm
        courses={courses.map((c) => ({ id: c.id, name: c.name }))}
        defaultCourseId={courseId}
      />
    </PageShell>
  );
}
