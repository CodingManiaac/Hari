"use client";

import { useEffect, useState, useRef } from "react";
import { useStore } from "@/lib/store";

interface TrailItem {
  id: number;
  x: number;
  y: number;
  icon: string;
}

export default function CursorEffects() {
  const cursorType = useStore((state) => state.cursorType);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const [isMobile, setIsMobile] = useState(true);
  const trailIdRef = useRef(0);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(
        window.matchMedia("(max-width: 768px)").matches ||
          "ontouchstart" in window
      );
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });

      // Spawn trail particle occasionally
      if (Math.random() < 0.25) {
        const icons = ["🌸", "💖", "✨", "🎈", "🦋", "❤️"];
        const randIcon = icons[Math.floor(Math.random() * icons.length)];

        const newItem: TrailItem = {
          id: trailIdRef.current++,
          x: clientX,
          y: clientY,
          icon: randIcon,
        };

        setTrail((prev) => [...prev.slice(-15), newItem]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorType]);

  // Clean trail particles over time
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Trails using pure hardware-accelerated CSS animations (no Framer Motion) */}
      {trail.map((item) => (
        <span
          key={item.id}
          style={{
            left: `${item.x - 10}px`,
            top: `${item.y - 10}px`,
            ["--trail-rotate" as any]: `${Math.random() * 60 - 30}deg`,
          }}
          className="absolute text-sm select-none animate-trail"
        >
          {item.icon}
        </span>
      ))}

      {/* Main Cursor Core using simple translate3d */}
      <div
        style={{
          transform: `translate3d(${position.x - 6}px, ${position.y - 6}px, 0)`,
          transition: "transform 0.04s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
        className="w-3.5 h-3.5 absolute left-0 top-0 rounded-full bg-primary/70 border border-white shadow-[0_0_8px_rgba(244,63,94,0.4)] pointer-events-none"
      />
    </div>
  );
}
