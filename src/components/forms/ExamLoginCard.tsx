"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

export function ExamLoginCard() {
  const [show, setShow] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-control)] bg-gold/15 text-xl">
            📝
          </div>
          <div>
            <p className="text-base font-extrabold text-royal">Exam Login</p>
            <p className="mt-1 text-sm text-muted">
              Online exam portal UI (demo). Login is disabled.
            </p>
          </div>
        </div>

      <form
        className="mt-6 grid gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          setShow(true);
        }}
      >
        <Field label="Login ID" htmlFor="examLoginId">
          <Input
            id="examLoginId"
            name="examLoginId"
            placeholder="Enter login id"
            required
          />
        </Field>
        <Field label="Password" htmlFor="examPassword">
          <Input
            id="examPassword"
            name="examPassword"
            type="password"
            placeholder="Enter password"
            required
          />
        </Field>

        <div className="grid gap-2 sm:flex sm:items-center">
          <Button type="submit" className="w-full sm:w-auto">
            Login
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShow(true)}
            className="w-full sm:w-auto"
          >
            Check Status
          </Button>
        </div>
      </form>

      {show ? (
        <div className="mt-6 rounded-[var(--radius-card)] border border-gold/20 bg-section p-5">
          <p className="text-sm font-extrabold text-royal">
            Online Exam System will be activated after full development
          </p>
          <p className="mt-1 text-sm font-semibold text-muted">
            This feature will be activated in the full system.
          </p>
        </div>
      ) : null}
      </CardContent>
    </Card>
  );
}

