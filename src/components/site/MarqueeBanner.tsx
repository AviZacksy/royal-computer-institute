import React from "react";

export function MarqueeBanner() {
  return (
    <div className="w-full bg-[#f8d45c] text-gray-900 overflow-hidden border-b border-yellow-500/30 flex items-center relative z-50">
      <div className="relative flex max-w-full overflow-hidden py-1.5 sm:py-2">
        <div className="animate-marquee-slow whitespace-nowrap flex items-center text-xs sm:text-[14px] font-bold tracking-wide">
          <span className="mx-8 sm:mx-16">
            🎉 <span className="text-red-700 font-black">NEW BATCH</span> STARTS: 15th July 2026 - Admissions Open!
          </span>
          <span className="mx-8 sm:mx-16">
            💼 <span className="text-blue-700 font-black">URGENT REQUIREMENT</span>: Data Entry Operator at local IT firm - Contact Office
          </span>
          <span className="mx-8 sm:mx-16">
            🎓 <span className="text-red-700 font-black">SCHOLARSHIP</span>: 20% off on all Advanced Diploma Courses this month!
          </span>
          
          {/* Duplicate for seamless looping */}
          <span className="mx-8 sm:mx-16">
            🎉 <span className="text-red-700 font-black">NEW BATCH</span> STARTS: 15th July 2026 - Admissions Open!
          </span>
          <span className="mx-8 sm:mx-16">
            💼 <span className="text-blue-700 font-black">URGENT REQUIREMENT</span>: Data Entry Operator at local IT firm - Contact Office
          </span>
          <span className="mx-8 sm:mx-16">
            🎓 <span className="text-red-700 font-black">SCHOLARSHIP</span>: 20% off on all Advanced Diploma Courses this month!
          </span>
        </div>
        
        {/* We use two divs for absolute seamless marquee if needed, but for simplicity, duplicating text inside one block works perfectly with 100% translation if text is long enough. 
            The globals.css animates transform: translateX(0%) to translateX(-100%).
            Wait, if it translates -100%, the entire block moves out. We need a second block to follow it. */}
        <div className="absolute top-0 animate-marquee2-slow whitespace-nowrap flex items-center text-xs sm:text-[14px] font-bold tracking-wide py-1.5 sm:py-2">
          <span className="mx-8 sm:mx-16">
            🎉 <span className="text-red-700 font-black">NEW BATCH</span> STARTS: 15th July 2026 - Admissions Open!
          </span>
          <span className="mx-8 sm:mx-16">
            💼 <span className="text-blue-700 font-black">URGENT REQUIREMENT</span>: Data Entry Operator at local IT firm - Contact Office
          </span>
          <span className="mx-8 sm:mx-16">
            🎓 <span className="text-red-700 font-black">SCHOLARSHIP</span>: 20% off on all Advanced Diploma Courses this month!
          </span>
          
          {/* Duplicate */}
          <span className="mx-8 sm:mx-16">
            🎉 <span className="text-red-700 font-black">NEW BATCH</span> STARTS: 15th July 2026 - Admissions Open!
          </span>
          <span className="mx-8 sm:mx-16">
            💼 <span className="text-blue-700 font-black">URGENT REQUIREMENT</span>: Data Entry Operator at local IT firm - Contact Office
          </span>
          <span className="mx-8 sm:mx-16">
            🎓 <span className="text-red-700 font-black">SCHOLARSHIP</span>: 20% off on all Advanced Diploma Courses this month!
          </span>
        </div>
      </div>
    </div>
  );
}
