import { PageShell } from "@/components/ui/Page";
import { ButtonLink } from "@/components/ui/Button";

export default function AdmissionPage() {
  return (
    <PageShell
      title="Admission Process"
      subtitle="Follow these simple steps to enroll in our job-oriented computer courses."
    >
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="space-y-6 text-[var(--ui-text)]">
          <p className="text-lg">
            Our admission process is completely online. Here is how you can start your journey with us:
          </p>

          <ol className="list-decimal list-inside space-y-4">
            <li className="pl-2">
              <strong className="font-bold text-[var(--ui-primary)]">Register Online:</strong> Fill out the online registration form with your basic details to create your student account.
            </li>
            <li className="pl-2">
              <strong className="font-bold text-[var(--ui-primary)]">Select Course:</strong> Choose the course you wish to pursue from our wide range of offerings.
            </li>
            <li className="pl-2">
              <strong className="font-bold text-[var(--ui-primary)]">Pay Fees:</strong> Make the fee payment securely through our online payment gateway.
            </li>
            <li className="pl-2">
              <strong className="font-bold text-[var(--ui-primary)]">Start Learning:</strong> Once payment is confirmed, your admission is complete and you can access your student dashboard.
            </li>
          </ol>
        </div>

        <div className="pt-6 border-t border-[var(--ui-border)] flex flex-col sm:flex-row gap-4 items-center">
          <ButtonLink href="/student/register" variant="primary" size="lg">
            Apply Now
          </ButtonLink>
          <p className="text-sm text-[var(--ui-muted)]">
            Already registered?{" "}
            <a href="/student-login" className="text-[var(--ui-primary)] hover:underline font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
    </PageShell>
  );
}

