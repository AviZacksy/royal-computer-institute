import React from "react";
import { db } from "@/lib/db";
import type { MarqueeItemData } from "@/actions/admin/settings";

const colorClasses: Record<string, string> = {
  red: "text-red-700",
  blue: "text-blue-700",
  green: "text-green-700",
  yellow: "text-yellow-600",
  purple: "text-purple-700",
  black: "text-black",
};

function MarqueeItemView({ item }: { item: MarqueeItemData }) {
  const colorClass = colorClasses[item.color] || "text-blue-700";
  return (
    <span className="mx-8 sm:mx-16 flex items-center gap-2">
      {item.icon && <span>{item.icon}</span>}
      {item.highlight && <span className={`${colorClass} font-black`}>{item.highlight}</span>}
      {item.text && <span>{item.text}</span>}
    </span>
  );
}

export async function MarqueeBanner() {
  let items: MarqueeItemData[] = [
    { id: "1", icon: "🎉", highlight: "NEW BATCH", color: "red", text: "STARTS: 15th July 2026 - Admissions Open!" },
    { id: "2", icon: "💼", highlight: "URGENT REQUIREMENT", color: "blue", text: "Data Entry Operator at local IT firm - Contact Office" },
    { id: "3", icon: "🎓", highlight: "SCHOLARSHIP", color: "red", text: "20% off on all Advanced Diploma Courses this month!" },
  ];

  try {
    const content = await db.websiteContent.findFirst({
      where: { page: "settings_marquee" },
    });
    if (content && content.content) {
      // @ts-ignore
      const dbItems = content.content.items;
      if (Array.isArray(dbItems) && dbItems.length > 0) {
        if (typeof dbItems[0] === 'object' && dbItems[0] !== null) {
          items = dbItems as MarqueeItemData[];
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch marquee items in layout", error);
  }

  // If no items, don't render anything
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-[#f8d45c] text-gray-900 overflow-hidden border-b border-yellow-500/30 flex items-center relative z-50">
      <div className="relative flex max-w-full overflow-hidden py-1.5 sm:py-2">
        <div className="animate-marquee-slow whitespace-nowrap flex items-center text-xs sm:text-[14px] font-bold tracking-wide">
          {items.map((item, index) => (
            <MarqueeItemView key={`m1-${index}`} item={item} />
          ))}
          {/* Duplicate for seamless looping */}
          {items.map((item, index) => (
            <MarqueeItemView key={`m1-dup-${index}`} item={item} />
          ))}
        </div>
        
        {/* Second block for seamless marquee */}
        <div className="absolute top-0 animate-marquee2-slow whitespace-nowrap flex items-center text-xs sm:text-[14px] font-bold tracking-wide py-1.5 sm:py-2">
          {items.map((item, index) => (
            <MarqueeItemView key={`m2-${index}`} item={item} />
          ))}
          {/* Duplicate */}
          {items.map((item, index) => (
            <MarqueeItemView key={`m2-dup-${index}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
