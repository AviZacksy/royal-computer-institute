"use server";

import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type MarqueeItemData = {
  id: string;
  icon: string;
  highlight: string;
  color: string;
  text: string;
};

export async function getMarqueeItems(): Promise<MarqueeItemData[]> {
  try {
    const session = await requireAdminSession();
    if (!session) throw new Error("Unauthorized");

    const content = await db.websiteContent.findUnique({
      where: {
        instituteId_page: {
          instituteId: session.instituteId,
          page: "settings_marquee",
        },
      },
    });

    const defaultItems: MarqueeItemData[] = [
      { id: "1", icon: "🎉", highlight: "NEW BATCH", color: "red", text: "STARTS: 15th July 2026 - Admissions Open!" },
      { id: "2", icon: "💼", highlight: "URGENT REQUIREMENT", color: "blue", text: "Data Entry Operator at local IT firm - Contact Office" },
      { id: "3", icon: "🎓", highlight: "SCHOLARSHIP", color: "red", text: "20% off on all Advanced Diploma Courses this month!" },
    ];

    if (!content || !content.content) {
      return defaultItems;
    }
    
    // @ts-ignore
    const items = content.content.items;
    
    if (Array.isArray(items) && items.length > 0) {
      // Handle legacy string array
      if (typeof items[0] === 'string') {
        return items.map((str, i) => ({
          id: String(i),
          icon: "📌",
          highlight: "",
          color: "blue",
          text: str.replace(/<[^>]*>?/gm, ''), // strip html
        }));
      }
      return items as MarqueeItemData[];
    }
    
    return defaultItems;
  } catch (error) {
    console.error("Failed to fetch marquee items", error);
    return [];
  }
}

export async function updateMarqueeItems(items: MarqueeItemData[]) {
  const session = await requireAdminSession();
  if (!session) throw new Error("Unauthorized");
  
  await db.websiteContent.upsert({
    where: {
      instituteId_page: {
        instituteId: session.instituteId,
        page: "settings_marquee",
      }
    },
    create: {
      instituteId: session.instituteId,
      page: "settings_marquee",
      title: "Marquee Settings",
      description: "Scrolling text on the website header",
      content: { items },
    },
    update: {
      content: { items },
    }
  });

  revalidatePath("/", "layout");
}
