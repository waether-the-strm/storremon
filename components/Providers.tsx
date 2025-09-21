"use client";

import * as React from "react";
import { SizeContext } from "./Header";

export function Providers({ children }: { children: React.ReactNode }) {
  const [sizeInfo, setSizeInfo] = React.useState<{
    size: string;
    category: string;
  } | null>(null);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [pokemonCount, setPokemonCount] = React.useState<number | null>(null);
  const [artCount, setArtCount] = React.useState<number | null>(null);

  const value = React.useMemo(
    () => ({
      sizeInfo,
      setSizeInfo,
      isHovering: isInteracting,
      setIsHovering: setIsInteracting,
      pokemonCount,
      setPokemonCount,
      artCount,
      setArtCount,
    }),
    [sizeInfo, isInteracting, pokemonCount, artCount]
  );

  return <SizeContext.Provider value={value}>{children}</SizeContext.Provider>;
}
