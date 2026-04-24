import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoAction } from "@/components/demo/DemoAction";
import { DemoNotice } from "@/components/demo/DemoNotice";
import { INSTITUTE, WHATSAPP_LINK } from "@/config/institute";

export function ContactPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <p className="text-base font-extrabold text-blue-950">
            {INSTITUTE.name}
          </p>
          <p className="mt-1 text-sm font-semibold text-blue-900/70">
            Director: {INSTITUTE.directorName}
          </p>
          <div className="mt-4 grid gap-3 text-sm text-blue-900/75">
            <p>
              <span className="font-extrabold text-blue-950">
                Address:
              </span>{" "}
              {INSTITUTE.addressLines.join(", ")}
            </p>
            <p>
              <span className="font-extrabold text-blue-950">
                Phone:
              </span>{" "}
              {INSTITUTE.phoneDisplay}
            </p>
            <p>
              <span className="font-extrabold text-blue-950">
                Email:
              </span>{" "}
              {INSTITUTE.email}
            </p>
            <p>
              <span className="font-extrabold text-blue-950">Timing:</span>{" "}
              {INSTITUTE.timingDisplay}
            </p>
            <p>
              <span className="font-extrabold text-blue-950">Instagram:</span>{" "}
              {INSTITUTE.instagramHandle}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href="/query">Send Query</ButtonLink>
            <ButtonAnchor
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
            >
              WhatsApp
            </ButtonAnchor>
            <DemoAction label="Call Now" variant="secondary" fullWidthOnMobile={false} />
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

