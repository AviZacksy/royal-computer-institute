import { Card } from "@/components/ui/Card";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-8 sm:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-blue-950 sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-2xl text-sm leading-6 text-blue-900/70 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        <Card className="overflow-hidden">
          <div className="p-5 sm:p-8">{children}</div>
        </Card>
      </div>
    </div>
  );
}

