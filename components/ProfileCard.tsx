"use client";

import GlassCard from "./GlassCard";
import Image from "next/image";
import { useState } from "react";

interface ProfileCardProps {
  name: string;
  nickname: string;
  birthday: string;
  introduction: string;
  imageSrc: string;
}

export default function ProfileCard({
  name,
  nickname,
  birthday,
  introduction,
  imageSrc,
}: ProfileCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <GlassCard className="w-full max-w-4xl mx-auto p-6 md:p-10 border border-primary/10 hover:border-primary/20 bg-white/40 shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Profile Image container (no Framer Motion) */}
        <div
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-full p-1.5 bg-gradient-to-tr from-primary to-accent shadow-lg flex-shrink-0 hover:scale-103 transition-transform duration-300"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden bg-pink-50 border border-pink-100/50">
            {!imageError ? (
              <Image
                src={imageSrc}
                alt={name}
                fill
                sizes="(max-width: 768px) 192px, 256px"
                onError={() => setImageError(true)}
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-100 to-lavender-50 flex flex-col items-center justify-center text-pink-300 text-xs text-center p-4">
                👑
                <span className="mt-1 text-[10px] text-pink-400/60">(profile.jpeg)</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Profile text content */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-primary font-bold text-glow-rose">
              Birthday Queen
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-pink-700">
              {name}
            </h2>
            <p className="text-sm font-sans font-bold text-rose-400">
              aka &ldquo;{nickname}&rdquo; &bull; {birthday}
            </p>
          </div>

          <p className="text-sm md:text-base text-rose-950/80 leading-relaxed italic font-sans font-medium border-l-2 border-primary/20 pl-4 py-1">
            &ldquo;{introduction}&rdquo;
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
