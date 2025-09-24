"use client";

import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import * as analytics from "@/lib/analytics";
import {
  cmToSliderValue,
  formatSize,
  getScaleLabel,
  sliderValueToCm,
} from "@/lib/scale-calculations";
import DensityChart from "./DensityChart";
import { calculateChartPoints, generateWaveData } from "./helpers";

interface ScaleSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  showDescription?: boolean;
  showPokemon?: boolean;
  showArt?: boolean;
}

interface DensityData {
  pokemon: number[];
  museum: number[];
}

// --- Helper Functions ---

export function ScaleSlider({
  value,
  onChange,
  className = "",
  showDescription = true,
  showPokemon = true,
  showArt = true,
}: ScaleSliderProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [densityData, setDensityData] = useState<DensityData>({
    pokemon: [],
    museum: [],
  });
  const [pokemonLoading, setPokemonLoading] = useState(true);
  const [museumLoading, setMuseumLoading] = useState(true);
  const [animationTime, setAnimationTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const debouncedValue = useDebounce(value, 500); // Debounce value with 500ms delay
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // This effect runs when the debounced value changes.
    // It will not run on every slider move, only after the user stops for 500ms.
    analytics.event({
      action: "slider_drag",
      category: "interaction",
      label: "Size Selector",
      value: Math.round(debouncedValue),
    });
  }, [debouncedValue]);

  useEffect(() => {
    const fetchDensityData = async (
      type: "pokemon" | "museum",
      setData: (data: number[]) => void,
      setLoading: (loading: boolean) => void
    ) => {
      try {
        const response = await fetch(`/api/density-map/${type}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} density data`);
        }
        const data: { heights: number[] } = await response.json();
        setData(data.heights);
      } catch (error) {
        console.error(error);
        // Set empty data on error
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDensityData(
      "pokemon",
      (pokemonData) =>
        setDensityData((prev) => ({ ...prev, pokemon: pokemonData })),
      setPokemonLoading
    );

    fetchDensityData(
      "museum",
      (museumData) =>
        setDensityData((prev) => ({ ...prev, museum: museumData })),
      setMuseumLoading
    );
  }, []);

  // Animation loop for loading waves
  useEffect(() => {
    if (!isClient || (!pokemonLoading && !museumLoading)) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const animate = () => {
      setAnimationTime((prev) => prev + 0.02);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [pokemonLoading, museumLoading, isClient]);

  const handleChange = (newValue: number) => {
    onChange(newValue);
    setShowTooltip(true);

    // Clear previous timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }

    // Hide tooltip after 1.5 seconds of no interaction
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 1500);
  };

  const valueToSize = (val: number) => {
    const sizeInCm = sliderValueToCm(val);
    return formatSize(sizeInCm);
  };

  // Generate line chart data points
  const generateChartData = () => {
    return {
      pokemonPoints:
        pokemonLoading && isClient
          ? generateWaveData(0, 1.4, "pokemon", animationTime)
          : calculateChartPoints(densityData.pokemon),
      museumPoints:
        museumLoading && isClient
          ? generateWaveData(Math.PI, 0.9, "museum", animationTime)
          : calculateChartPoints(densityData.museum),
    };
  };

  const labels = ["Micro", "Tiny", "Human-sized", "Large", "Colossal"];
  const currentLabel = getScaleLabel(value);

  // Separate state for dragging to control the thumb's appearance
  const [isDragging, setIsDragging] = useState(false);

  const { pokemonPoints, museumPoints } = generateChartData();

  return (
    <div
      className={`flex w-full flex-col items-center space-y-3 sm:space-y-6 ${className}`}
    >
      {/* Line Chart */}
      <DensityChart
        pokemonPoints={pokemonPoints}
        museumPoints={museumPoints}
        pokemonLoading={pokemonLoading}
        museumLoading={museumLoading}
        showPokemon={showPokemon}
        showArt={showArt}
        value={value}
      />
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-ew-resize opacity-0"
      />
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-out">
          <div
            className="bg-black/30 text-gray-200/70 text-xs font-mono px-2 py-1 rounded shadow-lg border border-gray-900"
            style={{
              position: "absolute",
              left: `calc(${value}% - 18px)`,
              bottom: "100%",
              marginBottom: "10px",
            }}
          >
            {valueToSize(value)}
          </div>
        </div>
      )}

      {/* Scale Labels with angled indicator lines */}
      <div className="relative mt-2 sm:mt-4 w-full max-w-2xl">
        {/* Angled lines pointing from labels to chart positions */}
        <div className="absolute -top-2 sm:-top-4 left-0 right-0 h-2 sm:h-4 pointer-events-none">
          {[
            { cm: 0.11, labelIndex: 0 }, // Micro (starts at 0.1cm)
            { cm: 1.03, labelIndex: 1 }, // Tiny (starts at 1cm)
            { cm: 50, labelIndex: 2 }, // Human-sized (starts at 50cm)
            { cm: 220, labelIndex: 3 }, // Large (starts at 220cm)
            { cm: 1000, labelIndex: 4 }, // Colossal (starts at 1000cm)
          ].map(({ cm, labelIndex }) => {
            const chartPosition = cmToSliderValue(cm);
            let labelPosition = (labelIndex / (labels.length - 1)) * 100; // 0%, 25%, 50%, 75%, 100%

            // Adjust label positions for better centering
            if (labelIndex === 0) {
              // Micro - move right
              labelPosition = Math.min(labelPosition + 4, 100);
            } else if (labelIndex === 4) {
              // Colossal - move left
              labelPosition = Math.max(labelPosition - 4, 0);
            }

            // Check if this is the currently active scale
            const label = labels[labelIndex];
            const isActive = currentLabel.startsWith(label);

            return (
              <svg
                key={cm}
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <line
                  x1={labelPosition}
                  y1="100"
                  x2={chartPosition}
                  y2="0"
                  stroke={
                    isActive
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(255, 255, 255, 0.2)"
                  }
                  strokeWidth={isActive ? "1" : "0.5"}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            );
          })}
        </div>

        <div className="flex w-full justify-between text-xs sm:text-sm px-1">
          {labels.map((label) => (
            <span
              key={label}
              className={`transition-colors duration-200 ${
                currentLabel.startsWith(label)
                  ? "text-white/90 font-medium"
                  : "text-gray-400/60"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
