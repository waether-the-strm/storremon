"use client";

import { useState, useEffect, useRef, useContext } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ComparisonCard } from "./ComparisonCard";
import { TinderCardStack } from "./TinderCardStack";
import { ScaleSlider } from "./ScaleSlider";
import { ToggleButtonGroup } from "./ToggleButtonGroup";
import { useDebounce } from "../hooks/useDebounce";
import { SizeContext } from "./Header";
import { emptyArtCardProps, emptyPokemonCardProps } from "./empty-card-data";

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

const formatSize = (cm: number) => {
  return `${cm.toFixed(1)}cm`;
};

const getScaleLabel = (val: number) => {
  const sizeInCm = valueToSizeCm(val);

  if (sizeInCm < 1) return "Microscopic";
  if (sizeInCm < 50) return "Tiny";
  if (sizeInCm < 220) return "Human-sized";
  if (sizeInCm < 1000) return "Large";
  return "Colossal";
};

interface ComparatorViewProps {
  className?: string;
  showPokemon: boolean;
  showArt: boolean;
  onToggleChange: (optionId: "pokemon" | "art") => void;
}

export function ComparatorView({
  className = "",
  showPokemon,
  showArt,
  onToggleChange,
}: ComparatorViewProps) {
  const [sliderValue, setSliderValue] = useState(50);
  const debouncedSliderValue = useDebounce(sliderValue, 300); // 300ms delay

  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [artData, setArtData] = useState<Art[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isPokemonLoading, setIsPokemonLoading] = useState(false);
  const [isArtLoading, setIsArtLoading] = useState(false);
  const context = useContext(SizeContext);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (mobile) {
        document.documentElement.classList.add("snap-container-mobile");
      } else {
        document.documentElement.classList.remove("snap-container-mobile");
      }
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const sizeInCm = valueToSizeCm(debouncedSliderValue);

      if (showPokemon) {
        setIsPokemonLoading(true);
        try {
          // Pokemon height is in decimeters, so we convert cm to dm
          const sizeInDm = Math.max(1, Math.floor(sizeInCm / 10));
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
  const { scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const [sliderBgOpacity, setSliderBgOpacity] = useState(0);
  const motionDivRef = useRef(null);

  const opacity = useTransform(scrollY, [0, 200, 300], [1, 0.1, 0]);
  const scale = useTransform(scrollY, [0, 200, 300], [1, 0.95, 0.9]);
  const sliderBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(12px)"]
  );
  const sliderShadow = useTransform(
    scrollY,
    [0, 100],
    [
      "0px 0px 0px hsla(0, 0%, 100%, 0)",
      "0 15px 50px -10px hsla(0, 0%, 0%, 0.9)",
    ]
  );

  // Update global size info from context
  useEffect(() => {
    if (!context?.setSizeInfo) return;
    const size = formatSize(valueToSizeCm(sliderValue));
    const category = `${getScaleLabel(
      sliderValue
    )} • Finding objects of this size...`;
    context.setSizeInfo({ size, category });
  }, [sliderValue, context?.setSizeInfo]);

  // Update global counts from context
  useEffect(() => {
    if (context?.setPokemonCount) {
      context.setPokemonCount(pokemonData.length);
    }
  }, [pokemonData, context?.setPokemonCount]);

  useEffect(() => {
    if (context?.setArtCount) {
      context.setArtCount(artData.length);
    }
  }, [artData, context?.setArtCount]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const opacityValue = Math.min(latest / 100, 0.9);
    setSliderBgOpacity(opacityValue);
  });

  const handleToggle = (optionId: string) => {
    if (optionId === "pokemon" || optionId === "art") {
      onToggleChange(optionId);
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

  const mobileStacks = [];
  if (showPokemon) {
    mobileStacks.push({
      id: "pokemon",
      label: "Pokémon",
      color: "red" as const,
      items: pokemonData,
    });
  }
  if (showArt) {
    mobileStacks.push({
      id: "art",
      label: "Art",
      color: "blue" as const,
      items: artData,
    });
  }

  return (
    <div
      ref={containerRef}
      className={`flex flex-col space-y-4 sm:space-y-8 scroll-smooth snap-y snap-mandatory sm:snap-none scroll-pt-[120px] ${className}`}
    >
      {/* Header section with title and controls that fade on scroll */}
      <motion.div
        ref={motionDivRef}
        className={`sticky top-36 flex flex-col items-center space-y-4 mb-16`}
        style={{ opacity, scale }}
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
      </motion.div>

      {/* Scale Slider - always visible and sticky */}
      <motion.div
        className={`sticky top-20 sm:top-24 z-50 w-full sm:w-4/5 lg:w-1/2 mx-auto py-2 sm:py-4 px-4 sm:px-6 rounded-2xl border border-border/50`}
        style={{
          backgroundColor: `hsl(var(--background) / ${sliderBgOpacity})`,
          backdropFilter: sliderBlur,
          boxShadow: sliderShadow,
        }}
        onPointerEnter={() => context?.setIsHovering(true)}
        onPointerLeave={() => context?.setIsHovering(false)}
        onPointerDown={() => context?.setIsHovering(true)}
        onPointerUp={() => context?.setIsHovering(false)}
      >
        <ScaleSlider
          value={sliderValue}
          onChange={setSliderValue}
          showDescription={false}
        />
      </motion.div>
      {/* Two-panel Layout */}
      <div
        className={`grid gap-8 ${
          showPokemon && showArt && !isMobile
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {isMobile ? (
          <TinderCardStack stacks={mobileStacks} />
        ) : (
          <>
            {/* Pokemon Panel (Desktop) */}
            {showPokemon && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-red-600 text-center sr-only">
                  Pokémon
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {isPokemonLoading ? (
                    <p className="text-center col-span-full">
                      Loading Pokémon...
                    </p>
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
                        value={`${pokemon.height * 10}cm`}
                        isRevealed={true}
                        category={`#${pokemon.id.toString().padStart(3, "0")}`}
                        badge={{ text: "POKÉ", variant: "pokemon" }}
                        hasFlip={true}
                        fallbackText={pokemon.name.charAt(0).toUpperCase()}
                        metadata={{
                          type: pokemon.primaryType,
                          gen: `Gen ${pokemon.generation}`,
                          weight: `${(pokemon.weight / 10).toFixed(1)}kg`,
                          allTypes: pokemon.types.join(" • "),
                          pokedexId: `#${pokemon.id
                            .toString()
                            .padStart(3, "0")}`,
                          category: pokemon.category,
                        }}
                      />
                    ))
                  ) : (
                    <ComparisonCard {...emptyPokemonCardProps} />
                  )}
                </div>
              </div>
            )}

            {/* Art Panel (Desktop) */}
            {showArt && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-600 text-center sr-only">
                  Museum Artifacts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                        value={`${art.height.toFixed(1)}cm`}
                        isRevealed={true}
                        category={`#${art.id}`}
                        badge={{ text: "ART", variant: "art" }}
                        hasFlip={true}
                        fallbackText={art.title.charAt(0).toUpperCase()}
                        metadata={{
                          period: art.date,
                          artist: art.artist
                            ? art.artist.split(" ").pop()
                            : "Unknown",
                          dimensions: art.dimensions,
                          fullArtist: art.artist || "Unknown Artist",
                          artId: `#${art.id}`,
                          category: "Museum Artifact",
                        }}
                      />
                    ))
                  ) : (
                    <ComparisonCard {...emptyArtCardProps} />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
