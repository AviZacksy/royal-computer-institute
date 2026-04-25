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
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-control)] bg-gold/15 text-xl">
              📄
            </div>
            <div>
              <p className="text-base font-extrabold text-royal">
                Certificate Apply
              </p>
              <p className="mt-1 text-sm text-muted">
                Submit details to request certificate (demo UI).
              </p>
            </div>
          </div>

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

            <div className="grid gap-2 sm:flex sm:items-center">
              <Button type="submit" className="w-full sm:w-auto">
                Apply
              </Button>
              <span className="text-sm font-semibold text-muted">
                This feature will be activated in the full system.
              </span>
            </div>
          </form>

          {applyDone ? (
            <div
              className="mt-5 rounded-[var(--radius-card)] border border-gold/20 bg-section p-4 text-sm font-extrabold text-royal"
              role="status"
            >
              This feature will be activated in the full system.
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-control)] bg-gold/15 text-xl">
              🔎
            </div>
            <div>
              <p className="text-base font-extrabold text-royal">
                Certificate Verification
              </p>
              <p className="mt-1 text-sm text-muted">
                Enter certificate number to verify (demo UI).
              </p>
            </div>
          </div>

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

            <div className="grid gap-2 sm:flex sm:items-center">
              <Button type="submit" className="w-full sm:w-auto">
                Verify
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setVerifyDone(true)}
                className="w-full sm:w-auto"
              >
                Demo Result
              </Button>
            </div>
          </form>

          {verifyDone ? (
            <div className="mt-5 rounded-[var(--radius-card)] border border-gold/20 bg-section p-4">
              <p className="text-sm font-extrabold text-royal">
                Verification Result (Demo)
              </p>
              <p className="mt-1 text-sm font-semibold text-muted">
                This feature will be activated in the full system.
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

