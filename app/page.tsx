"use client";

import { useState } from "react";
import { ComparatorView } from "@/components/ComparatorView";

export default function Home() {
  const [showPokemon, setShowPokemon] = useState(true);
  const [showArt, setShowArt] = useState(true);

  // Generate individual gradient opacities for smooth fade transitions
  const getPokemonOpacity = () => {
    if (showPokemon && !showArt) return 1; // Only Pokemon active
    if (showPokemon && showArt) return 1; // Both active (for dual gradient)
    return 0; // Pokemon inactive
  };

  const getArtOpacity = () => {
    if (showArt && !showPokemon) return 1; // Only Art active
    if (showPokemon && showArt) return 1; // Both active (for dual gradient)
    return 0; // Art inactive
  };

  const getDualGradientOpacity = () => {
    return showPokemon && showArt ? 1 : 0; // Only show dual gradient when both active
  };

  const handleToggleChange = (pokemon: boolean, art: boolean) => {
    setShowPokemon(pokemon);
    setShowArt(art);
  };

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
          opacity: showPokemon && !showArt ? getPokemonOpacity() : 0,
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
          opacity: showArt && !showPokemon ? getArtOpacity() : 0,
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
          opacity: getDualGradientOpacity(),
        }}
      />

      <div className="relative z-10 flex flex-1 flex-col px-12 py-16 max-w-screen-2xl w-full mx-auto">
        <ComparatorView onToggleChange={handleToggleChange} />
      </div>
    </div>
  );
}
