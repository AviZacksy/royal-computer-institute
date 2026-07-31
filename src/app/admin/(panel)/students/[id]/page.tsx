import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getFileUrl } from "@/lib/storage";
import { ResetStudentPasswordForm } from "@/components/admin/ResetStudentPasswordForm";
import { DeleteStudentButton } from "@/components/admin/DeleteStudentButton";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireAdminSession();
  if (!session) return null;

  const student = await db.studentProfile.findUnique({
    where: {
      id: params.id,
      instituteId: session.instituteId,
    },
    include: {
      course: true,
      user: true,
    },
  });

  if (!student) {
    notFound();
  }

  // Generate public URLs for documents if they exist
  const photoUrl = student.photoStorageKey ? await getFileUrl("documents", student.photoStorageKey) : null;
  const aadhaarUrl = student.aadhaarStorageKey ? await getFileUrl("documents", student.aadhaarStorageKey) : null;
  const marksheetUrl = student.marksheetStorageKey ? await getFileUrl("documents", student.marksheetStorageKey) : null;
  const signatureUrl = student.signatureStorageKey ? await getFileUrl("documents", student.signatureStorageKey) : null;

  return (
    <PanelPage
      title="Student Profile"
      subtitle={`Detailed view for ${student.name}`}
    >
      <div className="mb-6">
        <Link
          href="/admin/students"
          className="text-sm font-semibold text-[var(--ui-primary)] hover:underline"
        >
          &larr; Back to all students
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Summary & Photo */}
        <div className="md:col-span-1 space-y-6">
          <div className="rounded-xl border border-[var(--ui-border)] bg-white p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 mb-4 bg-gray-50 flex items-center justify-center">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt={student.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-gray-400 font-medium text-sm">No Photo</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-sm text-gray-500 mb-3">{student.user.email}</p>
            <StatusBadge status={student.status} />
            <div className="mt-4 w-full pt-4 border-t border-gray-100 flex flex-col gap-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Course</span>
                <span className="font-semibold text-gray-900">{student.course?.name || "Not Assigned"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Enrollment</span>
                <span className="font-semibold text-gray-900">{student.enrollmentNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Applied On</span>
                <span className="font-semibold text-gray-900">{student.createdAt.toLocaleDateString("en-IN")}</span>
              </div>
            </div>
          </div>
          
          <ResetStudentPasswordForm studentId={student.id} />

          <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-xs text-red-700 mb-4 font-medium">
              Deleting this student will permanently erase their profile, user credentials, payments, and certificates. This action cannot be undone.
            </p>
            <DeleteStudentButton id={student.id} studentName={student.name} redirectTo="/admin/students" variant="button" />
          </div>
        </div>

        {/* Right Column: Full Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-[var(--ui-border)] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[var(--ui-border)] bg-gray-50/50 px-6 py-4">
              <h3 className="font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
              <DetailItem label="Full Name" value={student.name} />
              <DetailItem label="Father's Name" value={student.fatherName} />
              <DetailItem label="Mother's Name" value={student.motherName} />
              <DetailItem label="Gender" value={student.gender} />
              <DetailItem label="Date of Birth" value={student.dateOfBirth?.toLocaleDateString("en-IN")} />
              <DetailItem label="Highest Qualification" value={student.qualification} />
              <DetailItem label="Phone Number" value={student.phone} />
              <DetailItem label="Email Address" value={student.user.email} />
              
              <div className="sm:col-span-2">
                <DetailItem label="Current Address" value={student.currentAddress || student.address} />
              </div>
              <div className="sm:col-span-2">
                <DetailItem label="Permanent Address" value={student.permanentAddress} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--ui-border)] bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[var(--ui-border)] bg-gray-50/50 px-6 py-4">
              <h3 className="font-semibold text-gray-900">Uploaded Documents</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocumentLink label="Passport Photo" url={photoUrl} />
              <DocumentLink label="Aadhaar Card" url={aadhaarUrl} />
              <DocumentLink label="Highest Qualification Marksheet" url={marksheetUrl} />
              <DocumentLink label="Student Signature" url={signatureUrl} />
            </div>
          </div>
        </div>
      </div>
    </PanelPage>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">
        {value || "—"}
      </span>
    </div>
  );
}

function DocumentLink({ label, url }: { label: string; url: string | null }) {
  return (
    <div className="flex flex-col p-4 border border-gray-100 rounded-lg bg-gray-50/30">
      <span className="text-sm font-semibold text-gray-700 mb-2">{label}</span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
        >
          View Document &rarr;
        </a>
      ) : (
        <span className="text-sm text-gray-400 italic">Not uploaded</span>
      )}
    </div>
  );
}
