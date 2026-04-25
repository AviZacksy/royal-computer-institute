import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14">
      <div className="rounded-[var(--radius-card)] border border-[var(--ui-border)] bg-white p-8 shadow-[var(--shadow-card)] sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--ui-muted)]">
          404
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--ui-text)] sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-[var(--ui-muted)]">
          The page you’re looking for doesn’t exist in this demo.
        </p>
        <div className="mt-8">
          <ButtonLink href="/" size="lg">
            Back to Home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

