"use client";

import { useActionState, useState } from "react";
import { updateExamQuestionsAction } from "@/actions/admin/exams";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Question = {
  id: string;
  questionText: string;
  marks: number;
  correctOption: string;
};

type Props = {
  examId: string;
  allQuestions: Question[];
  selectedQuestionIds: string[];
};

export function ExamQuestionsForm({ examId, allQuestions, selectedQuestionIds }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedQuestionIds));
  const [search, setSearch] = useState("");

  const [state, action, pending] = useActionState(async () => {
    const ids = Array.from(selectedIds);
    return updateExamQuestionsAction(examId, ids);
  }, null as ActionState);

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const filtered = allQuestions.filter(q => 
    q.questionText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <form action={action} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-[var(--ui-text)]">Select Questions</h3>
          <p className="text-sm text-[var(--ui-muted)]">
            {selectedIds.size} questions selected ({Array.from(selectedIds).reduce((acc, id) => {
              const q = allQuestions.find(x => x.id === id);
              return acc + (q?.marks || 0);
            }, 0)} total marks)
          </p>
        </div>
        <div className="flex items-center gap-4">
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="text-sm text-green-600">{state.success}</p>}
          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save Selection"}
          </Button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search questions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex h-10 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] focus:border-[var(--ui-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-primary)]"
      />

      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
        {filtered.map(q => {
          const isSelected = selectedIds.has(q.id);
          return (
            <Card 
              key={q.id} 
              className={`p-4 cursor-pointer transition-colors border-2 ${isSelected ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-transparent hover:border-[var(--ui-border)]"}`}
            >
              <div className="flex items-start gap-3" onClick={() => toggleSelection(q.id)}>
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  readOnly
                  className="mt-1 h-4 w-4 rounded border-[var(--ui-border)] text-[var(--ui-primary)] focus:ring-[var(--ui-primary)]"
                />
                <div>
                  <p className="text-sm font-medium text-[var(--ui-text)]">{q.questionText}</p>
                  <p className="text-xs text-[var(--ui-muted)] mt-1">Marks: {q.marks} • Correct: {q.correctOption}</p>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-[var(--ui-muted)] py-8">No questions found.</p>
        )}
      </div>
    </form>
  );
}
