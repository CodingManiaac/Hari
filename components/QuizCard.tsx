"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  successMessage?: string;
}

interface QuizCardProps {
  quiz?: QuizQuestion;
  onCorrectAnswer?: () => void;
}

export default function QuizCard({ quiz, onCorrectAnswer }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const defaultQuiz: QuizQuestion = quiz || {
    question: "What is my absolute favorite flavor of birthday cake?",
    options: ["Chocolate Fudge", "Red Velvet Cream", "Vanilla Funfetti", "Matcha Pistachio"],
    correctAnswerIndex: 1,
    successMessage: "Spot on! That delicious cream cheese frosting never fails! 🎉",
  };

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    const correct = selectedOption === defaultQuiz.correctAnswerIndex;
    setIsCorrect(correct);

    if (correct && onCorrectAnswer) {
      onCorrectAnswer();
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <GlassCard className="max-w-md mx-auto p-6 md:p-8 border-white/10 hover:border-primary/10">
      <div className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-accent font-bold">
            Interactive Quiz
          </span>
          <h3 className="text-xl md:text-2xl font-display font-bold text-white mt-1">
            {defaultQuiz.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {defaultQuiz.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrectAnswer = idx === defaultQuiz.correctAnswerIndex;
            
            let btnClass = "border-white/10 bg-white/5 text-white hover:bg-white/10";
            if (isSubmitted) {
              if (isCorrectAnswer) {
                btnClass = "border-green-500/50 bg-green-500/10 text-green-300";
              } else if (isSelected && !isCorrect) {
                btnClass = "border-red-500/50 bg-red-500/10 text-red-300";
              }
            } else if (isSelected) {
              btnClass = "border-primary bg-primary/10 text-primary";
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all duration-300 ${btnClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Submit or feedback */}
        <div className="pt-2">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                disabled={selectedOption === null}
                onClick={handleSubmit}
                className="w-full py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold uppercase tracking-wider text-xs rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none transition-all duration-300"
              >
                Submit Answer
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-4"
              >
                <p className={`text-sm ${isCorrect ? "text-green-300" : "text-red-300"}`}>
                  {isCorrect ? defaultQuiz.successMessage : "Oops! That's not the one. Give it another shot!"}
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-white/10 rounded-lg text-xs uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}
