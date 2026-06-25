"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { submitExamAttemptAction } from "@/actions/student/exams";
import { Button } from "@/components/ui/Button";

type Question = {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  marks: number;
};

type Props = {
  examId: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
};

export function ExamTestingUI({ examId, title, durationMinutes, questions }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAutoSubmitted = useRef(false);

  const submitExam = useCallback(async (currentAnswers: Record<string, string>) => {
    setIsSubmitting(true);
    setError(null);
    const res = await submitExamAttemptAction(examId, currentAnswers);
    if (res && res.error) {
      setError(res.error);
      setIsSubmitting(false);
    } else {
      router.push("/student/exams");
      router.refresh();
    }
  }, [examId, router]);

  // Keep a ref to latest answers so the timer interval can read them
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Timer — counts down every second; auto-submits when it hits 0
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasAutoSubmitted.current) {
            hasAutoSubmitted.current = true;
            submitExam(answersRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitExam]);

  // Prevent accidental leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleManualSubmit = () => {
    if (window.confirm("Are you sure you want to submit? You cannot change your answers after submission.")) {
      submitExam(answers);
    }
  };

  const handleOptionSelect = (qId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Header */}
      <header className="flex-none bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">{questions.length} Questions</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 font-mono font-bold text-lg shadow-sm">
            <span>⏱</span> {formatTime(timeLeft)}
          </div>
          <Button 
            onClick={handleManualSubmit} 
            disabled={isSubmitting}
            className="px-6 shadow-md"
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </Button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-center font-medium border-b border-red-200">
          {error}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-4xl mx-auto w-full">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
                <span className="font-bold mr-2">{idx + 1}.</span> {q.questionText}
              </h3>
              <span className="text-sm font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded ml-4 whitespace-nowrap">
                {q.marks} Marks
              </span>
            </div>

            <div className="space-y-3">
              {(["A", "B", "C", "D"] as const).map((opt) => {
                const optText = q[`option${opt}` as keyof Question];
                const isSelected = answers[q.id] === opt;
                
                return (
                  <label 
                    key={opt} 
                    className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? "border-[var(--ui-primary)] bg-[var(--ui-primary)]/5" 
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 mr-4 flex-shrink-0 bg-white">
                      {isSelected && <div className="w-3 h-3 rounded-full bg-[var(--ui-primary)]" />}
                    </div>
                    <span className="font-medium text-gray-700 mr-2">{opt}.</span>
                    <span className="text-gray-800">{String(optText)}</span>
                    
                    {/* Hidden radio input for accessibility */}
                    <input 
                      type="radio" 
                      name={`question-${q.id}`} 
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleOptionSelect(q.id, opt)}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </main>
      
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[var(--ui-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900">Submitting Exam...</h2>
            <p className="text-gray-500 mt-2">Please do not close this page.</p>
          </div>
        </div>
      )}
    </div>
  );
}
