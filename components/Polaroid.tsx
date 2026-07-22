"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface PolaroidProps {
  src: string;
  alt: string;
  caption?: string;
  rotation?: number; // Rotation offset (e.g. -4 or 3)
  className?: string;
}

export default function Polaroid({
  src,
  alt,
  caption,
  rotation = 0,
  className = "",
}: PolaroidProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.04, rotate: rotation * 0.5, zIndex: 10 }}
      style={{ rotate: `${rotation}deg` }}
      className={`bg-white p-3 pb-6 shadow-[0_8px_20px_rgba(244,63,94,0.06)] border border-pink-50 rounded-sm relative inline-block select-none ${className}`}
    >
      {/* Decorative Washi Tape */}
      <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 w-16 h-5 washi-tape z-20 pointer-events-none" />

      {/* Polaroid Image Cover Frame */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 bg-pink-50/50 overflow-hidden border border-pink-100/50">
        {!imageError ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-w-768px) 192px, 224px"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-50 to-lavender-50 flex items-center justify-center text-pink-300 text-xs">
            🌸 Photo
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/5 to-transparent pointer-events-none" />
      </div>

      {/* Caption Space */}
      {caption && (
        <div className="mt-3 text-center font-display text-lg text-pink-600 font-bold leading-tight truncate max-w-[12rem] mx-auto">
          {caption}
        </div>
      )}
    </motion.div>
  );
}
