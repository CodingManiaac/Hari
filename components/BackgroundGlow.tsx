"use client";

interface BackgroundGlowProps {
  color?: "magenta" | "violet" | "pink" | "rose";
  size?: number;
  className?: string;
}

export default function BackgroundGlow({
  color = "pink",
  size = 300,
  className = "",
}: BackgroundGlowProps) {
  const colorClasses = {
    magenta: "bg-magenta-500/10 blur-[100px]",
    violet: "bg-violet-500/10 blur-[120px]",
    pink: "bg-pink-500/10 blur-[90px]",
    rose: "bg-rose-400/10 blur-[110px]",
  };

  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className={`absolute rounded-full pointer-events-none z-0 animate-glow-pulse ${colorClasses[color]} ${className}`}
    />
  );
}
