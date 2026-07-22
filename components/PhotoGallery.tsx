"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Polaroid from "./Polaroid";
import Modal from "./Modal";

interface GalleryImage {
  src?: string;
  caption: string;
  rotation?: number;
}

interface PhotoGalleryProps {
  items?: GalleryImage[];
}

export default function PhotoGallery({ items = [] }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const defaultItems: GalleryImage[] = items.length > 0 ? items : [
    { caption: "Your 18th Birthday bash! 🎂", rotation: -4 },
    { caption: "Road trip through the mountains 🏔️", rotation: 5 },
    { caption: "Graduation ceremony smile 🎓", rotation: -2 },
    { caption: "Sunday morning coffee talks ☕", rotation: 3 },
  ];

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-xs uppercase tracking-widest text-primary font-bold">
          Visual Memories
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white mt-1">
          Photo Gallery
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {defaultItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImage(item)}
            className="transform transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <Polaroid
              imageSrc={item.src}
              caption={item.caption}
              rotation={item.rotation || 0}
            />
          </div>
        ))}
      </div>

      {/* Modal image preview details */}
      <Modal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        title="Expanded View"
      >
        {selectedImage && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full max-w-sm aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-white/10 relative">
              {selectedImage.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedImage.src}
                  alt={selectedImage.caption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-dark/40 to-magenta-dark/20 flex items-center justify-center text-white/20">
                  Preview Image
                </div>
              )}
            </div>
            <p className="text-center text-base font-display font-semibold text-white leading-relaxed">
              {selectedImage.caption}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
