"use client";

import { useState } from "react";
import timelineData from "@/chapters/chapter-03/content/timeline.json";
import TimelineCard from "./TimelineCard";
import MemoryModal from "./MemoryModal";
import ChapterContainer from "./ChapterContainer";
import FadeIn from "./FadeIn";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { Heart } from "lucide-react";

export default function Chapter3View() {
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  return (
    <ChapterContainer
      chapterId={3}
      title="Timeline of Memories"
      subtitle="A walk down memory lane, tracing the milestones and moments that shaped your beautiful journey."
    >
      <div className="relative w-full py-8">
        {/* Ambient background glows */}
        <BackgroundGlow color="violet" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="magenta" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />
        
        {/* DESKTOP VIEW (Horizontal Scrolling Timeline) */}
        <div className="hidden md:block relative w-full overflow-x-auto py-24 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          
          {/* Curvy Wavy SVG Floral Ribbon Vine connecting timeline points */}
          <svg className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 w-full h-8 opacity-40 z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 20" fill="none">
            <path d="M0,10 Q125,0 250,10 T500,10 T750,10 T1000,10" stroke="rgba(244,63,94,0.4)" strokeWidth="3" fill="none" />
            <path d="M125,5 Q130,0 135,5 Q130,10 125,5" fill="rgba(244,63,94,0.3)" />
            <path d="M375,15 Q380,10 385,15 Q380,20 375,15" fill="rgba(244,63,94,0.3)" />
            <path d="M625,5 Q630,0 636,5 Q630,10 625,5" fill="rgba(244,63,94,0.3)" />
            <path d="M875,15 Q880,10 885,15 Q880,20 875,15" fill="rgba(244,63,94,0.3)" />
          </svg>

          {/* Cards Flex Container */}
          <div className="flex gap-16 px-12 relative z-10 min-w-max items-center h-[36rem]">
            {timelineData.map((entry, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div key={idx} className="relative flex flex-col items-center w-80">
                  {/* Card positioned above or below */}
                  <div className={`absolute ${isEven ? "bottom-[3.5rem]" : "top-[3.5rem]"} left-0 right-0 flex justify-center`}>
                    <TimelineCard
                      entry={entry}
                      index={idx}
                      isEven={isEven}
                      basePath="/api/assets/chapters/chapter-03/images/"
                      onClick={() => setSelectedEntry(entry)}
                    />
                  </div>

                  {/* Central Heart Node Dot (no Framer Motion) */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="w-7 h-7 rounded-full bg-white border border-primary/30 cursor-pointer shadow-md flex items-center justify-center hover:bg-pink-50 hover:scale-125 transition-all duration-300 focus:outline-none"
                    >
                      <Heart className="w-3.5 h-3.5 fill-primary text-primary" />
                    </button>
                    <span className="text-xs font-sans font-bold text-rose-400 mt-2 absolute top-7 whitespace-nowrap">
                      {entry.year}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE VIEW (Vertical Stack Timeline) */}
        <div className="md:hidden relative pl-8 py-8 space-y-12">
          {/* Left Dashed Pink Timeline Vine */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-primary/20" />

          {timelineData.map((entry, idx) => (
            <div key={idx} className="relative">
              {/* Vertical Heart Node Dot */}
              <div className="absolute -left-[29px] top-4 flex items-center justify-center z-10">
                <div className="w-6 h-6 rounded-full bg-white border border-primary/30 flex items-center justify-center shadow-sm">
                  <Heart className="w-3 h-3 fill-primary text-primary" />
                </div>
              </div>

              {/* Card Container */}
              <FadeIn delay={idx * 0.1} direction="left">
                <TimelineCard
                  entry={entry}
                  index={idx}
                  isEven={true}
                  basePath="/api/assets/chapters/chapter-03/images/"
                  onClick={() => setSelectedEntry(entry)}
                />
              </FadeIn>
            </div>
          ))}
        </div>

        {/* Modal Overlay Detail Viewer */}
        <MemoryModal
          isOpen={selectedEntry !== null}
          onClose={() => setSelectedEntry(null)}
          memory={selectedEntry}
          basePath="/api/assets/chapters/chapter-03/images/"
        />
      </div>
    </ChapterContainer>
  );
}
