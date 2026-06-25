"use client";

import { useState } from "react";
import { bulkImportQuestionsAction } from "@/actions/admin/questions";
import { Field } from "@/components/ui/Field";

type Props = {
  courses: { id: string; name: string }[];
  onSuccess?: () => void;
};

export function BulkImportForm({ courses, onSuccess }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!courseId) {
      setError("Please select a course first");
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const res = await bulkImportQuestionsAction(courseId, text);
      
      if (res && res.error) {
        setError(res.error);
      } else if (res && res.success) {
        setSuccess(res.success);
        if (onSuccess) onSuccess();
      }
    } catch (_err: unknown) {
      setError("Failed to read file");
    } finally {
      setPending(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-subtle)] p-4">
        <h3 className="font-semibold text-sm mb-2">CSV Format Instructions</h3>
        <p className="text-xs text-[var(--ui-muted)] mb-2">
          Your CSV file must include a header row and follow this exact column order:
        </p>
        <code className="text-xs bg-[var(--ui-bg)] p-2 rounded block whitespace-pre-wrap overflow-auto">
          Question,Option A,Option B,Option C,Option D,Correct Option (A/B/C/D),Marks
        </code>
      </div>

      <Field label="Target Course" htmlFor="bi-courseId">
        <select
          id="bi-courseId"
          className="flex h-10 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] focus:border-[var(--ui-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-primary)]"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          disabled={pending}
        >
          <option value="" disabled>Select a course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[var(--ui-text)]">
          Upload CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={pending || !courseId}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--ui-primary)] file:text-white hover:file:bg-[var(--ui-primary)]/90 flex w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)]"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </div>
  );
}
