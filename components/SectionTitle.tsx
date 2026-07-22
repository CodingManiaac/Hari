"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  glowColor?: "gold" | "violet" | "magenta";
  align?: "center" | "left" | "right";
}

export default function SectionTitle({
  title,
  subtitle,
  glowColor = "gold",
  align = "center",
}: SectionTitleProps) {
  const glowClasses = {
    gold: "text-glow-gold text-gold-400",
    violet: "text-glow-violet text-violet",
    magenta: "text-glow-magenta text-magenta",
  };

  const alignment = {
    center: "text-center items-center",
    left: "text-left items-start",
    right: "text-right items-end",
  };

  return (
    <div className={`flex flex-col space-y-2 mb-8 ${alignment[align]}`}>
      {subtitle && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs uppercase tracking-widest text-muted-foreground font-bold"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        className={`text-3xl md:text-5xl font-display font-extrabold tracking-tight leading-tight ${glowClasses[glowColor]}`}
      >
        {title}
      </motion.h2>
      <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mt-2 opacity-50" />
    </div>
  );
}
