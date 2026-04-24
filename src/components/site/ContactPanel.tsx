import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoNotice } from "@/components/demo/DemoNotice";

export function ContactPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <p className="text-base font-extrabold text-blue-950">
            Royal Computer Institute
          </p>
          <div className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
            <p>
              <span className="font-extrabold text-blue-950">
                Address:
              </span>{" "}
              Your institute address here (demo)
            </p>
            <p>
              <span className="font-extrabold text-blue-950">
                Phone:
              </span>{" "}
              +91-XXXXXXXXXX
            </p>
            <p>
              <span className="font-extrabold text-blue-950">
                Email:
              </span>{" "}
              info@example.com
            </p>
            <p>
              <span className="font-extrabold text-blue-950">Timing:</span>{" "}
              Mon–Sat, 10:00 AM – 6:00 PM
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href="/query">Send Query</ButtonLink>
            <ButtonAnchor
              href="https://wa.me/910000000000"
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
            >
              WhatsApp
            </ButtonAnchor>
            <ButtonLink href="#" variant="secondary">
              Call Now
            </ButtonLink>
          </div>

          <DemoNotice />
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-6">
          <p className="text-base font-extrabold text-blue-950">
            Map
          </p>
          <p className="mt-1 text-sm text-blue-900/70">
            Map will be added in the full system.
          </p>
        </div>
        <div className="aspect-[16/10] w-full bg-blue-50">
          <div className="h-full w-full grid place-items-center">
            <div className="rounded-2xl border border-blue-200 bg-white px-5 py-3 text-sm font-extrabold text-blue-900 shadow-sm">
              Map Placeholder
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

