"use client";

import { useState } from "react";
import { previewBulkImportAction, confirmBulkImportAction, type PreviewImportResult } from "@/actions/admin/questions";
import { Field } from "@/components/ui/Field";
import * as XLSX from "xlsx";

type Props = {
  courses: { id: string; name: string }[];
  onSuccess?: () => void;
};

export function BulkImportForm({ courses, onSuccess }: Props) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [preview, setPreview] = useState<PreviewImportResult | null>(null);

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
    setPreview(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await previewBulkImportAction(courseId, formData);
      
      if (res && res.error) {
        setError(res.error);
      } else if (res) {
        setPreview(res);
      }
    } catch (_err: unknown) {
      setError("Failed to read file");
    } finally {
      setPending(false);
      // Reset input so the same file can be selected again if needed
      e.target.value = "";
    }
  };

  const handleConfirm = async () => {
    if (!preview?.validRows || preview.validRows.length === 0) {
      setError("No valid rows to import");
      return;
    }

    setPending(true);
    setError(null);
    
    try {
      const res = await confirmBulkImportAction(courseId, preview.validRows);
      
      if (res && res.error) {
        setError(res.error);
      } else if (res && res.success) {
        setSuccess(res.success);
        setPreview(null);
        if (onSuccess) onSuccess();
      }
    } catch (_err: unknown) {
      setError("Failed to save questions");
    } finally {
      setPending(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      ["Question", "Option A", "Option B", "Option C", "Option D", "Correct Option (A/B/C/D)", "Marks"],
      ["What is 2+2?", "3", "4", "5", "6", "B", "1"],
      ["Capital of France?", "London", "Berlin", "Paris", "Rome", "C", "2"]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(headers);
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, "Question_Bank_Template.xlsx");
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <>
          <div className="rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg-subtle)] p-4 relative">
            <button 
              type="button"
              onClick={downloadTemplate}
              className="absolute top-4 right-4 text-xs bg-[var(--ui-primary)] text-white px-2 py-1 rounded hover:bg-[var(--ui-primary)]/90"
            >
              Download Excel Template
            </button>
            <h3 className="font-semibold text-sm mb-2">Format Instructions</h3>
            <p className="text-xs text-[var(--ui-muted)] mb-2">
              Your CSV or Excel file must include a header row and follow this exact column order:
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
              Upload CSV or Excel File
            </label>
            <input
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
              disabled={pending || !courseId}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--ui-primary)] file:text-white hover:file:bg-[var(--ui-primary)]/90 flex w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Import Preview</h3>
            <button 
              type="button" 
              onClick={() => setPreview(null)}
              className="text-sm text-[var(--ui-muted)] hover:text-[var(--ui-text)]"
            >
              Cancel
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">{preview.validRows?.length || 0}</div>
              <div className="text-xs text-green-600 uppercase font-semibold">Valid</div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-700">{preview.skipped || 0}</div>
              <div className="text-xs text-yellow-600 uppercase font-semibold">Skipped (Dupes)</div>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700">{preview.errors?.length || 0}</div>
              <div className="text-xs text-red-600 uppercase font-semibold">Failed</div>
            </div>
          </div>

          {preview.errors && preview.errors.length > 0 && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <h4 className="text-sm font-bold text-red-800 mb-2">Errors found:</h4>
              <ul className="text-xs text-red-700 list-disc list-inside max-h-32 overflow-y-auto">
                {preview.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {preview.validRows && preview.validRows.length > 0 ? (
            <div>
              <h4 className="text-sm font-semibold mb-2">Preview (first 5 valid rows):</h4>
              <div className="overflow-x-auto border border-[var(--ui-border)] rounded-md">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--ui-bg-subtle)] border-b border-[var(--ui-border)]">
                    <tr>
                      <th className="p-2">Question</th>
                      <th className="p-2">Correct</th>
                      <th className="p-2">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.validRows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-b border-[var(--ui-border)] last:border-0">
                        <td className="p-2 truncate max-w-[200px]">{row.questionText}</td>
                        <td className="p-2">{row.correctOption}</td>
                        <td className="p-2">{row.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <button
            onClick={handleConfirm}
            disabled={pending || !preview.validRows || preview.validRows.length === 0}
            className="w-full py-2 bg-[var(--ui-primary)] text-white rounded-md font-semibold disabled:opacity-50 hover:bg-[var(--ui-primary)]/90"
          >
            {pending ? "Saving..." : `Confirm Import of ${preview.validRows?.length || 0} Questions`}
          </button>
        </div>
      )}
    </div>
  );
}
