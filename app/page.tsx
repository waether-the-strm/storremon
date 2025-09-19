"use client";

import { ProgressBar } from "@/components/ProgressBar";
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

      <ProgressBar current={13} total={20} progress={65} unlockCount={7} />
    </div>
  );
}
