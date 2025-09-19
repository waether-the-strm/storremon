"use client";

import { ScaleSlider } from "@/components/ScaleSlider";
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

  return (
    <div className="flex flex-1 flex-col px-12 py-15 max-w-[1400px] w-full mx-auto">
      {/* Category Badge */}
      <div className="self-center mb-12 px-5 py-2 bg-card border border-border rounded-full text-sm text-foreground-secondary tracking-wider">
        CATEGORY: ANIMALS
      </div>

      {/* VS Arena */}
      <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-20 items-center mb-15">
        {/* Left Card - Placeholder */}
        <div className="h-[420px] bg-card border border-border rounded-[24px] p-12 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="w-45 h-45 bg-gradient-to-br from-[rgba(0,217,255,0.1)] to-[rgba(168,85,247,0.1)] rounded-[20px] flex items-center justify-center text-[72px] opacity-80">
              🐘
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2 tracking-tight">
              African Elephant
            </h2>
            <p className="text-sm text-foreground-secondary mb-6">
              Average adult weight
            </p>
            <div className="text-5xl font-bold tracking-tight text-foreground-tertiary">
              ???
            </div>
          </div>
        </div>

        {/* VS Separator */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-px h-25 bg-gradient-to-b from-transparent via-border to-transparent" />
          <div className="px-6 py-3 bg-background-secondary border border-border rounded-xl text-xl font-bold tracking-wider text-foreground-tertiary">
            VS
          </div>
          <div className="w-px h-25 bg-gradient-to-b from-transparent via-border to-transparent" />
        </div>

        {/* Right Card - Placeholder */}
        <div className="h-[420px] bg-card border border-border rounded-[24px] p-12 flex flex-col justify-between">
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="w-45 h-45 bg-gradient-to-br from-[rgba(0,217,255,0.1)] to-[rgba(168,85,247,0.1)] rounded-[20px] flex items-center justify-center text-[72px] opacity-80">
              🦏
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2 tracking-tight">
              White Rhinoceros
            </h2>
            <p className="text-sm text-foreground-secondary mb-6">
              Average adult weight
            </p>
            <div className="text-5xl font-bold tracking-tight text-foreground-tertiary">
              ???
            </div>
          </div>
        </div>
      </div>

      {/* Scale Slider - keeping for now */}
      <section id="scale-slider">
        <h2 className="sr-only">Scale Slider</h2>
        <ScaleSlider />
      </section>
    </div>
  );
}
