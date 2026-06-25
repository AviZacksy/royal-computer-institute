import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { DataTable, PanelPage } from "@/components/panels/PanelPage";
import { EnquiryStatusForm } from "@/components/admin/EnquiryStatusForm";

function enquiryStatusLabel(status: string) {
  if (status === "CONTACTED") return "Contacted";
  if (status === "CLOSED") return "Closed";
  return "Pending";
}

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  const enquiries = await db.enquiry.findMany({
    where: { instituteId: session.instituteId },
    include: { course: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PanelPage title="Enquiries" subtitle="Student enquiries from the public website">
      <DataTable
        headers={["Date", "Name", "Phone", "Course", "Message", "Status", "Action"]}
        rows={enquiries.map((e) => [
          e.createdAt.toLocaleDateString("en-IN"),
          e.name,
          e.phone,
          e.course?.name ?? e.courseInterest ?? "—",
          <span key={`msg-${e.id}`} className="line-clamp-2 max-w-xs">{e.message ?? "—"}</span>,
          enquiryStatusLabel(e.status),
          <EnquiryStatusForm key={`st-${e.id}`} enquiryId={e.id} currentStatus={e.status} />,
        ])}
      />
    </PanelPage>
  );
}
