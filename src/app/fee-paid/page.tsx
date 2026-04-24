import { PageShell } from "@/components/ui/Page";
import { FeeStatusCards } from "@/components/forms/FeeStatusCards";

export default function FeePaidPage() {
  return (
    <PageShell
      title="Fee Paid"
      subtitle="Fee status / payment receipt demo UI."
    >
      <FeeStatusCards />
    </PageShell>
  );
}

