"use client";

import { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  magnetic?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  className = "",
  magnetic = true,
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const springConfig = { damping: 15, stiffness: 150 };
  const dx = useSpring(0, springConfig);
  const dy = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetic || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    dx.set(x * 0.45);
    dy.set(y * 0.45);
  };

  const handleMouseLeave = () => {
    dx.set(0);
    dy.set(0);
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: dx,
        y: dy,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-8 py-3 bg-gradient-to-r from-primary via-accent to-violet-dark text-white rounded-full font-semibold uppercase tracking-wider text-xs shadow-lg hover:shadow-primary/20 transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
}
