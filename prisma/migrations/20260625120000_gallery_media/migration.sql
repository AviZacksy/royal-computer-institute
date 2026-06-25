-- CreateEnum
CREATE TYPE "GalleryMediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "GalleryItem" ADD COLUMN "mediaType" "GalleryMediaType" NOT NULL DEFAULT 'IMAGE';
ALTER TABLE "GalleryItem" ADD COLUMN "mediaUrl" TEXT;
ALTER TABLE "GalleryItem" ALTER COLUMN "storageKey" DROP NOT NULL;
