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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit">Submit</Button>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          This feature will be activated in the full system.
        </p>
      </div>

      {submitted ? (
        <div
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
          role="status"
        >
          This feature will be activated in the full system.
        </div>
      ) : null}
    </form>
  );
}

