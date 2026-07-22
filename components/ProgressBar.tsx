"use client";

import { useStore } from "@/lib/store";
import { Heart } from "lucide-react";

export default function ProgressBar() {
  const currentChapter = useStore((state) => state.currentChapter);
  const setCurrentChapter = useStore((state) => state.setCurrentChapter);

  // Active Chapters for our current Phase 10 scope
  const chapters = [
    { id: 1, name: "Home Portal" },
    { id: 2, name: "Meet the Queen" },
    { id: 3, name: "Memories Timeline" },
    { id: 4, name: "Fun Statistics" },
    { id: 5, name: "Memory Wall" },
    { id: 6, name: "Funny Moment" },
    { id: 7, name: "Our Story" },
    { id: 8, name: "Secret Letters" },
    { id: 9, name: "Fun Quiz" },
    { id: 10, name: "Appreciation" },
    { id: 11, name: "Wish Tree" },
    { id: 12, name: "Treasure Hunt" },
    { id: 13, name: "Memory Playlist" },
    { id: 14, name: "Special Reasons" },
    { id: 15, name: "Our Cinema" },
    { id: 16, name: "Journey Map" },
    { id: 17, name: "Sky Memories" },
    { id: 18, name: "Future Letter" },
    { id: 19, name: "Gratitude" },
    { id: 20, name: "Ending" },
  ];

  // Hide progress indicators on intro/loading or ending pages
  if (currentChapter === 0 || currentChapter > 20) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full glassmorphism-pink shadow-md border border-primary/10">
      {chapters.map((ch) => {
        const isActive = ch.id <= currentChapter;

        return (
          <button
            key={ch.id}
            onClick={() => setCurrentChapter(ch.id)}
            className="focus:outline-none relative group cursor-pointer hover:scale-120 active:scale-90 transition-transform duration-300"
            aria-label={`Jump to ${ch.name}`}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isActive
                  ? "fill-primary text-primary filter drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]"
                  : "text-primary/20 hover:text-primary/50"
              }`}
            />
            {/* Cute hover tooltip */}
            <span className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-[9px] text-primary font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              {ch.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
