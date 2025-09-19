"use client";

import { ScaleSlider } from "@/components/ScaleSlider";
import { CategoryBadge } from "@/components/CategoryBadge";
import { VSArena } from "@/components/VSArena";
import { ActionPanel } from "@/components/ActionPanel";
import { usePokemonData } from "@/hooks/usePokemonData";
import { useEffect } from "react";

export default function Home() {
  const { data, isLoading, isError } = usePokemonData(50); // Hardcoded size for now

  useEffect(() => {
    if (data) {
      console.log("Fetched data:", data);
    }
    if (isError) {
      console.error("Error fetching data:", isError);
    }
  }, [data, isError]);

  const handleLighter = () => console.log("Lighter selected");
  const handleEqual = () => console.log("Equal selected");
  const handleHeavier = () => console.log("Heavier selected");

  return (
    <div className="flex flex-1 flex-col px-12 py-15 max-w-[1400px] w-full mx-auto">
      <CategoryBadge category="animals" />

      <VSArena
        leftCard={{
          emoji: "🐘",
          title: "African Elephant",
          subtitle: "Average adult weight",
          value: "6,000 kg",
          isRevealed: false,
        }}
        rightCard={{
          emoji: "🦏",
          title: "White Rhinoceros",
          subtitle: "Average adult weight",
          value: "2,300 kg",
          isRevealed: false,
        }}
      />

      <ActionPanel
        onLighter={handleLighter}
        onEqual={handleEqual}
        onHeavier={handleHeavier}
      />

      {/* Scale Slider - keeping for now */}
      <section id="scale-slider">
        <h2 className="sr-only">Scale Slider</h2>
        <ScaleSlider />
      </section>
    </div>
  );
}
