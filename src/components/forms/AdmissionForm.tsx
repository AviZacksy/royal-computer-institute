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
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
        <p className="font-extrabold">Online Admission (Demo)</p>
        <p className="mt-1 text-blue-900/70">
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
        <p className="text-sm font-semibold text-blue-900/70">
          This feature will be activated in the full system.
        </p>
      </div>

      {submitted ? (
        <div
          className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-extrabold text-blue-950"
          role="status"
        >
          This feature will be activated in the full system.
        </div>
      ) : null}
    </form>
  );
}

