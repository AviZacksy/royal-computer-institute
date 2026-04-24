import { PageShell } from "@/components/ui/Page";
import { AdmissionForm } from "@/components/forms/AdmissionForm";

export default function AdmissionPage() {
  return (
    <PageShell
      title="Online Admission"
      subtitle="Fill the form below. This is a demo UI (no backend submission)."
    >
      <AdmissionForm />
    </PageShell>
  );
}

