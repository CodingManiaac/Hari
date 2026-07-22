"use client";

import Image from "next/image";
import { useState } from "react";
import { MapPin, Calendar } from "lucide-react";
import FadeIn from "./FadeIn";

interface Memory {
  id: number;
  title: string;
  description: string;
  image: string;
  date?: string;
  location?: string;
  mood?: string;
}

interface MemoryGalleryCardProps {
  memory: Memory;
  onClick: () => void;
  basePath: string;
  index: number;
}

export default function MemoryGalleryCard({
  memory,
  onClick,
  basePath,
  index,
}: MemoryGalleryCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Alternate tilts for scrapbooking feel
  const rotations = [-3, 2, -2, 3, -4, 1];
  const rotation = rotations[index % rotations.length];
  const currentRotation = isHovered ? rotation * 0.5 : rotation;

  return (
    <FadeIn
      direction="up"
      delay={index * 0.05}
      className="break-inside-avoid mb-6 w-full relative inline-block"
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        style={{
          transform: `rotate(${currentRotation}deg) scale(${isHovered ? 1.03 : 1}) translate3d(0, ${isHovered ? -6 : 0}px, 0)`,
          zIndex: isHovered ? 10 : 1,
          transition: "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), z-index 0.3s ease",
        }}
        className="w-full cursor-pointer select-none bg-white p-3.5 pb-6 shadow-[0_8px_24px_rgba(244,63,94,0.06)] border border-pink-50 rounded-sm relative"
      >
        {/* Decorative Washi Tape */}
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 w-16 h-5 washi-tape z-20 pointer-events-none" />

        <div className="space-y-3">
          {/* Polaroid Image Cover */}
          <div className="relative w-full h-56 md:h-64 bg-pink-50/50 overflow-hidden border border-pink-100/50">
            {!imageError ? (
              <Image
                src={`${basePath}${memory.image}`}
                alt={memory.title}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                onError={() => setImageError(true)}
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-50 to-lavender-50 flex flex-col items-center justify-center text-pink-300 text-xs">
                📸
                <span className="mt-1 text-[10px] text-pink-400">({memory.image})</span>
              </div>
            )}
            
            {/* Mood Tag */}
            {memory.mood && (
              <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-primary/90 text-white text-[9px] uppercase tracking-wider font-bold rounded-full shadow-sm z-10">
                {memory.mood}
              </div>
            )}
          </div>

          {/* Written Caption Text */}
          <div className="space-y-1 text-center">
            <h4 className="text-lg font-display font-bold text-pink-700 leading-tight truncate">
              {memory.title}
            </h4>
            <p className="text-xs text-rose-950/70 font-sans line-clamp-2 leading-relaxed px-1">
              {memory.description}
            </p>
          </div>

          {/* Footer Details */}
          {(memory.location || memory.date) && (
            <div className="flex justify-center gap-3 text-[9px] text-rose-400/80 border-t border-pink-50 pt-2 font-sans">
              {memory.location && (
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-primary" />
                  {memory.location}
                </span>
              )}
              {memory.date && (
                <span className="flex items-center gap-0.5">
                  <Calendar className="w-3 h-3 text-primary" />
                  {memory.date}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
