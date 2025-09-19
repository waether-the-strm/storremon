"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ComparisonCard } from "./ComparisonCard";
import { ScaleSlider } from "./ScaleSlider";
import { ToggleButtonGroup } from "./ToggleButtonGroup";

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

  // Mock data for now - will be replaced with real data in TASK-009
  const mockPokemonData = [
    {
      emoji: "🐛",
      title: "Caterpie",
      subtitle: "Worm Pokémon",
      value: "0.3m",
    },
    {
      emoji: "🦋",
      title: "Butterfree",
      subtitle: "Butterfly Pokémon",
      value: "1.1m",
    },
    {
      emoji: "🐭",
      title: "Pikachu",
      subtitle: "Mouse Pokémon",
      value: "0.4m",
    },
  ];

  const mockArtData = [
    {
      emoji: "🗿",
      title: "Roman Sculpture",
      subtitle: "Metropolitan Museum",
      value: "1.2m",
    },
    {
      emoji: "🏺",
      title: "Greek Vase",
      subtitle: "Ancient Pottery",
      value: "0.5m",
    },
    {
      emoji: "🎭",
      title: "Theater Mask",
      subtitle: "Classical Art",
      value: "0.3m",
    },
  ];

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
          <ScaleSlider />
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
            <h2 className="text-2xl font-semibold text-red-600 text-center">
              Pokémon
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockPokemonData.map((pokemon, index) => (
                <ComparisonCard
                  key={`pokemon-${index}`}
                  emoji={pokemon.emoji}
                  title={pokemon.title}
                  subtitle={pokemon.subtitle}
                  value={pokemon.value}
                  isRevealed={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Art Panel */}
        {showArt && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-blue-600 text-center">
              Museum Artifacts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockArtData.map((art, index) => (
                <ComparisonCard
                  key={`art-${index}`}
                  emoji={art.emoji}
                  title={art.title}
                  subtitle={art.subtitle}
                  value={art.value}
                  isRevealed={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State Placeholder for future */}
      {/* Will be implemented in TASK-009 */}
    </div>
  );
}
