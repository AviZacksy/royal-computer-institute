import { db } from "@/lib/db";
import { getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
import type { GalleryItem } from "@prisma/client";

/** Resolve a gallery item to a browser-loadable URL (server-side). */
export async function resolveGalleryMediaUrl(
  item: Pick<GalleryItem, "mediaUrl" | "storageKey">,
) {
  if (item.mediaUrl?.trim()) {
    return item.mediaUrl.trim();
  }
  if (!item.storageKey) {
    return null;
  }

  if (process.env.SUPABASE_URL && process.env.STORAGE_PROVIDER !== "local") {
    const provider = getStorageProvider();
    return provider.getSignedUrl(STORAGE_BUCKETS.gallery, item.storageKey);
  }

  const encoded = item.storageKey.split("/").map(encodeURIComponent).join("/");
  return `/api/gallery/${encoded}`;
}

export async function getPublicCourses() {
  const institute = await db.institute.findFirst({
    where: { slug: process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci", isActive: true },
  });
  if (!institute) return [];

  return db.course.findMany({
    where: { instituteId: institute.id, isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getPublicGalleryItems() {
  const institute = await db.institute.findFirst({
    where: { slug: process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci", isActive: true },
  });
  if (!institute) return [];

  return db.galleryItem.findMany({
    where: { instituteId: institute.id, isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
}

export const STATIC_GALLERY_PHOTOS = Array.from({ length: 8 }).map((_, i) => ({
  id: `static-${i + 1}`,
  title: `Institute Photo ${i + 1}`,
  mediaType: "IMAGE" as const,
  src: `/images/gallery/${i + 1}.jpg`,
}));

export const STATIC_GALLERY_VIDEOS = [
  {
    title: "Coaching Video (Institute)",
    subtitle: "Short overview video",
    src: "/Video/Coching%20video/video_2026-04-24_17-53-58.mp4",
  },
  {
    title: "Institute Ad Video 1",
    subtitle: "Promo video",
    src: "/Video/Ads/video_2026-04-24_17-53-41.mp4",
  },
  {
    title: "Institute Ad Video 2",
    subtitle: "Promo video",
    src: "/Video/Ads/video_2026-04-24_17-53-53.mp4",
  },
];
