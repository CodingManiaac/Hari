"use client";

import { useState, useRef } from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tiltActive?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  tiltActive = true,
}: GlassCardProps) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !tiltActive) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates: -0.5 to 0.5
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Convert to degrees (max tilt: 15deg)
    const rotateY = mouseX * 30; // Horizontal tilt
    const rotateX = -mouseY * 30; // Vertical tilt

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tiltActive && hovered ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transformStyle: "preserve-3d",
        transition: hovered ? "none" : "transform 0.5s ease",
      }}
      className={`glassmorphism-pink rounded-2xl p-6 relative transition-shadow duration-300 ${
        hovered ? "shadow-2xl shadow-primary/10" : ""
      } ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
        {children}
      </div>
      {/* Dynamic reflective glow overlay */}
      {tiltActive && hovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-60 transition-opacity duration-300"
          style={{ transform: "translateZ(1px)" }}
        />
      )}
    </div>
  );
}
