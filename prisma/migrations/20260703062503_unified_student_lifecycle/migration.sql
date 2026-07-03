-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('ADMISSION', 'EXAM');

-- AlterTable
ALTER TABLE "PaymentSubmission" ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'ADMISSION';

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "currentAddress" TEXT,
ADD COLUMN     "dateOfBirth" DATE,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "motherName" TEXT,
ADD COLUMN     "permanentAddress" TEXT,
ADD COLUMN     "qualification" TEXT;

-- CreateTable
CREATE TABLE "ExamRegistration" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "paymentSubmissionId" TEXT,
    "isAccessEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ExamRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExamRegistration_paymentSubmissionId_key" ON "ExamRegistration"("paymentSubmissionId");

-- CreateIndex
CREATE INDEX "ExamRegistration_instituteId_idx" ON "ExamRegistration"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamRegistration_studentId_examId_key" ON "ExamRegistration"("studentId", "examId");

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamRegistration" ADD CONSTRAINT "ExamRegistration_paymentSubmissionId_fkey" FOREIGN KEY ("paymentSubmissionId") REFERENCES "PaymentSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
