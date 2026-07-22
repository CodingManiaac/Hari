"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart } from "lucide-react";
import GlassCard from "./GlassCard";

export default function WishCard() {
  const { wishes, addWish } = useStore();
  const [wishInput, setWishInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;

    const fullWish = nameInput.trim()
      ? `${wishInput.trim()} — Love, ${nameInput.trim()}`
      : wishInput.trim();

    addWish(fullWish);
    setWishInput("");
    setNameInput("");
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start py-8 px-4">
      {/* Writing Box */}
      <GlassCard className="border-white/10 hover:border-primary/20">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-primary font-bold">
              Leave a Blessing
            </span>
            <h3 className="text-xl font-display font-bold text-white mt-1">
              Write a Birthday Wish
            </h3>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Your Message
            </label>
            <textarea
              value={wishInput}
              onChange={(e) => setWishInput(e.target.value)}
              placeholder="May all your dreams come true..."
              rows={4}
              maxLength={300}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 resize-none"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your Name / Nickname"
              maxLength={40}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-semibold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/10"
            >
              {submitted ? (
                <>
                  <Heart className="w-4 h-4 fill-current animate-bounce" />
                  Wish Sent!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Wish
                </>
              )}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Wishes Board */}
      <GlassCard className="border-white/10 bg-black/40 h-80 flex flex-col justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent font-bold">
            Blessings Board
          </span>
          <h3 className="text-xl font-display font-bold text-white mt-1 mb-4">
            Recent Wishes
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          <AnimatePresence>
            {wishes.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground text-center italic py-12"
              >
                No wishes yet. Be the first to leave a blessing!
              </motion.p>
            ) : (
              wishes.map((w, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300 leading-relaxed"
                >
                  {w}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </div>
  );
}
