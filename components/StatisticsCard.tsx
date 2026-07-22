"use client";

import { useState } from "react";
import CounterAnimation from "./CounterAnimation";
import FadeIn from "./FadeIn";

interface StatisticsCardProps {
  title: string;
  value: number;
  emoji: string;
  description: string;
  index: number;
}

export default function StatisticsCard({
  title,
  value,
  emoji,
  description,
  index,
}: StatisticsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Custom suffix check based on title
  const getSuffix = () => {
    if (title.includes("Quotient") || title.includes("Crime")) return "%";
    if (title.includes("Consumed") || title.includes("Watched") || title.includes("Bro") || title.includes("Sessions")) return "+";
    return "";
  };

  // Pastel scrapbook theme card rotations and colors
  const bgStyles = [
    "bg-pink-50/70 border-pink-100 hover:border-pink-300",
    "bg-purple-50/70 border-purple-100 hover:border-purple-300",
    "bg-orange-50/70 border-orange-100 hover:border-orange-300",
  ];
  const cardStyle = bgStyles[index % bgStyles.length];

  return (
    <FadeIn
      direction="up"
      delay={index * 0.08}
      className="h-full cursor-default"
    >
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`h-full p-6 border rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group shadow-sm hover:shadow-md hover:-translate-y-1.5 hover:scale-[1.02] ${cardStyle}`}
      >
        
        {/* Decorative Tape clip at top */}
        <div className="absolute -top-3 left-6 w-10 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

        {/* Card Header */}
        <div className="flex justify-between items-start gap-4">
          <h4 className="text-xs uppercase tracking-wider text-rose-400 font-sans font-bold">
            {title}
          </h4>
          <span className="text-xl w-9 h-9 rounded-xl bg-white/50 border border-white/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
            {emoji}
          </span>
        </div>

        {/* Counter Value */}
        <div className="my-6">
          <span className="text-4xl md:text-5xl font-display font-bold text-pink-700 text-glow-rose">
            <CounterAnimation value={value} />
            {getSuffix()}
          </span>
        </div>

        {/* Bottom Reveal Details */}
        <div className="relative overflow-hidden h-10 flex items-center">
          <p
            style={{
              transform: `translateY(${isHovered ? 0 : 40}px)`,
              opacity: isHovered ? 1 : 0,
              transition: "transform 0.3s ease, opacity 0.3s ease",
            }}
            className="text-xs text-primary font-bold leading-relaxed font-sans"
          >
            {description}
          </p>
          {!isHovered && (
            <span className="text-[10px] uppercase tracking-wider text-rose-400/40 font-bold block animate-pulse font-sans">
              Hover to reveal details &rarr;
            </span>
          )}
        </div>
      </div>
    </FadeIn>
  );
}
