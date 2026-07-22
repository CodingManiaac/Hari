"use client";

import statsData from "@/chapters/chapter-04/content/stats.json";
import StatisticsCard from "./StatisticsCard";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";

export default function Chapter4View() {
  return (
    <ChapterContainer
      chapterId={4}
      title="Fun Statistics"
      subtitle="Behind the scenes: the numeric breakdown of a highly dramatic, noodle-loving sister!"
    >
      <div className="relative w-full py-8 space-y-12">
        {/* Background glow & heart floating particles */}
        <BackgroundGlow color="magenta" size={500} className="top-1/4 -left-20" />
        <BackgroundGlow color="violet" size={400} className="bottom-1/4 -right-20" />
        <FloatingHearts />

        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
          {statsData.map((stat, idx) => (
            <StatisticsCard
              key={idx}
              title={stat.title}
              value={stat.value}
              emoji={stat.emoji}
              description={stat.description}
              index={idx}
            />
          ))}
        </div>
      </div>
    </ChapterContainer>
  );
}
