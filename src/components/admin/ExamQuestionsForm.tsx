"use client";

import type { MockTopic } from "@prisma/client";
import { useActionState, useState } from "react";
import { updateExamQuestionsAction } from "@/actions/admin/exams";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getMockTopicLabel } from "@/config/exam-topics";

type Question = {
  id: string;
  questionText: string;
  marks: number;
  correctOption: string;
  topic: MockTopic | null;
};

type Props = {
  examId: string;
  examType: "MOCK" | "FINAL";
  allQuestions: Question[];
  selectedQuestionIds: string[];
};

export function ExamQuestionsForm({ examId, examType, allQuestions, selectedQuestionIds }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(selectedQuestionIds));
  const [search, setSearch] = useState("");
  const isFinalExam = examType === "FINAL";

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

  const selectedMarks = Array.from(selectedIds).reduce((acc, id) => {
    const question = allQuestions.find((item) => item.id === id);
    return acc + (question?.marks || 0);
  }, 0);

  const filtered = allQuestions.filter((question) => {
    const query = search.toLowerCase();
    return (
      question.questionText.toLowerCase().includes(query) ||
      getMockTopicLabel(question.topic).toLowerCase().includes(query)
    );
  });

  return (
    <form action={action} className="space-y-6">
      <div className="flex flex-col gap-4 rounded-lg border border-[var(--ui-border)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[var(--ui-text)]">Select Questions</h3>
          <p className="text-sm text-[var(--ui-muted)]">
            {selectedIds.size} questions selected ({selectedMarks} total marks)
          </p>
          {isFinalExam ? (
            <p className={`mt-1 text-xs font-bold ${selectedIds.size === 60 ? "text-green-600" : "text-amber-700"}`}>
              Final exam requires exactly 60 questions.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          {state?.success && <p className="text-sm text-green-600">{state.success}</p>}
          <Button type="submit" disabled={pending || (isFinalExam && selectedIds.size !== 60)}>
            {pending ? "Saving..." : "Save Selection"}
          </Button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search questions or topics..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex h-10 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] focus:border-[var(--ui-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-primary)]"
      />

      <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
        {filtered.map((question) => {
          const isSelected = selectedIds.has(question.id);
          return (
            <Card
              key={question.id}
              className={`cursor-pointer border-2 p-4 transition-colors ${isSelected ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" : "border-transparent hover:border-[var(--ui-border)]"}`}
            >
              <div className="flex items-start gap-3" onClick={() => toggleSelection(question.id)}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="mt-1 h-4 w-4 rounded border-[var(--ui-border)] text-[var(--ui-primary)] focus:ring-[var(--ui-primary)]"
                />
                <div>
                  <p className="text-sm font-medium text-[var(--ui-text)]">{question.questionText}</p>
                  <p className="mt-1 text-xs text-[var(--ui-muted)]">
                    {getMockTopicLabel(question.topic)} - Marks: {question.marks} - Correct: {question.correctOption}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-[var(--ui-muted)]">No questions found.</p>
        )}
      </div>
    </form>
  );
}
