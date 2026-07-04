import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { AboutContentForm } from "@/components/admin/AboutContentForm";
import { getPublicAboutContent } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  const about = await getPublicAboutContent();

  return (
    <PanelPage
      title="About Management"
      subtitle="Edit the public About page content without changing its design"
    >
      <AboutContentForm initial={about} />
    </PanelPage>
  );
}
