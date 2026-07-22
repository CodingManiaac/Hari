import type { Metadata } from "next";
import { Quicksand, Caveat } from "next/font/google";
import Providers from "./providers";
import CursorEffects from "@/components/CursorEffects";
import MusicPlayer from "@/components/MusicPlayer";
import "@/styles/globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "For My Dearest Sister 🌸 Happy Birthday! ✨",
  description: "An interactive storybook of memories, wishes, and love.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${quicksand.variable} ${caveat.variable}`}>
      <body className="antialiased bg-background text-foreground selection:bg-primary/30 selection:text-primary overflow-x-hidden">
        <Providers>
          <CursorEffects />
          <MusicPlayer />
          <div className="relative min-h-screen w-full flex flex-col justify-between">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
