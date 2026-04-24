import { PageShell } from "@/components/ui/Page";
import { StudentLoginCard } from "@/components/forms/StudentLoginCard";

export default function StudentLoginPage() {
  return (
    <PageShell
      title="Student Login"
      subtitle="Demo login UI. No authentication is connected."
    >
      <div className="mx-auto w-full max-w-md">
        <StudentLoginCard />
      </div>
    </PageShell>
  );
}

