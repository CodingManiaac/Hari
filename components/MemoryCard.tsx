"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

interface MemoryCardProps {
  imageSrc?: string;
  title?: string;
  date?: string;
  secretMessage?: string;
}

export default function MemoryCard({
  imageSrc,
  title = "A Special Memory",
  date = "October 2024",
  secretMessage = "This was one of the happiest days, sharing laughs and realizing how lucky I am to have you as my sister! ❤️",
}: MemoryCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-72 h-96 cursor-pointer relative"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full relative"
      >
        {/* FRONT side of MemoryCard */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <GlassCard className="w-full h-full p-4 flex flex-col justify-between border-white/10 hover:border-primary/20">
            <div className="w-full h-[70%] bg-zinc-900 rounded-lg overflow-hidden relative border border-white/5">
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-dark/20 via-magenta-dark/20 to-gold-950/20 flex items-center justify-center text-white/20">
                  Memory Photo
                </div>
              )}
            </div>
            <div className="mt-2 space-y-1">
              <h4 className="font-display font-bold text-white text-base truncate">
                {title}
              </h4>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{date}</span>
                <span className="text-primary font-semibold hover:underline">
                  Flip &rarr;
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* BACK side of MemoryCard */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <GlassCard className="w-full h-full p-6 flex flex-col justify-between border-primary/20 bg-gradient-radial from-violet-dark/25 to-black">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-primary font-bold">
                From the Heart
              </span>
              <p className="text-sm font-sans text-gray-300 leading-relaxed italic">
                "{secretMessage}"
              </p>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 border-t border-white/10 pt-2">
              <span>{date}</span>
              <span className="text-primary font-semibold hover:underline">
                &larr; Front
              </span>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
