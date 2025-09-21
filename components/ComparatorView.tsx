"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ComparisonCard } from "./ComparisonCard";
import { ScaleSlider } from "./ScaleSlider";
import { ToggleButtonGroup } from "./ToggleButtonGroup";
import { useDebounce } from "../hooks/useDebounce";

export interface Pokemon {
  id: number;
  name: string;
  height: number; // in decimeters
  weight: number;
  sprite: string;
  backSprite: string | null;
  types: string[];
  primaryType: string;
  generation: number;
  category: string;
}

export interface Art {
  id: number;
  title: string;
  artist: string;
  date: string;
  height: number; // in cm
  dimensions: string;
  image: string;
}

// It's better to have this utility function outside or passed as a prop
// if it's needed in multiple places. For now, let's define it here.
const valueToSizeCm = (val: number): number => {
  const minLog = Math.log(0.1); // 0.1cm
  const maxLog = Math.log(3000); // 30m = 3000cm, increased range
  const logValue = minLog + (val / 100) * (maxLog - minLog);
  return Math.exp(logValue);
};

interface ComparatorViewProps {
  className?: string;
  onToggleChange?: (showPokemon: boolean, showArt: boolean) => void;
}

export function ComparatorView({
  className = "",
  onToggleChange,
}: ComparatorViewProps) {
  const [showPokemon, setShowPokemon] = useState(true);
  const [showArt, setShowArt] = useState(true);
  const [sliderValue, setSliderValue] = useState(50);
  const debouncedSliderValue = useDebounce(sliderValue, 300); // 300ms delay

  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [artData, setArtData] = useState<Art[]>([]);
  const [isPokemonLoading, setIsPokemonLoading] = useState(false);
  const [isArtLoading, setIsArtLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const sizeInCm = valueToSizeCm(debouncedSliderValue);

      if (showPokemon) {
        setIsPokemonLoading(true);
        try {
          // Pokemon height is in decimeters, so we convert cm to dm
          const sizeInDm = Math.round(sizeInCm / 10);
          const response = await fetch(`/api/pokemon/${sizeInDm}`);
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setPokemonData(data);
        } catch (error) {
          console.error("Failed to fetch Pokemon data:", error);
          setPokemonData([]); // Clear data on error
        } finally {
          setIsPokemonLoading(false);
        }
      } else {
        setPokemonData([]);
      }

      if (showArt) {
        setIsArtLoading(true);
        try {
          const size = Math.round(sizeInCm);
          const response = await fetch(`/api/museum/${size}`);
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setArtData(data);
        } catch (error) {
          console.error("Failed to fetch Art data:", error);
          setArtData([]); // Clear data on error
        } finally {
          setIsArtLoading(false);
        }
      } else {
        setArtData([]);
      }
    };

    fetchData();
  }, [debouncedSliderValue, showPokemon, showArt]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.1]);

  // Notify parent about initial toggle state
  useEffect(() => {
    onToggleChange?.(showPokemon, showArt);
  }, []);

  const handleToggle = (optionId: string) => {
    const isPokemon = optionId === "pokemon";
    const isArt = optionId === "art";

    if (isPokemon || isArt) {
      const [currentShow, otherShow, setCurrentShow, setOtherShow] = isPokemon
        ? [showPokemon, showArt, setShowPokemon, setShowArt]
        : [showArt, showPokemon, setShowArt, setShowPokemon];

      if (currentShow && !otherShow) {
        setCurrentShow(false);
        setOtherShow(true);
        onToggleChange?.(!currentShow, !otherShow);
      } else if (currentShow && otherShow) {
        setCurrentShow(false);
        onToggleChange?.(!currentShow, otherShow);
      } else {
        setCurrentShow(true);
        onToggleChange?.(currentShow, !otherShow);
      }
    }
  };

  const toggleOptions = [
    { id: "pokemon", label: "Pokémon", color: "red" as const },
    { id: "art", label: "Art", color: "blue" as const },
  ];

  const activeOptions = [
    ...(showPokemon ? ["pokemon"] : []),
    ...(showArt ? ["art"] : []),
  ];

  return (
    <div ref={containerRef} className={`flex flex-col space-y-8 ${className}`}>
      <motion.div
        className="sticky top-36 flex flex-col items-center space-y-4 mb-16"
        style={{ scale, opacity }}
      >
        <h1 className="text-3xl font-bold text-center">Størrémon</h1>
        {/* Category Toggle Header */}
        <div className="flex flex-col items-center space-y-4 mb-16 gap-8">
          <ToggleButtonGroup
            options={toggleOptions}
            activeOptions={activeOptions}
            onToggle={handleToggle}
          />

          <p className="text-gray-500 text-center max-w-2xl">
            Use the slider to find objects of specific dimensions. Toggle
            between Pokémon and Museum artifacts.
          </p>
        </div>

        {/* Scale Slider */}
        <div className="w-full max-w-4xl mx-auto">
          <ScaleSlider value={sliderValue} onChange={setSliderValue} />
        </div>
      </motion.div>
      {/* Two-panel Layout */}
      <div
        className={`grid gap-8 ${
          showPokemon && showArt ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* Pokemon Panel */}
        {showPokemon && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-red-600 text-center sr-only">
              Pokémon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isPokemonLoading ? (
                <p className="text-center col-span-full">Loading Pokémon...</p>
              ) : pokemonData.length > 0 ? (
                pokemonData.map((pokemon) => (
                  <ComparisonCard
                    key={pokemon.name}
                    imageUrl={pokemon.sprite}
                    backImageUrl={pokemon.backSprite || undefined}
                    title={
                      pokemon.name.charAt(0).toUpperCase() +
                      pokemon.name.slice(1)
                    }
                    subtitle={pokemon.types.slice(0, 2).join(" • ")}
                    value={`${(pokemon.height / 10).toFixed(1)}m`}
                    isRevealed={true}
                    category={`#${pokemon.id.toString().padStart(3, "0")}`}
                    badge={{ text: "POKÉ", variant: "pokemon" }}
                    hasFlip={true}
                    fallbackText={pokemon.name.charAt(0).toUpperCase()}
                    metadata={{
                      // FRONT: Basic info (max 2 for front display)
                      type: pokemon.primaryType,
                      gen: `Gen ${pokemon.generation}`,
                      // BACK: Detailed info for horizontal bento grid
                      weight: `${(pokemon.weight / 10).toFixed(1)}kg`,
                      allTypes: pokemon.types.join(" • "),
                      pokedexId: `#${pokemon.id.toString().padStart(3, "0")}`,
                      category: pokemon.category,
                    }}
                  />
                ))
              ) : (
                <ComparisonCard
                  imageUrl="invalid-url-to-trigger-fallback"
                  title="Tajemniczy Pokémon"
                  subtitle="Niewidzialny • Unikający"
                  value="404cm"
                  isRevealed={true}
                  category="#404"
                  badge={{ text: "POKÉ", variant: "pokemon" }}
                  fallbackText="( ͡° ͜ʖ ͡°)"
                  hasFlip={true}
                  metadata={{
                    type: "Niewidzialny",
                    gen: "Gen ?",
                    status: "W ukryciu",
                    ability: "Niewidzialność",
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Art Panel */}
        {showArt && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600 text-center sr-only">
              Museum Artifacts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isArtLoading ? (
                <p className="text-center col-span-full">
                  Loading Artifacts...
                </p>
              ) : artData.length > 0 ? (
                artData.map((art) => (
                  <ComparisonCard
                    key={art.id}
                    imageUrl={art.image}
                    title={art.title}
                    subtitle={art.artist || "Unknown Artist"}
                    value={`${art.height}cm`}
                    isRevealed={true}
                    category={`#${art.id}`}
                    badge={{ text: "ART", variant: "art" }}
                    hasFlip={true}
                    fallbackText={art.title.charAt(0).toUpperCase()}
                    metadata={{
                      // FRONT: Basic info
                      period: art.date,
                      artist: art.artist
                        ? art.artist.split(" ").pop()
                        : "Unknown",
                      // BACK: Detailed info for bento grid
                      dimensions: art.dimensions,
                      fullArtist: art.artist || "Unknown Artist",
                      artId: `#${art.id}`,
                      category: "Museum Artifact",
                    }}
                  />
                ))
              ) : (
                <ComparisonCard
                  imageUrl="invalid-url-to-trigger-fallback"
                  title="Zaginiony Eksponat"
                  subtitle="Nieznany Artysta"
                  value="∞cm"
                  isRevealed={true}
                  category="#404"
                  badge={{ text: "ART", variant: "art" }}
                  fallbackText="(╯°□°）╯︵ ┻━┻"
                  hasFlip={true}
                  metadata={{
                    period: "Era Wifi",
                    artist: "Nieznany",
                    status: "Na przerwie",
                    location: "Kawiarnia",
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
