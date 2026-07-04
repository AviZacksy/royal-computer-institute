"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock } from "lucide-react";

interface CourseCardProps {
  name: string;
  subHeading?: string;
  description?: string;
  duration: string;
  fee?: string;
  actualFee?: string;
  image?: string;
  href?: string;
  enquiryHref?: string;
  details?: string | null;
}

export function CourseCard({ name, subHeading, description, duration, fee, actualFee, image = "/banner/banner1.jpeg", enquiryHref, details }: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailItems = details?.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) ?? [];

  return (
    <div className="group relative flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300">
      {/* Image Section */}
      <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden">
        <Image 
          src={image} 
          alt={name}
          fill
          unoptimized={image.startsWith("http")}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 font-display text-center leading-tight">
          <span className="focus:outline-none before:absolute before:inset-0">
            {name}
          </span>
        </h3>
        
        {subHeading && (
          <p className="mt-1 text-[11px] sm:text-sm font-medium text-gray-600 text-center leading-tight">
            {subHeading}
          </p>
        )}
        
        {description && (
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 flex-1 line-clamp-2 text-center">
            {description}
          </p>
        )}

        {/* Details Section (Expands on Click) */}
        {(fee || detailItems.length > 0) && (
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
              {detailItems.length > 0 ? (
                <div className="mb-3 rounded-lg bg-blue-50 p-3 text-left">
                  <p className="mb-2 text-[11px] sm:text-xs font-black uppercase tracking-wide text-[#0f2f6f]">
                    Course Details
                  </p>
                  <ul className="grid gap-1 text-[11px] sm:text-[13px] font-semibold leading-snug text-gray-700">
                    {detailItems.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2563eb]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="flex flex-col gap-0.5 sm:gap-1 text-[11px] sm:text-[13px] font-medium text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">One Time Fee:</span>
                  <span className="text-green-600 font-bold">{fee ?? "-"}</span>
                </div>
                {actualFee && actualFee !== fee ? (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Actual Fee:</span>
                    <span className="font-bold text-gray-400 line-through">{actualFee}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        
        {/* Footer Section */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-[#2563eb] font-bold text-sm sm:text-base">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#2563eb] text-white" />
            <span>{duration}</span>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="w-full sm:w-auto bg-[#3b82f6] text-white text-xs sm:text-[13px] font-medium px-2 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-[#2563eb] transition-colors relative z-10 shadow-sm"
          >
            {isExpanded ? 'View Less' : 'View More'}
          </button>
        </div>
        {enquiryHref ? (
          <a
            href={enquiryHref}
            className="relative z-10 mt-2 flex h-9 w-full items-center justify-center rounded bg-[#d4af37] text-xs font-bold text-[#071b45] shadow-sm transition-colors hover:bg-[#f3c93f]"
          >
            Enquiry
          </a>
        ) : null}
      </div>
    </div>
  );
}
