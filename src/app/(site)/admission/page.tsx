import Link from "next/link";
import { db } from "@/lib/db";
import { requireDefaultInstitute } from "@/lib/institute";
import { StudentAdmissionForm } from "@/components/forms/StudentAdmissionForm";

export const dynamic = "force-dynamic";

export default async function AdmissionPage() {
  const institute = await requireDefaultInstitute();
  const courses = await db.course.findMany({
    where: { instituteId: institute.id, isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="w-full">
      <section className="bg-[var(--ui-surface)] py-12 sm:py-24 border-b border-[var(--ui-border)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 relative z-10 text-center">
          <span className="text-sm font-extrabold text-[var(--ui-secondary)] tracking-[0.25em] uppercase mb-5 block">
            Get Started
          </span>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-[var(--ui-primary)] sm:text-7xl max-w-4xl mx-auto">
            Student Admission
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-[var(--ui-muted)] max-w-2xl mx-auto leading-relaxed">
            Submit your admission details, documents, and student login credentials for admin approval.
          </p>
          <p className="mt-5 text-sm text-[var(--ui-muted)]">
            Already admitted?{" "}
            <Link href="/student-login" className="font-bold text-[var(--ui-secondary)] hover:underline">
              Login with email and password
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-20">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <StudentAdmissionForm courses={courses} />
        </div>
      </section>
    </div>
  );
}
