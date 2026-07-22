"use client";

import { useInView } from "@/hooks/useInView";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.5,
  className = "",
}: FadeInProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const getDirectionClasses = () => {
    switch (direction) {
      case "up":
        return inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";
      case "down":
        return inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6";
      case "left":
        return inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6";
      case "right":
        return inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6";
      case "none":
      default:
        return inView ? "opacity-100" : "opacity-0";
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      }}
      className={`transition-all ease-[cubic-bezier(0.25,0.1,0.25,1)] ${getDirectionClasses()} ${className}`}
    >
      {children}
    </div>
  );
}
