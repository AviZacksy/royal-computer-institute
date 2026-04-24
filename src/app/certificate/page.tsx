import { PageShell } from "@/components/ui/Page";
import { CertificatePanel } from "@/components/forms/CertificatePanel";

export default function CertificatePage() {
  return (
    <PageShell
      title="Certificate"
      subtitle="Apply for certificate and verify certificate (demo UI)."
    >
      <CertificatePanel />
    </PageShell>
  );
}

