"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import GlassCard from "./GlassCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Prevent page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-lg"
          >
            <GlassCard className="w-full p-6 md:p-8 border-white/20 bg-black/85 shadow-2xl">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                {title && (
                  <h3 className="text-xl font-display font-bold text-glow-gold text-gold-400">
                    {title}
                  </h3>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="text-gray-300 text-sm max-h-[60vh] overflow-y-auto pr-1">
                {children}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
