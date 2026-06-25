import { PanelShell } from "@/components/panels/PanelShell";
import { LogoutButton } from "@/components/panels/LogoutButton";
import { STUDENT_NAV } from "@/config/panel-nav";

export default function StudentPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelShell title="Student Portal" navItems={STUDENT_NAV} logoutAction={<LogoutButton />}>
      {children}
    </PanelShell>
  );
}
