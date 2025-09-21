"use client";

import { useState, useCallback } from "react";
import { ComparatorView } from "@/components/ComparatorView";

export default function Home() {
  const [showPokemon, setShowPokemon] = useState(true);
  const [showArt, setShowArt] = useState(true);

  const handleToggleChange = (optionId: "pokemon" | "art") => {
    if (optionId === "pokemon") {
      // If it's the only one active, toggle it off and the other on
      if (showPokemon && !showArt) {
        setShowPokemon(false);
        setShowArt(true);
      } else {
        setShowPokemon(!showPokemon);
      }
    } else if (optionId === "art") {
      // If it's the only one active, toggle it off and the other on
      if (showArt && !showPokemon) {
        setShowArt(false);
        setShowPokemon(true);
      } else {
        setShowArt(!showArt);
      }
    }
  };

  const pokemonOpacity = showPokemon && !showArt ? 1 : 0;
  const artOpacity = showArt && !showPokemon ? 1 : 0;
  const dualOpacity = showPokemon && showArt ? 1 : 0;

  return (
    <div className="relative flex flex-1 flex-col">
      {/* Layered Background Gradients with Individual Fade Transitions */}

      {/* Pokemon Radial Gradient Layer */}
      <div
        className="fixed inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          zIndex: -3,
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(239,68,68,0.06) 60%, rgba(239,68,68,0.12) 100%)",
          boxShadow: "inset 0 0 120px rgba(239,68,68,0.08)",
          opacity: pokemonOpacity,
        }}
      />

      {/* Art Radial Gradient Layer */}
      <div
        className="fixed inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          zIndex: -3,
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(59,130,246,0.12) 60%, rgba(59,130,246,0.18) 100%)",
          boxShadow: "inset 0 0 120px rgba(59,130,246,0.14)",
          opacity: artOpacity,
        }}
      />

      {/* Dual Linear Gradient Layer (Both active) */}
      <div
        className="fixed inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          zIndex: -2,
          background:
            "linear-gradient(to right, rgba(239,68,68,0.08), transparent, rgba(59,130,246,0.12))",
          boxShadow:
            "inset 40px 0 80px -40px rgba(239,68,68,0.08), inset -40px 0 80px -40px rgba(59,130,246,0.12)",
          opacity: dualOpacity,
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col px-4 sm:px-8 lg:px-12 py-8 sm:py-16 max-w-screen-2xl w-full mx-auto">
        <ComparatorView
          showPokemon={showPokemon}
          showArt={showArt}
          onToggleChange={handleToggleChange}
        />
      </div>
    </div>
  );
}
