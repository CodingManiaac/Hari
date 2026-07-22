"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin } from "lucide-react";
import FadeIn from "./FadeIn";

interface TimelineEntry {
  year: string;
  age: string;
  title: string;
  description: string;
  image: string;
  location?: string;
}

interface TimelineCardProps {
  entry: TimelineEntry;
  onClick: () => void;
  basePath: string;
  index: number;
  isEven: boolean;
}

export default function TimelineCard({
  entry,
  onClick,
  basePath,
  index,
  isEven,
}: TimelineCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <FadeIn
      direction={isEven ? "up" : "down"}
      delay={index * 0.15}
      className="cursor-pointer select-none"
    >
      <div 
        onClick={onClick}
        className="w-80 p-4 scrapbook-page rounded-2xl relative border-glow-pink hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {/* Decorative Tape clip at top */}
        <div className="absolute -top-3 left-6 w-12 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

        <div className="space-y-3">
          {/* Card Image Cover */}
          <div className="relative w-full h-40 bg-pink-50/30 rounded-xl overflow-hidden border border-pink-100/50">
            {!imageError ? (
              <Image
                src={`${basePath}${entry.image}`}
                alt={entry.title}
                fill
                sizes="320px"
                onError={() => setImageError(true)}
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-lavender-50 flex flex-col items-center justify-center text-pink-300 text-xs">
                📸
                <span className="mt-1 text-[10px] text-pink-400">({entry.image})</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/10 to-transparent pointer-events-none" />
            
            {/* Age Tag */}
            <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-primary/90 text-white text-[10px] font-bold font-sans rounded-full shadow-sm">
              Age {entry.age}
            </div>
          </div>

          {/* Card Copy Text */}
          <div className="space-y-1">
            <span className="text-[10px] font-sans font-bold text-primary tracking-widest uppercase block">
              YEAR {entry.year}
            </span>
            <h4 className="text-lg font-display font-bold text-pink-700 leading-tight truncate">
              {entry.title}
            </h4>
            <p className="text-xs text-rose-950/70 font-sans line-clamp-2 leading-relaxed">
              {entry.description}
            </p>
          </div>

          {/* Location details */}
          {entry.location && (
            <div className="flex items-center gap-1 text-[10px] text-rose-400/80 border-t border-pink-100 pt-2 font-sans">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">{entry.location}</span>
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
