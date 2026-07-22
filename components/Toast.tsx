"use client";

import { useEffect } from "react";
import { Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm glassmorphism-pink border border-primary/20 p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4 animate-toast"
    >
      <div className="flex items-center gap-3">
        <Info className="w-5 h-5 text-primary flex-shrink-0" />
        <p className="text-xs text-pink-700 leading-relaxed font-semibold font-sans">
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-full text-rose-300 hover:text-rose-600 hover:bg-pink-50 transition-all flex-shrink-0 cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
