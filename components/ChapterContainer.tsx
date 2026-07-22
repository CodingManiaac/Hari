"use client";

import ChapterLayout from "./ChapterLayout";

interface ChapterContainerProps {
  chapterId: number;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  showNext?: boolean;
}

export default function ChapterContainer({
  chapterId,
  title,
  subtitle,
  children,
  showNext,
}: ChapterContainerProps) {
  return (
    <ChapterLayout 
      chapterId={chapterId} 
      title={title} 
      subtitle={subtitle} 
      showNext={showNext}
    >
      {children}
    </ChapterLayout>
  );
}
