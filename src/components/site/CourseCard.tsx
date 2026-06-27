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
}

export function CourseCard({ name, subHeading, description, duration, fee, actualFee, image = "/banner/banner1.jpeg" }: CourseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

        {/* Fees Section (Expands on Click) */}
        {fee && (
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
              <div className="flex flex-col gap-0.5 sm:gap-1 text-[11px] sm:text-[13px] font-medium text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">One Time Fee:</span>
                  <span className="text-green-600 font-bold">{fee}</span>
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
      </div>
    </div>
  );
}
