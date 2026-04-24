import { PageShell } from "@/components/ui/Page";
import { ExamLoginCard } from "@/components/forms/ExamLoginCard";

export default function ExamLoginPage() {
  return (
    <PageShell
      title="Exam Login"
      subtitle="Demo UI for the online exam login system."
    >
      <div className="mx-auto w-full max-w-md">
        <ExamLoginCard />
      </div>
    </PageShell>
  );
}

