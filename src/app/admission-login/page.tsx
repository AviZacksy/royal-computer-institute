import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { DemoAction } from "@/components/demo/DemoAction";

export default function AdmissionLoginPage() {
  return (
    <PageShell
      title="Admission Login"
      subtitle="Demo login UI for admission portal access."
    >
      <div className="mx-auto w-full max-w-md">
        <Card className="border border-blue-100 bg-white">
          <CardContent className="p-6 sm:p-7">
            <p className="text-sm font-extrabold text-blue-950">Login Details</p>
            <p className="mt-1 text-sm text-blue-900/70">
              Use your admission ID and password (demo).
            </p>

            <div className="mt-6 grid gap-4">
              <Field label="Admission ID" htmlFor="admission-id">
                <Input id="admission-id" placeholder="Enter admission ID" />
              </Field>
              <Field label="Password" htmlFor="admission-password">
                <Input
                  id="admission-password"
                  type="password"
                  placeholder="Enter password"
                />
              </Field>
            </div>

            <div className="mt-5">
              <DemoAction label="Login" variant="primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

