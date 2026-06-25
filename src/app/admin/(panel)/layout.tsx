import { PanelShell } from "@/components/panels/PanelShell";
import { LogoutButton } from "@/components/panels/LogoutButton";
import { ADMIN_NAV } from "@/config/panel-nav";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelShell title="Admin Panel" navItems={ADMIN_NAV} logoutAction={<LogoutButton />}>
      {children}
    </PanelShell>
  );
}
