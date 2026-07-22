"use client";

import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function PageTransition({
  children,
  className = "",
  delay = 0,
}: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
