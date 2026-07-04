CREATE TABLE "WebsiteContent" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "imageStorageKey" TEXT,
    "imagePath" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "WebsiteContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WebsiteContent_instituteId_page_key" ON "WebsiteContent"("instituteId", "page");
CREATE INDEX "WebsiteContent_instituteId_page_idx" ON "WebsiteContent"("instituteId", "page");

ALTER TABLE "WebsiteContent" ADD CONSTRAINT "WebsiteContent_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
