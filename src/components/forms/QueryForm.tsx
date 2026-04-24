"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";

export function QueryForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="grid gap-5 sm:max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-950">
        <p className="font-extrabold">Special Online Query (Demo)</p>
        <p className="mt-1 text-blue-900/70">
          Send your message. Submission is disabled in demo mode.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="qName">
          <Input id="qName" name="qName" placeholder="Your name" required />
        </Field>
        <Field label="Phone" htmlFor="qPhone">
          <Input
            id="qPhone"
            name="qPhone"
            placeholder="Mobile number"
            inputMode="numeric"
            required
          />
        </Field>
      </div>

      <Field label="Your Query" htmlFor="qMessage">
        <Textarea
          id="qMessage"
          name="qMessage"
          placeholder="Write your message..."
          required
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" className="w-full sm:w-auto">
          Submit Query
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

