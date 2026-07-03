CREATE TABLE "StudentIdCard" (
  "id" TEXT NOT NULL,
  "instituteId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "batchTime" TEXT,
  "storageKey" TEXT NOT NULL,
  "generatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "StudentIdCard_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StudentIdCard_studentId_key" ON "StudentIdCard"("studentId");
CREATE INDEX "StudentIdCard_instituteId_idx" ON "StudentIdCard"("instituteId");

ALTER TABLE "StudentIdCard" ADD CONSTRAINT "StudentIdCard_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentIdCard" ADD CONSTRAINT "StudentIdCard_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
