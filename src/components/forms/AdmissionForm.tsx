"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";

const COURSES = [
  "ADCA",
  "DCA",
  "Tally",
  "DTP",
  "Typing",
  "CCC",
  "Graphic Designing",
];

export function AdmissionForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="grid gap-5 sm:max-w-xl"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="rounded-[var(--radius-card)] border border-gold/20 bg-section p-4 text-sm text-royal">
        <p className="font-extrabold">Online Admission (Demo)</p>
        <p className="mt-1 text-muted">
          Fill your details. Submission is disabled in demo mode.
        </p>
      </div>

      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" placeholder="Enter full name" required />
      </Field>

      <Field label="Phone" htmlFor="phone" hint="10 digits">
        <Input
          id="phone"
          name="phone"
          placeholder="Enter mobile number"
          inputMode="numeric"
          required
        />
      </Field>

      <Field label="Course" htmlFor="course">
        <Select id="course" name="course" required defaultValue="">
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

      <div className="grid gap-3 sm:flex sm:items-center">
        <Button type="submit" className="w-full sm:w-auto">
          Submit
        </Button>
        <p className="text-sm font-semibold text-muted">
          This feature will be activated in the full system.
        </p>
      </div>

      {submitted ? (
        <div
          className="rounded-[var(--radius-card)] border border-gold/20 bg-section p-4 text-sm font-extrabold text-royal"
          role="status"
        >
          This feature will be activated in the full system.
        </div>
      ) : null}
    </form>
  );
}

