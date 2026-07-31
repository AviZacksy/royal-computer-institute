import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { BIHAR_CITIES } from "@/lib/seo/locations/bihar";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://royalcomputerinstitute.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Pages
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/courses",
    "/gallery",
    "/verification",
  ];

  const staticUrls = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic Course Pages from Database
  let courseUrls: MetadataRoute.Sitemap = [];
  try {
    const courses = await db.course.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    });

    courseUrls = courses.map((c) => ({
      url: `${SITE_URL}/courses/${c.id}`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Error generating sitemap course URLs:", error);
  }

  // 3. Dynamic Location Pages (Bihar Cities)
  const locationUrls = BIHAR_CITIES.map((city) => ({
    url: `${SITE_URL}/locations/${city}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...courseUrls, ...locationUrls];
}
