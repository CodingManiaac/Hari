"use client";

interface MasonryGridProps {
  children: React.ReactNode;
}

export default function MasonryGrid({ children }: MasonryGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance]">
      {children}
    </div>
  );
}
