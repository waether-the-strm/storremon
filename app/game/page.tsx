"use client";

import { ProgressBar } from "@/components/ProgressBar";
import { CategoryBadge } from "@/components/CategoryBadge";
import { VSArena } from "@/components/VSArena";
import { ActionPanel } from "@/components/ActionPanel";
import { usePokemonData } from "@/hooks/usePokemonData";
import { useEffect } from "react";

export default function GamePage() {
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
    <div className="flex flex-1 flex-col px-3 sm:px-8 lg:px-12 py-4 sm:py-8 lg:py-16 max-w-screen-2xl w-full mx-auto min-h-screen backdrop-blur-sm">
      <div className="mb-4 sm:mb-6 relative z-10">
        <CategoryBadge category="size" />
      </div>

      <VSArena
        leftCard={{
          imageUrl:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", // Bulbasaur
          title: "Bulbasaur",
          subtitle: "Grass/Poison Pokémon",
          value: "0.7m",
          isRevealed: true,
          category: "Pokémon",
          type: "Known",
        }}
        rightCard={{
          imageUrl:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png", // Charmander
          title: "Mystery Pokémon",
          subtitle: "Fire type creature",
          value: "0.6m",
          isRevealed: false,
          category: "Pokémon",
          type: "Unknown",
        }}
      />

      <ActionPanel
        onLighter={handleLighter}
        onEqual={handleEqual}
        onHeavier={handleHeavier}
      />

      <div className="mt-auto pt-4 sm:pt-6">
        <ProgressBar current={13} total={20} progress={65} unlockCount={7} />
      </div>
    </div>
  );
}
