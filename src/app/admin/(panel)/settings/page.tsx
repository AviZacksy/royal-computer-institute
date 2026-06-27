import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { AdminAccountSettingsForm } from "@/components/admin/AdminAccountSettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  return (
    <PanelPage title="Account Settings" subtitle="Manage your admin account credentials.">
      <div className="max-w-2xl">
        <AdminAccountSettingsForm currentEmail={session.email} />
      </div>
    </PanelPage>
  );
}
