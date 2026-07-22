"use client";

import GlassCard from "./GlassCard";
import FadeIn from "./FadeIn";

interface FavouriteCardProps {
  label: string;
  value: string;
  emojiIcon?: string;
  index?: number;
}

export default function FavouriteCard({
  label,
  value,
  emojiIcon = "✨",
  index = 0,
}: FavouriteCardProps) {
  return (
    <FadeIn
      direction="up"
      delay={index * 0.05}
      className="h-full"
    >
      <GlassCard className="h-full p-5 border border-primary/10 bg-white/40 shadow-sm flex items-start gap-4 hover:-translate-y-1 hover:scale-102 transition-all duration-300">
        {/* Left icon badge */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary/10 to-accent/20 border border-pink-100 flex items-center justify-center text-lg shadow-inner flex-shrink-0">
          {emojiIcon}
        </div>

        {/* Right side labels */}
        <div className="space-y-1 overflow-hidden">
          <span className="text-[10px] uppercase tracking-wider text-rose-400 font-sans font-bold block">
            {label}
          </span>
          <p className="text-base font-display font-bold text-pink-700 leading-snug truncate">
            {value}
          </p>
        </div>
      </GlassCard>
    </FadeIn>
  );
}
