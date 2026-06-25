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
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="qName">
          <Input id="qName" name="qName" placeholder="Your name" required />
        </Field>
        <Field label="Phone" htmlFor="qPhone">
          <Input id="qPhone" name="qPhone" placeholder="Mobile number" inputMode="numeric" required />
        </Field>
      </div>
      <Field label="Your Query" htmlFor="qMessage">
        <Textarea id="qMessage" name="qMessage" placeholder="Write your message..." required />
      </Field>
      <Button type="submit" className="w-fit">Submit Enquiry</Button>
      {submitted ? (
        <p className="rounded-[var(--radius-card)] border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4 text-sm text-[var(--ui-primary)]" role="status">
          Thank you. Enquiry submission will be connected in a later update.
        </p>
      ) : null}
    </form>
  );
}
