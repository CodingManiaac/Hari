"use client";

import { useEffect, useRef, useState } from "react";
import quizData from "@/chapters/chapter-09/content/quiz.json";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import { Heart, Trophy, ArrowRight, HelpCircle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  wrongResponse: string;
  celebrationMessage: string;
}

// Particle interface for Canvas Confetti
interface ConfettiParticle {
  x: number;
  y: number;
  r: number;
  color: string;
  velocityX: number;
  velocityY: number;
  tilt: number;
  tiltAngle: number;
  tiltAngleIncremental: number;
}

// Confetti spray engine for correct answers and final completions
function ConfettiCanvas({ active, loop = false }: { active: boolean; loop?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: ConfettiParticle[] = [];
    const colors = ["#FF69B4", "#FFC0CB", "#FFB6C1", "#DB7093", "#E6E6FA", "#D8BFD8", "#F43F5E", "#FFD700"];

    const createParticle = (fromCenter = true): ConfettiParticle => {
      const angle = (Math.random() * 120 + 210) * (Math.PI / 180); // angle from 210 to 330 deg (upward spray)
      const speed = Math.random() * 12 + 5;

      return {
        x: fromCenter ? width / 2 : Math.random() * width,
        y: fromCenter ? height * 0.45 : -20,
        r: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        tilt: Math.random() * 10 - 5,
        tiltAngle: 0,
        tiltAngleIncremental: Math.random() * 0.08 + 0.02,
      };
    };

    const maxParticles = loop ? 60 : 75;
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    let animationId: number;
    let timer = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      timer++;

      particles.forEach((p) => {
        // Apply velocity & physics
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.velocityY += 0.22; // gravity
        p.velocityX *= 0.98; // friction

        p.tiltAngle += p.tiltAngleIncremental;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        // Reset off-screen particles if looping
        if (loop && p.y > height + 20) {
          Object.assign(p, createParticle(false));
          // Slow down reset particles
          p.velocityY = Math.random() * 2 + 1;
          p.velocityX = Math.random() * 2 - 1;
        }

        // Draw particle rectangle/pill
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      if (loop || timer < 160) {
        animationId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active, loop]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[99]" />;
}

export default function Chapter9View() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState("");
  const [shakeActive, setShakeActive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const currentQ: Question = quizData[currentIdx];

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return; // Lock options once selected

    setSelectedOption(option);
    
    if (option === currentQ.correctAnswer) {
      setIsCorrect(true);
      setFeedback(currentQ.celebrationMessage);
      setShowConfetti(true);
      
      // Auto disable confetti spray after 2 seconds
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setIsCorrect(false);
      setFeedback(currentQ.wrongResponse);
      setShakeActive(true);
      setTimeout(() => setShakeActive(false), 500); // clear shake animation
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx === quizData.length - 1) {
      setIsQuizFinished(true);
    } else {
      setCurrentIdx((prev) => prev + 1);
      // Reset answer states
      setSelectedOption(null);
      setIsCorrect(null);
      setFeedback("");
      setShowConfetti(false);
    }
  };

  // If the quiz is finished, render a large wholesome score overlay
  if (isQuizFinished) {
    return (
      <ChapterContainer
        chapterId={9}
        title="Wholesome Completion! 💖"
        subtitle="You passed the Haripriya bond test with flying colours!"
        showNext={true} // Unlocks the page navigation continue trigger
      >
        <div className="relative w-full py-12 flex flex-col items-center justify-center select-none text-center">
          {/* Continuous confetti loop and background sparklers */}
          <ConfettiCanvas active={true} loop={true} />
          <BackgroundGlow color="rose" size={500} className="top-1/4 left-1/4" />
          <BackgroundGlow color="violet" size={400} className="bottom-1/4 right-1/4" />
          <FloatingHearts />

          {/* Large celebration Polaroid card */}
          <div className="w-full max-w-lg p-8 scrapbook-page border-glow-pink shadow-2xl rounded-3xl relative z-10 space-y-6 animate-envelope-open">
            {/* Washi tape overlays */}
            <div className="absolute -top-3 left-10 w-12 h-4 washi-tape opacity-80 z-10 pointer-events-none" />
            <div className="absolute -top-3 right-10 w-12 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

            <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-8 h-8 text-primary animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-display font-extrabold text-pink-700 leading-tight text-glow-rose">
                🎉 You Know Yourself So Well!
              </h3>
              <p className="text-sm text-rose-950/80 leading-relaxed font-sans max-w-sm mx-auto font-medium">
                Our childhood racing, silly go-kart fights, and sibling teasing are safe in our memories. No matter how much we grow up, this bond remains forever.
              </p>
            </div>

            {/* Pulsing heart graphic */}
            <div className="flex justify-center py-2">
              <Heart className="w-14 h-14 fill-primary text-primary animate-pulse-heart" />
            </div>

            <div className="border-t border-pink-100 pt-4 text-center">
              <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-rose-300 block animate-pulse">
                Click the button below to continue
              </span>
            </div>
          </div>
        </div>
      </ChapterContainer>
    );
  }

  return (
    <ChapterContainer
      chapterId={9}
      title="Wholesome Quiz"
      subtitle="Let's test how well you remember our funniest, sweet, and pottiest little sibling moments!"
      showNext={false} // Lock page continue button during active quiz
    >
      <div className="relative w-full py-8 flex flex-col items-center select-none">
        {/* Glow rings & sparkles */}
        <ConfettiCanvas active={showConfetti} />
        <BackgroundGlow color="rose" size={500} className="top-1/4 -left-20" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 -right-20" />
        <FloatingHearts />

        {/* Quiz Content Card */}
        <div 
          className={`w-full max-w-xl p-6 md:p-8 scrapbook-page border-glow-pink shadow-xl rounded-3xl relative z-10 space-y-6 ${
            shakeActive ? "animate-shake" : ""
          }`}
        >
          {/* Washi tape top details */}
          <div className="absolute -top-3 left-8 w-12 h-4 washi-tape opacity-80 z-10 pointer-events-none" />

          {/* Question Counter Tag */}
          <div className="flex justify-between items-center text-[10px] font-sans font-bold text-rose-400 uppercase tracking-widest border-b border-pink-100 pb-3">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-primary" /> Question {currentIdx + 1} of {quizData.length}
            </span>
            <span>NO SCORE PRESSURE</span>
          </div>

          {/* Question Text */}
          <h3 className="text-xl md:text-2xl font-display font-extrabold text-pink-700 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedOption === opt;
              const isCorrectAnswer = opt === currentQ.correctAnswer;
              
              // Dynamic button styles based on feedback states
              let btnClass = "bg-white/70 hover:bg-pink-50/50 border-pink-100 hover:border-pink-300 text-pink-700";
              if (selectedOption !== null) {
                if (isCorrectAnswer) {
                  // highlight correct answer in green
                  btnClass = "bg-green-50 border-green-300 text-green-700 font-semibold shadow-inner";
                } else if (isSelected) {
                  // highlight wrong choice in red
                  btnClass = "bg-red-50 border-red-300 text-red-700 font-semibold shadow-inner";
                } else {
                  // dim other options
                  btnClass = "bg-white/30 border-pink-50 text-pink-700/40 pointer-events-none";
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleOptionClick(opt)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-2xl border text-left text-sm md:text-base font-sans font-medium transition-all duration-300 shadow-sm cursor-pointer hover:-translate-y-0.5 ${btnClass}`}
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-pink-100/50 mr-3 text-center text-xs leading-6 font-bold text-primary">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Wrong/Correct Feedback box */}
          {selectedOption !== null && (
            <div 
              className={`p-4 rounded-xl border text-center transition-all duration-500 animate-line ${
                isCorrect 
                  ? "bg-green-50/60 border-green-200 text-green-700 font-semibold"
                  : "bg-red-50/60 border-red-200 text-red-700 font-semibold animate-pulse"
              }`}
            >
              <p className="text-sm font-sans">
                {isCorrect ? "✨ Success! " : "🤭 Oops! "}
                {feedback}
              </p>
            </div>
          )}

          {/* Continue / Next Button */}
          <div className="flex justify-end pt-2 border-t border-pink-100">
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-md flex items-center gap-2 border border-pink-100/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              {currentIdx === quizData.length - 1 ? "Finish Quiz 💖" : "Next Question"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Small Progress Hearts tracker */}
        <div className="flex justify-center gap-1.5 mt-8 z-10">
          {quizData.map((_, idx) => {
            const isAnswered = idx < currentIdx || (idx === currentIdx && selectedOption !== null);
            return (
              <Heart
                key={idx}
                className={`w-4 h-4 transition-all duration-500 ${
                  isAnswered
                    ? "fill-primary text-primary filter drop-shadow-[0_0_2px_rgba(244,63,94,0.4)] scale-110"
                    : "text-primary/20"
                }`}
              />
            );
          })}
        </div>

      </div>
    </ChapterContainer>
  );
}
