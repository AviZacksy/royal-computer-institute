import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-950 sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
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

