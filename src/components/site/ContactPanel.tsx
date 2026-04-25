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
          <p className="text-base font-extrabold text-royal">
            {INSTITUTE.name}
          </p>
          <p className="mt-1 text-sm font-semibold text-muted">
            Director: {INSTITUTE.directorName}
          </p>
          <div className="mt-4 grid gap-3 text-sm text-muted">
            <p>
              <span className="font-extrabold text-royal">
                Address:
              </span>{" "}
              {INSTITUTE.addressLines.join(", ")}
            </p>
            <p>
              <span className="font-extrabold text-royal">
                Phone:
              </span>{" "}
              {INSTITUTE.phoneDisplay}
            </p>
            <p>
              <span className="font-extrabold text-royal">
                Email:
              </span>{" "}
              {INSTITUTE.email}
            </p>
            <p>
              <span className="font-extrabold text-royal">Timing:</span>{" "}
              {INSTITUTE.timingDisplay}
            </p>
            <p>
              <span className="font-extrabold text-royal">Instagram:</span>{" "}
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
          <p className="text-base font-extrabold text-royal">
            Map
          </p>
          <p className="mt-1 text-sm text-muted">
            Map will be added in the full system.
          </p>
        </div>
        <div className="aspect-[16/10] w-full bg-section">
          <div className="h-full w-full grid place-items-center">
            <div className="rounded-[var(--radius-card)] border border-black/10 bg-white px-5 py-3 text-sm font-extrabold text-royal shadow-[var(--shadow-card)]">
              Map Placeholder
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

