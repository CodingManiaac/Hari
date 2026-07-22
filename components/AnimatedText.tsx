"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

interface AnimatedTextProps {
  text: string;
  className?: string;
  variant?: "word" | "character";
  delay?: number;
}

export default function AnimatedText({
  text,
  className = "",
  variant = "character",
  delay = 0,
}: AnimatedTextProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: variant === "word" ? 0.15 : 0.03,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  if (variant === "word") {
    const words = text.split(" ");
    return (
      <motion.span
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className={`inline-flex flex-wrap overflow-hidden ${className}`}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
            <motion.span variants={itemVariants} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    );
  }

  const chars = Array.from(text);
  return (
    <motion.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`inline-flex flex-wrap ${className}`}
    >
      {chars.map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            variants={itemVariants}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
