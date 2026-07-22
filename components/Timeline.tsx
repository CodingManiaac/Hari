"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import GlassCard from "./GlassCard";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  tag?: string;
}

interface TimelineProps {
  events?: TimelineEvent[];
}

export default function Timeline({ events = [] }: TimelineProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sampleEvents: TimelineEvent[] = events.length > 0 ? events : [
    {
      year: "2010",
      title: "The Childhood Days",
      description: "Playing around in the garden, sharing toys and early laughs.",
      tag: "Memories",
    },
    {
      year: "2016",
      title: "High School Graduation",
      description: "Stepping into the big world, nervous but with a heart full of big dreams.",
      tag: "Milestone",
    },
    {
      year: "2021",
      title: "First Big Job",
      description: "Securing the first step in your career. Hard work truly paid off!",
      tag: "Success",
    },
    {
      year: "Today",
      title: "An Incredible Sister",
      description: "Continuing to inspire everyone around you with your kindness and brilliance.",
      tag: "Present",
    },
  ];

  return (
    <div ref={ref} className="relative max-w-4xl mx-auto px-4 py-16">
      {/* Center line */}
      <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-violet-dark opacity-30" />

      <div className="space-y-16">
        {sampleEvents.map((event, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-center justify-between ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Card Container */}
              <div className="w-full md:w-[45%] mb-8 md:mb-0">
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                >
                  <GlassCard className="hover:border-primary/30">
                    <span className="text-xs uppercase tracking-widest text-primary font-bold">
                      {event.tag}
                    </span>
                    <h3 className="text-xl font-display font-bold text-white mt-1 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {event.description}
                    </p>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Central node spacer */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 200, delay: idx * 0.15 }}
                  className="w-10 h-10 rounded-full bg-black border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20 z-10"
                >
                  <span className="text-xs font-bold text-primary font-display">
                    {event.year}
                  </span>
                </motion.div>
              </div>

              {/* Invisible spacer block for desktop */}
              <div className="hidden md:block w-[45%]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
