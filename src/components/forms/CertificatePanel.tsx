"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";

const COURSES = ["ADCA", "DCA", "Tally", "DTP", "Typing", "CCC", "Graphic Designing"];

export function CertificatePanel() {
  const [applyDone, setApplyDone] = useState(false);
  const [verifyDone, setVerifyDone] = useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <p className="text-base font-semibold text-zinc-950 dark:text-white">
            Certificate Apply
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Submit details to request certificate.
          </p>

          <form
            className="mt-6 grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setApplyDone(true);
            }}
          >
            <Field label="Name" htmlFor="certName">
              <Input id="certName" name="certName" placeholder="Student name" required />
            </Field>
            <Field label="Course" htmlFor="certCourse">
              <Select id="certCourse" name="certCourse" defaultValue="" required>
                <option value="" disabled>
                  Select course
                </option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Phone" htmlFor="certPhone">
              <Input
                id="certPhone"
                name="certPhone"
                placeholder="Mobile number"
                inputMode="numeric"
                required
              />
            </Field>

            <div className="flex items-center gap-3">
              <Button type="submit">Apply</Button>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                This feature will be activated in the full system.
              </span>
            </div>
          </form>

          {applyDone ? (
            <div
              className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
              role="status"
            >
              This feature will be activated in the full system.
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-base font-semibold text-zinc-950 dark:text-white">
            Certificate Verification
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Enter certificate number to verify.
          </p>

          <form
            className="mt-6 grid gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setVerifyDone(true);
            }}
          >
            <Field label="Certificate No." htmlFor="certNo">
              <Input
                id="certNo"
                name="certNo"
                placeholder="e.g. RCI-CERT-0001"
                required
              />
            </Field>

            <div className="flex items-center gap-3">
              <Button type="submit">Verify</Button>
              <Button type="button" variant="outline" onClick={() => setVerifyDone(true)}>
                Demo Result
              </Button>
            </div>
          </form>

          {verifyDone ? (
            <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Verification Result (Demo)
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                This feature will be activated in the full system.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

