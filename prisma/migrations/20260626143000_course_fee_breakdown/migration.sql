ALTER TABLE "Course"
ADD COLUMN "actualFee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "installmentFee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "oneTimeFee" INTEGER NOT NULL DEFAULT 0;

UPDATE "Course"
SET
  "actualFee" = "totalFee",
  "installmentFee" = "totalFee",
  "oneTimeFee" = "totalFee"
WHERE
  "actualFee" = 0
  AND "installmentFee" = 0
  AND "oneTimeFee" = 0;
