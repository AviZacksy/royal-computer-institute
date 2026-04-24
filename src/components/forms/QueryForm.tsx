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
        <Button type="submit">Submit Query</Button>
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

