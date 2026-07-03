ALTER TABLE "StudentProfile"
ADD COLUMN "marksheetStorageKey" TEXT,
ADD COLUMN "aadhaarStorageKey" TEXT,
ADD COLUMN "signatureStorageKey" TEXT,
ADD COLUMN "admissionFormStorageKey" TEXT,
ADD COLUMN "admissionNumber" TEXT,
ADD COLUMN "admissionDate" TIMESTAMPTZ(6),
ADD COLUMN "admissionDetails" JSONB;

CREATE UNIQUE INDEX "StudentProfile_instituteId_admissionNumber_key"
ON "StudentProfile"("instituteId", "admissionNumber");
