import { Award, BadgeCheck, FileCheck2, Search } from "lucide-react";
import { db } from "@/lib/db";
import { SectionHeading } from "@/components/site/SectionHeading";

export const dynamic = "force-dynamic";

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query: rawQuery } = await searchParams;
  const query = rawQuery?.trim();

  let student = null;
  
  if (query) {
    // Check if query matches a certificate number first
    const cert = await db.certificate.findFirst({
      where: {
        certificateNumber: { equals: query, mode: "insensitive" },
        institute: { slug: process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci", isActive: true },
      },
      include: { student: true },
    });

    const enrollmentToSearch = cert ? cert.student.enrollmentNumber : query;

    student = await db.studentProfile.findFirst({
      where: {
        enrollmentNumber: { equals: enrollmentToSearch, mode: "insensitive" },
        institute: {
          slug: process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci",
          isActive: true,
        },
      },
      include: { 
        course: { select: { name: true } },
        certificates: { select: { id: true, certificateNumber: true, generatedAt: true, course: { select: { name: true } } } },
        marksheets: { select: { id: true, exam: { select: { title: true } }, obtainedMarks: true, totalMarks: true, grade: true, generatedAt: true } },
      },
    });
  }

  return (
    <div className="w-full bg-[var(--ui-surface)]">
      <section className="mx-auto max-w-screen-xl px-4 py-16 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Verify Records"
          title="Verification Portal"
          subtitle="Verify student records, certificates, and marksheets issued by Royal Computer Institute."
          centered
        />

        <div className="mt-12 max-w-3xl mx-auto">
          <div className="rounded-xl border border-[var(--ui-border)] bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left mb-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[var(--ui-secondary)]">
                <BadgeCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">
                  Unified Verification
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--ui-muted)]">
                  Enter an Enrollment Number or Certificate Number to verify the record.
                </p>
              </div>
            </div>

            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                name="query"
                defaultValue={query}
                placeholder="e.g. RCI261234 or CERT-..."
                className="h-14 flex-1 rounded-xl border-2 border-[var(--ui-border)] bg-white px-5 text-base font-semibold outline-none transition focus:border-[var(--ui-secondary)] focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[var(--ui-secondary)] px-8 text-base font-extrabold text-white transition hover:bg-blue-700"
              >
                <Search className="h-5 w-5" />
                Verify Now
              </button>
            </form>

            {query && (
              <div className="mt-8 border-t border-[var(--ui-border)] pt-8">
                {student ? (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <BadgeCheck className="h-5 w-5 text-emerald-600" />
                        <h3 className="text-lg font-extrabold text-emerald-800">Valid Student Record</h3>
                      </div>
                      <dl className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                        <ResultItem label="Student Name" value={student.name} />
                        <ResultItem label="Enrollment No." value={student.enrollmentNumber || "-"} />
                        <ResultItem label="Course" value={student.course?.name ?? "Not assigned"} />
                        <ResultItem
                          label="Admission Date"
                          value={student.admissionDate ? student.admissionDate.toLocaleDateString("en-IN") : "-"}
                        />
                        <ResultItem
                          label="Status"
                          value={student.status === "APPROVED" ? "Active / Completed" : "Inactive"}
                        />
                      </dl>
                    </div>

                    {(student.certificates.length > 0 || student.marksheets.length > 0) && (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {student.certificates.length > 0 && (
                          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
                            <h4 className="font-extrabold text-blue-900 mb-3 flex items-center gap-2">
                              <Award className="h-4 w-4" /> Certificates
                            </h4>
                            <div className="space-y-3">
                              {student.certificates.map(cert => (
                                <div key={cert.id} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 flex justify-between items-center">
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">{cert.certificateNumber}</p>
                                    <p className="text-[10px] text-gray-500">{cert.course.name}</p>
                                  </div>
                                  <a href={`/documents/certificate/${cert.id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
                                    View
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {student.marksheets.length > 0 && (
                          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
                            <h4 className="font-extrabold text-blue-900 mb-3 flex items-center gap-2">
                              <FileCheck2 className="h-4 w-4" /> Marksheets
                            </h4>
                            <div className="space-y-3">
                              {student.marksheets.map(marksheet => (
                                <div key={marksheet.id} className="bg-white p-3 rounded-lg shadow-sm border border-blue-100 flex justify-between items-center">
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">{marksheet.exam.title}</p>
                                    <p className="text-[10px] text-gray-500">Grade: {marksheet.grade}</p>
                                  </div>
                                  <a href={`/documents/marksheet/${marksheet.id}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
                                    View
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-red-200 bg-red-50 text-center px-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-red-800 mb-1">No Record Found</h3>
                    <p className="text-sm text-red-600 max-w-sm">
                      We couldn&apos;t find any student, certificate, or marksheet matching the provided number. Please check for typos and try again.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-[var(--ui-muted)]">
        {label}
      </dt>
      <dd className="mt-1 font-extrabold text-[var(--ui-primary)] text-sm">{value}</dd>
    </div>
  );
}
