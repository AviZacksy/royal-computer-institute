import { PageShell } from "@/components/ui/Page";
import { ContactPanel } from "@/components/site/ContactPanel";

export default function ContactPage() {
  return (
    <PageShell
      title="Contact"
      subtitle="Address, phone, email, WhatsApp button, and map placeholder (demo)."
    >
      <ContactPanel />
    </PageShell>
  );
}

