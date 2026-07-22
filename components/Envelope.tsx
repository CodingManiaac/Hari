"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeProps {
  sender?: string;
  recipient?: string;
  letterContent?: string;
}

export default function Envelope({
  sender = "Your Brother",
  recipient = "Sister",
  letterContent = "Dear Sister,\n\nHappy Birthday to the most amazing sister in the world! You have always been my source of joy, my guide, and my best friend.\n\nOn your special day, I wish you all the happiness, success, and love this universe has to offer. Thank you for being you.\n\nWith all my love,\nAlways",
}: EnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center py-20">
      <div
        className="relative w-80 h-52 bg-pink-900/40 rounded-b-xl cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        style={{ perspective: "1000px" }}
      >
        {/* ENVELOPE FLAP */}
        <motion.div
          animate={{
            rotateX: isOpen ? 180 : 0,
            zIndex: isOpen ? 0 : 20,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="absolute inset-x-0 top-0 h-28 bg-pink-800 rounded-t-xl z-20 flex items-center justify-center border-b border-pink-700 shadow-md"
        >
          {!isOpen && (
            <span className="text-white/80 font-display text-sm tracking-wide group-hover:text-primary transition-colors">
              Click to Open
            </span>
          )}
        </motion.div>

        {/* ENVELOPE BACK SIDE / COVER */}
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-900 to-pink-950 rounded-b-xl z-10 border-t border-white/5 flex items-center justify-center shadow-lg">
          <span className="text-xs uppercase tracking-widest text-pink-300 font-bold">
            For {recipient}
          </span>
        </div>

        {/* LETTER CARD */}
        <motion.div
          animate={{
            y: isOpen ? -160 : 0,
            scale: isOpen ? 0.98 : 0.9,
            zIndex: isOpen ? 25 : 5,
          }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
          className="absolute inset-x-4 top-2 h-44 bg-white text-stone-800 rounded-lg p-4 shadow-2xl flex flex-col justify-between"
        >
          <div className="space-y-1">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-pink-600 border-b border-pink-100 pb-1">
              Dear {recipient},
            </h5>
            <p className="text-[10px] font-sans text-stone-600 leading-relaxed whitespace-pre-line overflow-y-auto max-h-24">
              {letterContent}
            </p>
          </div>
          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-stone-400 font-semibold border-t border-pink-50 pt-1 mt-1">
            <span>Happy Birthday</span>
            <span>From: {sender}</span>
          </div>
        </motion.div>

        {/* LEFT & RIGHT FLAPS FOR ENVELOPE BASE */}
        <div className="absolute inset-0 bg-transparent rounded-b-xl overflow-hidden pointer-events-none z-15">
          <div className="absolute -left-[50%] -bottom-[50%] w-full h-full bg-pink-900 rotate-45 border-t border-r border-white/5" />
          <div className="absolute -right-[50%] -bottom-[50%] w-full h-full bg-pink-900 -rotate-45 border-t border-l border-white/5" />
        </div>
      </div>
    </div>
  );
}
