import { db } from "@/lib/db";
import { getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
import type { Course, GalleryItem } from "@prisma/client";

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

export async function resolveCourseImageUrl(
  course: Pick<Course, "imageStorageKey" | "imagePath">,
) {
  if (course.imageStorageKey) {
    if (process.env.SUPABASE_URL && process.env.STORAGE_PROVIDER !== "local") {
      const provider = getStorageProvider();
      return provider.getSignedUrl(STORAGE_BUCKETS.gallery, course.imageStorageKey);
    }

    const encoded = course.imageStorageKey.split("/").map(encodeURIComponent).join("/");
    return `/api/gallery/${encoded}`;
  }

  return course.imagePath?.trim() || null;
}

export async function getPublicCourses() {
  try {
    const courses = await db.course.findMany({
      where: {
        isActive: true,
        institute: {
          slug: process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci",
          isActive: true,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return Promise.all(
      courses.map(async (course) => ({
        ...course,
        imageUrl: await resolveCourseImageUrl(course),
      })),
    );
  } catch (error) {
    console.error("Database connection error in getPublicCourses:", error);
    return [];
  }
}

export async function getPublicGalleryItems() {
  try {
    return await db.galleryItem.findMany({
      where: {
        isActive: true,
        institute: {
          slug: process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci",
          isActive: true,
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("Database connection error in getPublicGalleryItems:", error);
    return [];
  }
}

export const STATIC_GALLERY_PHOTOS = [
  "WhatsApp Image 2026-06-26 at 3.39.44 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.46 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.46 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.47 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.47 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.55 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.56 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.56 PM (2).jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.56 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.57 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.57 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.58 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.58 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.39.59 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.00 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.00 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.01 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.04 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.05 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.05 PM (2).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.05 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.06 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.06 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.07 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.07 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.08 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.08 PM (2).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.08 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.09 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.09 PM (2).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.09 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.10 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.10 PM (2).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.10 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.11 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.11 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.12 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.12 PM (2).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.12 PM.jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.13 PM (1).jpeg",
  "WhatsApp Image 2026-06-26 at 3.40.13 PM.jpeg"
].map((filename, i) => ({
  id: `static-${i + 1}`,
  title: `Gallery Photo ${i + 1}`,
  mediaType: "IMAGE" as const,
  src: `/gallery/${encodeURIComponent(filename)}`,
}));

export const STATIC_GALLERY_VIDEOS = [
  {
    title: "Gallery Video 1",
    subtitle: "Campus Life",
    src: "/gallery/" + encodeURIComponent("WhatsApp Video 2026-06-26 at 3.39.51 PM.mp4"),
  },
  {
    title: "Gallery Video 2",
    subtitle: "Campus Life",
    src: "/gallery/" + encodeURIComponent("WhatsApp Video 2026-06-26 at 3.39.55 PM.mp4"),
  },
  {
    title: "Gallery Video 3",
    subtitle: "Campus Life",
    src: "/gallery/" + encodeURIComponent("WhatsApp Video 2026-06-26 at 3.40.04 PM.mp4"),
  },
];
