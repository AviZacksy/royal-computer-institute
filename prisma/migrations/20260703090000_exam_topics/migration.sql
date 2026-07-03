CREATE TYPE "MockTopic" AS ENUM (
  'FUNDAMENTAL',
  'WINDOWS',
  'MS_WORD',
  'MS_EXCEL',
  'MS_POWERPOINT',
  'TALLY',
  'PHOTOSHOP',
  'CORELDRAW',
  'PAGEMAKER'
);

ALTER TABLE "Question" ADD COLUMN "topic" "MockTopic";
ALTER TABLE "Exam" ADD COLUMN "topic" "MockTopic";

CREATE INDEX "Question_instituteId_topic_idx" ON "Question"("instituteId", "topic");
CREATE INDEX "Exam_instituteId_type_topic_idx" ON "Exam"("instituteId", "type", "topic");
