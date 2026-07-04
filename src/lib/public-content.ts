import { db } from "@/lib/db";
import { getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
import type { Course, GalleryItem } from "@prisma/client";

export type AboutContent = {
  title: string;
  description: string;
  introduction: string;
  mission: string;
  vision: string;
  imageUrl: string | null;
  imagePath: string | null;
  sections: Array<{ title: string; description: string }>;
};

export const DEFAULT_ABOUT_CONTENT: AboutContent = {
  title: "Welcome to Royal Computer Institute",
  description:
    "Bihar's premier computer training center dedicated to building professional careers through practical education.",
  introduction:
    "Royal Computer Institute is a premier institute for Programming and Coding Classes located in Motihari. We offer expert training in Python, Java, C, C++, Full-Stack Web Development, Data Analysis, Data Science, and AI.",
  mission:
    "We believe that theoretical knowledge must be paired with hands-on practice. That's why our state-of-the-art computer labs are designed to provide every student with the independent practice time they need to master their chosen technologies and secure successful placements.",
  vision:
    "To make practical, job-ready computer education accessible to every learner through disciplined training, updated course content, and student-first support.",
  imageUrl: null,
  imagePath: null,
  sections: [
    { title: "Practical Lab Training", description: "1:1 computer ratio for hands-on experience." },
    { title: "Online Admission Portal", description: "Easy, paperless registration from anywhere." },
    { title: "Mock & Final Exams", description: "Online portal to prepare for final certifications." },
    { title: "Govt. Recognized", description: "Verifiable certificates useful for job placements." },
  ],
};

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

export async function resolveWebsiteImageUrl(
  content: Pick<AboutContentRecord, "imageStorageKey" | "imagePath">,
) {
  if (content.imageStorageKey) {
    if (process.env.SUPABASE_URL && process.env.STORAGE_PROVIDER !== "local") {
      const provider = getStorageProvider();
      return provider.getSignedUrl(STORAGE_BUCKETS.gallery, content.imageStorageKey);
    }

    const encoded = content.imageStorageKey.split("/").map(encodeURIComponent).join("/");
    return `/api/gallery/${encoded}`;
  }

  return content.imagePath?.trim() || null;
}

type AboutContentRecord = {
  title: string;
  description: string;
  content: unknown;
  imageStorageKey: string | null;
  imagePath: string | null;
};

function normalizeAboutContent(record: AboutContentRecord | null, imageUrl: string | null): AboutContent {
  if (!record) return DEFAULT_ABOUT_CONTENT;
  const raw = record.content && typeof record.content === "object" ? record.content as Record<string, unknown> : {};
  const sections = Array.isArray(raw.sections)
    ? raw.sections
        .map((section) => {
          if (!section || typeof section !== "object") return null;
          const item = section as Record<string, unknown>;
          const title = typeof item.title === "string" ? item.title.trim() : "";
          const description = typeof item.description === "string" ? item.description.trim() : "";
          return title && description ? { title, description } : null;
        })
        .filter((section): section is { title: string; description: string } => Boolean(section))
    : DEFAULT_ABOUT_CONTENT.sections;

  return {
    title: record.title || DEFAULT_ABOUT_CONTENT.title,
    description: record.description || DEFAULT_ABOUT_CONTENT.description,
    introduction:
      typeof raw.introduction === "string" && raw.introduction.trim()
        ? raw.introduction
        : DEFAULT_ABOUT_CONTENT.introduction,
    mission:
      typeof raw.mission === "string" && raw.mission.trim()
        ? raw.mission
        : DEFAULT_ABOUT_CONTENT.mission,
    vision:
      typeof raw.vision === "string" && raw.vision.trim()
        ? raw.vision
        : DEFAULT_ABOUT_CONTENT.vision,
    imageUrl,
    imagePath: record.imagePath,
    sections,
  };
}

export async function getPublicAboutContent() {
  try {
    const record = await db.websiteContent.findFirst({
      where: {
        page: "about",
        institute: {
          slug: process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci",
          isActive: true,
        },
      },
    });

    return normalizeAboutContent(record, record ? await resolveWebsiteImageUrl(record) : null);
  } catch (error) {
    console.error("Database connection error in getPublicAboutContent:", error);
    return DEFAULT_ABOUT_CONTENT;
  }
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

export async function getPublicCourseById(id: string) {
  try {
    const course = await db.course.findFirst({
      where: {
        id,
        isActive: true,
        institute: {
          slug: process.env.DEFAULT_INSTITUTE_SLUG ?? "royal-ci",
          isActive: true,
        },
      },
    });

    if (!course) return null;

    return {
      ...course,
      imageUrl: await resolveCourseImageUrl(course),
    };
  } catch (error) {
    console.error("Database connection error in getPublicCourseById:", error);
    return null;
  }
}

export async function getPublicEnquiryCourses() {
  const courses = await getPublicCourses();
  return courses.filter((course) => course.isEnquiryEnabled);
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
