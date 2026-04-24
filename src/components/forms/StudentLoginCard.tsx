"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

export function StudentLoginCard() {
  const [show, setShow] = useState(false);

  return (
    <div className="sm:max-w-xl">
      <form
        className="grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          setShow(true);
        }}
      >
        <Field label="Login ID" htmlFor="loginId">
          <Input id="loginId" name="loginId" placeholder="Enter login id" required />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            required
          />
        </Field>

        <div className="flex items-center gap-3">
          <Button type="submit">Login</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShow(true)}
          >
            View Demo Message
          </Button>
        </div>
      </form>

      {show ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Student Dashboard Coming in Full Version
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            This feature will be activated in the full system.
          </p>
        </div>
      ) : null}
    </div>
  );
}

