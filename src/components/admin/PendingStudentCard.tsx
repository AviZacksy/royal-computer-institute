"use client";

import { useActionState, useEffect } from "react";
import { reviewStudentAction } from "@/actions/admin/students";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/admin/StatusBadge";

type Course = { id: string; name: string };

type Student = {
  id: string;
  name: string;
  phone: string;
  email: string;
  courseName: string | null;
  createdAt: string;
};

export function PendingStudentCard({
  student,
  courses,
}: {
  student: Student;
  courses: Course[];
}) {
  const [state, action, pending] = useActionState(reviewStudentAction, null as ActionState);

  useEffect(() => {
    if (state?.success) {
      // Page revalidates; card unmounts when student leaves pending list
    }
  }, [state?.success]);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-extrabold text-[var(--ui-primary)]">{student.name}</p>
            <StatusBadge status="PENDING" />
            <a 
              href={`/documents/admission/${student.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-600 hover:underline ml-2"
            >
              View Form
            </a>
          </div>
          <p className="mt-1 text-sm text-[var(--ui-muted)]">{student.email}</p>
          <p className="text-sm text-[var(--ui-muted)]">{student.phone}</p>
          {student.courseName ? (
            <p className="mt-1 text-sm">Interested in: <span className="font-semibold">{student.courseName}</span></p>
          ) : null}
          <p className="mt-1 text-xs text-[var(--ui-muted)]">Applied {student.createdAt}</p>
        </div>
      </div>

      {state?.error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{state.success}</p>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <form action={action} className="grid gap-3 rounded-lg border border-[var(--ui-border)] bg-[var(--ui-surface)] p-4">
          <input type="hidden" name="studentId" value={student.id} />
          <input type="hidden" name="action" value="approve" />
          <p className="text-sm font-extrabold text-[var(--ui-primary)]">Approve & enroll</p>
          <Field label="Course" htmlFor={`course-${student.id}`}>
            <Select id={`course-${student.id}`} name="courseId" required defaultValue="">
              <option value="" disabled>Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Enrollment no. (optional)" htmlFor={`enr-${student.id}`}>
            <Input id={`enr-${student.id}`} name="enrollmentNumber" placeholder="Auto-generated if empty" />
          </Field>
          <Button type="submit" variant="accent" disabled={pending || courses.length === 0}>
            Approve
          </Button>
          {courses.length === 0 ? (
            <p className="text-xs text-amber-700">Add an active course before approving students.</p>
          ) : null}
        </form>

        <form action={action} className="grid gap-3 rounded-lg border border-[var(--ui-border)] p-4">
          <input type="hidden" name="studentId" value={student.id} />
          <input type="hidden" name="action" value="reject" />
          <p className="text-sm font-extrabold text-[var(--ui-primary)]">Reject</p>
          <Field label="Reason (optional)" htmlFor={`rej-${student.id}`}>
            <Input id={`rej-${student.id}`} name="rejectionReason" placeholder="Reason shown to student" />
          </Field>
          <Button type="submit" variant="outline" disabled={pending}>
            Reject
          </Button>
        </form>
      </div>
    </Card>
  );
}
