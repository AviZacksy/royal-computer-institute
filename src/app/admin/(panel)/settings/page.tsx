import { getMarqueeItems } from "@/actions/admin/settings";
import { MarqueeForm } from "./MarqueeForm";
import { Settings as SettingsIcon } from "lucide-react";

export const metadata = {
  title: "Website Settings - Royal Computer Institute",
};

export default async function SettingsPage() {
  const initialItems = await getMarqueeItems();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[var(--ui-accent)]/20 rounded-lg">
          <SettingsIcon className="w-6 h-6 text-[var(--ui-primary)]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">Website Settings</h1>
          <p className="text-sm font-semibold text-gray-500">Manage global website content and configurations.</p>
        </div>
      </div>

      <MarqueeForm initialItems={initialItems} />
      
      {/* Other settings can be added here in the future */}
    </div>
  );
}
