import { PageShell } from "@/components/ui/Page";
import { StudentLoginCard } from "@/components/forms/StudentLoginCard";

export default async function StudentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;
  return (
    <PageShell
      title="Student Login"
      subtitle="Login to access your student dashboard, notes, fees, and exams."
    >
      <div className="mx-auto w-full max-w-md">
        <StudentLoginCard registered={params.registered === "1"} />
      </div>
    </PageShell>
  );
}
