import type { MockTopic } from "@prisma/client";

export const MOCK_TOPICS: Array<{ value: MockTopic; label: string }> = [
  { value: "FUNDAMENTAL", label: "Fundamental" },
  { value: "WINDOWS", label: "Windows" },
  { value: "MS_WORD", label: "MS Word" },
  { value: "MS_EXCEL", label: "MS Excel" },
  { value: "MS_POWERPOINT", label: "MS PowerPoint" },
  { value: "TALLY", label: "Tally" },
  { value: "PHOTOSHOP", label: "Photoshop" },
  { value: "CORELDRAW", label: "CorelDraw" },
  { value: "PAGEMAKER", label: "PageMaker" },
];

export const FINAL_EXAM_COURSES = ["DCA", "DTP", "TALLY"];

export function getMockTopicLabel(topic?: MockTopic | null) {
  return MOCK_TOPICS.find((item) => item.value === topic)?.label ?? "General";
}

export function isFinalExamCourse(courseName: string) {
  const normalized = courseName.trim().toUpperCase();
  return normalized === "DCA" || normalized === "DTP" || normalized === "TALLY" || normalized.includes("TALLY");
}
