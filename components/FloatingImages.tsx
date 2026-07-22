"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface FloatingImage {
  src?: string;
  alt?: string;
  x: string; // Tailwind positioning e.g. "left-10"
  y: string; // Tailwind positioning e.g. "top-20"
  speed: number; // Parallax coefficient (-50 to 50)
  size: string; // e.g. "w-32 h-32"
  rotation?: number;
}

interface FloatingImagesProps {
  images?: FloatingImage[];
}

export default function FloatingImages({ images = [] }: FloatingImagesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 35;
      const y = (e.clientY - innerHeight / 2) / 35;
      setMouseOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Default images for structural demonstration
  const displayImages = images.length > 0 ? images : [
    { x: "left-[10%]", y: "top-[20%]", speed: 15, size: "w-24 h-24", rotation: -12 },
    { x: "right-[15%]", y: "top-[15%]", speed: -20, size: "w-32 h-32", rotation: 8 },
    { x: "left-[15%]", y: "bottom-[25%]", speed: 25, size: "w-36 h-36", rotation: -5 },
    { x: "right-[20%]", y: "bottom-[20%]", speed: -10, size: "w-28 h-28", rotation: 15 },
  ];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 w-full h-full"
    >
      {displayImages.map((img, i) => {
        // Scroll offset mapping
        const yOffset = useTransform(scrollY, [0, 1000], [0, img.speed * 8]);

        return (
          <motion.div
            key={i}
            style={{
              x: mouseOffset.x * (img.speed / 10),
              y: mouseOffset.y * (img.speed / 10),
              yStyle: yOffset,
              rotate: img.rotation || 0,
            }}
            className={`absolute ${img.x} ${img.y} ${img.size} rounded-lg border border-white/10 glassmorphism-light p-2 flex items-center justify-center`}
          >
            {img.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.src}
                alt={img.alt || "Floating Memory"}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-violet-dark/40 to-magenta-dark/20 rounded-md flex items-center justify-center text-white/20 text-xs">
                Memory {i + 1}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
