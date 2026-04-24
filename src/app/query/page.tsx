import { PageShell } from "@/components/ui/Page";
import { QueryForm } from "@/components/forms/QueryForm";

export default function QueryPage() {
  return (
    <PageShell
      title="Special Online Query"
      subtitle="Send your query. This is a demo UI (no backend submission)."
    >
      <QueryForm />
    </PageShell>
  );
}

