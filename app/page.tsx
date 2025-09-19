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
    <div className="container mx-auto px-4 py-8">
      <section id="comparison-arena" className="mb-8">
        <h2 className="sr-only">Comparison Arena</h2>
        {/* Placeholder for cards */}
        <div className="grid h-96 grid-cols-2 gap-4">
          <div className="rounded-lg bg-neutral-800 p-4">
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error loading data</p>}
            {data && <pre>{JSON.stringify(data.pokemon, null, 2)}</pre>}
          </div>
          <div className="rounded-lg bg-neutral-800" />
        </div>
      </section>
      <section id="scale-slider">
        <h2 className="sr-only">Scale Slider</h2>
        <ScaleSlider />
      </section>
    </div>
  );
}
