"use client";

import { useState } from "react";
import memoriesData from "@/chapters/chapter-05/content/memories.json";
import MemoryGalleryCard from "./MemoryGalleryCard";
import MemoryModal from "./MemoryModal";
import ChapterContainer from "./ChapterContainer";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";
import MasonryGrid from "./MasonryGrid";
import FadeIn from "./FadeIn";

export default function Chapter5View() {
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null);

  const imagesPath = "/api/assets/chapters/chapter-04/images/";

  return (
    <ChapterContainer
      chapterId={5}
      title="Memory Wall"
      subtitle="Every image tells a story of laughter, milestones, and the beautiful bond we share."
    >
      <div className="relative w-full py-8 space-y-12">
        {/* Background glow & heart floating particles */}
        <BackgroundGlow color="violet" size={500} className="top-1/4 -left-20" />
        <BackgroundGlow color="magenta" size={400} className="bottom-1/4 -right-20" />
        <FloatingHearts />

        {/* Masonry Memory Gallery */}
        <FadeIn delay={0.2} direction="up">
          <MasonryGrid>
            {memoriesData.map((memory, idx) => (
              <MemoryGalleryCard
                key={memory.id}
                memory={memory}
                onClick={() => setSelectedMemory(memory)}
                basePath={imagesPath}
                index={idx}
              />
            ))}
          </MasonryGrid>
        </FadeIn>

        {/* Memory Details Modal Viewer */}
        <MemoryModal
          isOpen={selectedMemory !== null}
          onClose={() => setSelectedMemory(null)}
          memory={selectedMemory ? {
            year: selectedMemory.date || "N/A",
            age: selectedMemory.mood || "N/A", // Reusing age field mapping in MemoryModal for Mood Tag
            title: selectedMemory.title,
            description: selectedMemory.description,
            image: selectedMemory.image,
            location: selectedMemory.location
          } : null}
          basePath={imagesPath}
        />
      </div>
    </ChapterContainer>
  );
}
