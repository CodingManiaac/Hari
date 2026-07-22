"use client";

import { useEffect, useRef, useState } from "react";
import journeyData from "@/chapters/chapter-16/content/journey-map.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { X, Sparkles, MapPin, Heart } from "lucide-react";
import Polaroid from "./Polaroid";

interface Place {
  id: number;
  placeName: string;
  description: string;
  image: string;
  emoji: string;
  displayOrder: number;
}

export default function Chapter16View() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Static coordinate percentage anchors (%) matching the SVG curve anchors
  const pinCoordinates = [
    { x: 10, y: 35 },
    { x: 22, y: 15 },
    { x: 36, y: 48 },
    { x: 52, y: 22 },
    { x: 66, y: 58 },
    { x: 80, y: 30 },
    { x: 90, y: 68 },
  ];

  const handleImageError = (filename: string) => {
    setImageErrors((prev) => new Set([...prev, filename]));
  };

  return (
    <ChapterContainer
      chapterId={16}
      title="Our Sibling Journey Map"
      subtitle="A hand-drawn scrapbook map tracking some of the most precious places we've visited and illuminated together."
    >
      <div className="relative w-full py-8 select-none flex flex-col items-center justify-center">
        {/* Style block for moving dotted path dashes and pin bounces */}
        <style>{`
          @keyframes travel-dash {
            to {
              stroke-dashoffset: -20;
            }
          }
          .travel-dotted-path {
            stroke-dasharray: 6 4;
            animation: travel-dash 10s linear infinite;
          }
          @keyframes marker-bounce {
            0%, 100% {
              transform: translate(-50%, -50%) translateY(0) scale(1);
            }
            50% {
              transform: translate(-50%, -50%) translateY(-6px) scale(1.05);
            }
          }
          .animate-marker-bounce {
            animation: marker-bounce 4s ease-in-out infinite;
          }
        `}</style>

        {/* Ambient Backdrops */}
        <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
        <FloatingHearts />

        {/* Scrapbook Parchment Map Board */}
        <div className="relative w-full max-w-3xl h-[28rem] bg-gradient-to-tr from-amber-50/50 via-white/70 to-pink-50/50 rounded-3xl border border-pink-100/50 shadow-inner overflow-hidden z-10">
          
          {/* Hand-drawn grid background */}
          <div className="absolute inset-0 bg-repeat bg-[radial-gradient(rgba(244,63,94,0.05)_1.5px,transparent_1.5px)] bg-[size:2rem_2rem] pointer-events-none" />

          {/* Dotted path SVG connector */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <path
              d="M 10 35 C 16 20, 16 15, 22 15 C 29 15, 30 48, 36 48 C 42 48, 46 22, 52 22 C 58 22, 60 58, 66 58 C 72 58, 74 30, 80 30 C 86 30, 86 68, 90 68"
              fill="none"
              stroke="rgba(244, 63, 94, 0.28)"
              strokeWidth="0.8"
              className="travel-dotted-path"
            />
          </svg>

          {/* Bouncing Map Markers */}
          {journeyData.map((place: Place, idx: number) => {
            const coord = pinCoordinates[idx];
            const isSelected = selectedPlace?.id === place.id;

            return (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                  animationDelay: `${idx * 0.4}s`,
                }}
                className={`absolute animate-marker-bounce w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow-md cursor-pointer hover:scale-125 hover:z-30 transition-all duration-300 ${
                  isSelected
                    ? "border-primary bg-pink-50 ring-4 ring-primary/10"
                    : "border-pink-100 hover:border-primary"
                }`}
                title={place.placeName}
              >
                <span className="text-xl leading-none select-none">{place.emoji || "🌸"}</span>
                
                {/* Glow ring indicator */}
                <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-60 pointer-events-none" />
              </button>
            );
          })}
        </div>

        {/* Location memory modal sheet (React Conditional Mount) */}
        {selectedPlace && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setSelectedPlace(null)}
              className="absolute inset-0 bg-pink-950/40 backdrop-blur-md animate-backdrop"
            />

            <div className="relative z-10 w-full max-w-md animate-envelope-open select-none">
              <div className="w-full scrapbook-page border-glow-pink shadow-2xl rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between items-center text-center space-y-5">
                {/* Washi tape details */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-100/50 shadow-sm transition-all cursor-pointer z-20"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Polaroid Photo Frame */}
                <div className="w-full max-w-[14rem] mt-2">
                  <Polaroid
                    src={`/api/assets/chapters/chapter-16/images/${selectedPlace.image}`}
                    alt={selectedPlace.placeName}
                    title={selectedPlace.placeName}
                    rotate={-2}
                  />
                </div>

                {/* Description texts */}
                <div className="space-y-2 w-full text-center">
                  <span className="text-[9px] uppercase font-sans font-bold tracking-widest text-primary block flex justify-center items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" /> JOURNEY MEMORY
                  </span>
                  
                  <h3 className="text-lg font-display font-extrabold text-pink-700 leading-tight">
                    {selectedPlace.placeName}
                  </h3>

                  <p className="text-xs md:text-sm text-rose-950/80 leading-relaxed font-sans bg-white/40 border border-pink-50/50 p-4 rounded-xl shadow-inner font-semibold">
                    {selectedPlace.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[9px] text-rose-300 font-bold uppercase tracking-widest pt-1">
                  <MapPin className="w-3.5 h-3.5" /> Traveling Together
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </ChapterContainer>
  );
}
