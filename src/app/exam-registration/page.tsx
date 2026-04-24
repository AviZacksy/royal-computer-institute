import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { DemoAction } from "@/components/demo/DemoAction";

export default function ExamRegistrationPage() {
  return (
    <PageShell
      title="Online Exam Registration"
      subtitle="Demo registration form for online exams."
    >
      <div className="mx-auto w-full max-w-2xl">
        <Card className="border border-blue-100 bg-white">
          <CardContent className="p-6 sm:p-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Student Name" htmlFor="exam-reg-name">
                <Input id="exam-reg-name" placeholder="Enter full name" />
              </Field>
              <Field label="Mobile Number" htmlFor="exam-reg-mobile">
                <Input
                  id="exam-reg-mobile"
                  placeholder="Enter mobile number"
                  inputMode="numeric"
                />
              </Field>
              <Field label="Course" htmlFor="exam-reg-course">
                <Input id="exam-reg-course" placeholder="Select course (demo)" />
              </Field>
              <Field label="Exam ID / Roll No." htmlFor="exam-reg-id">
                <Input id="exam-reg-id" placeholder="Enter ID (demo)" />
              </Field>
            </div>

            <div className="mt-5">
              <DemoAction label="Register" variant="primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

