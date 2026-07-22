"use client";

import content from "@/chapters/chapter-02/content/content.json";
import ProfileCard from "./ProfileCard";
import FavouriteCard from "./FavouriteCard";
import FloatingCarousel from "./FloatingCarousel";
import ChapterContainer from "./ChapterContainer";
import FadeIn from "./FadeIn";
import BackgroundGlow from "./BackgroundGlow";
import FloatingHearts from "./FloatingHearts";

export default function Chapter2View() {
  const favourites = [
    { label: "Favourite Colour", value: content.favouriteColour, emoji: "💖" },
    { label: "Favourite Food", value: content.favouriteFood, emoji: "🍜" },
    { label: "Favourite Movie", value: content.favouriteMovie, emoji: "🎬" },
    { label: "Favourite Song", value: content.favouriteSong, emoji: "🎵" },
    { label: "Favourite Place", value: content.favouritePlace, emoji: "🏔️" },
    { label: "Favourite Hero", value: content.favouriteHero, emoji: "🌟" },
    { label: "Favourite Actress", value: content.favouriteActress, emoji: "🎭" },
    { label: "Favourite Emoji", value: content.favouriteEmoji, emoji: "😏" },
  ];

  return (
    <ChapterContainer
      chapterId={2}
      title="Meet The Birthday Queen"
      subtitle="Introducing the star of our story, in all her grace, charm, and pottiness!"
    >
      <div className="relative w-full py-8 space-y-16">
        {/* Glow rings in the background */}
        <BackgroundGlow color="magenta" size={600} className="-top-20 -left-40" />
        <BackgroundGlow color="violet" size={400} className="bottom-20 -right-20" />
        <FloatingHearts />

        {/* Profile Card Section */}
        <FadeIn delay={0.2} direction="up">
          <ProfileCard
            name={content.name}
            nickname={content.nickname}
            birthday={content.birthday}
            introduction={content.shortIntroduction}
            imageSrc="/api/assets/chapters/chapter-02/images/profile.jpeg"
          />
        </FadeIn>

        {/* Dynamic split section: Carousel & Favourites */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
          
          {/* Left Side: Favourites Grid */}
          <div className="flex-1 w-full space-y-6">
            <FadeIn delay={0.3} direction="left">
              <h3 className="text-2xl font-display font-bold text-pink-700 mb-2 text-glow-rose">
                A Few of Her Favourite Things
              </h3>
            </FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {favourites.map((fav, idx) => (
                <FavouriteCard
                  key={idx}
                  label={fav.label}
                  value={fav.value}
                  emojiIcon={fav.emoji}
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Floating Image Slideshow */}
          <div className="w-full lg:w-auto flex justify-center items-center flex-shrink-0">
            <FadeIn delay={0.4} direction="right">
              <div className="space-y-4 text-center">
                <span className="text-xs uppercase tracking-widest text-primary font-bold text-glow-rose block">
                  Interactive Gallery
                </span>
                <FloatingCarousel basePath="/api/assets/chapters/chapter-02/images/" />
              </div>
            </FadeIn>
          </div>

        </div>
      </div>
    </ChapterContainer>
  );
}
