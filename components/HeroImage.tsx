"use client";

import Image from "next/image";

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function HeroImage({ src, alt, className = "" }: HeroImageProps) {
  return (
    <div className={`washi-tape-container animate-gentle-float ${className}`}>
      {/* Polaroid visual frame */}
      <div className="bg-white p-4 pb-12 shadow-2xl rounded-sm border border-pink-100/50 transform rotate-1">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-pink-50 rounded-sm">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        {/* Caption placeholder */}
        <div className="mt-4 text-center font-display text-lg text-pink-700/80 select-none">
          ✨ Birthday Queen ✨
        </div>
      </div>
    </div>
  );
}
