"use client";

import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import * as analytics from "@/lib/analytics";

interface ScaleSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  showDescription?: boolean;
}

interface DensityData {
  pokemon: number[];
  museum: number[];
}

// --- Helper Functions ---

const MIN_LOG = Math.log(0.1); // 0.1cm
const MAX_LOG = Math.log(3000); // 30m = 3000cm

// Convert slider value (0-100) to real size in cm
const sliderValueToCm = (val: number) => {
  const logValue = MIN_LOG + (val / 100) * (MAX_LOG - MIN_LOG);
  return Math.exp(logValue);
};

// Convert real size in cm to slider value (0-100)
const cmToSliderValue = (cm: number) => {
  if (cm <= 0.1) return 0;
  if (cm >= 3000) return 100;
  const logCm = Math.log(cm);
  return ((logCm - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100;
};

// Format size for display (cm or m)
const formatSize = (cm: number) => {
  return `${cm.toFixed(1)}cm`;
};

export function ScaleSlider({
  value,
  onChange,
  className = "",
  showDescription = true,
}: ScaleSliderProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [densityData, setDensityData] = useState<DensityData | null>(null);
  const debouncedValue = useDebounce(value, 500); // Debounce value with 500ms delay

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
    const fetchDensityData = async () => {
      try {
        const response = await fetch("/api/density-map");
        if (!response.ok) {
          throw new Error("Failed to fetch density data");
        }
        const data: DensityData = await response.json();
        setDensityData(data);
      } catch (error) {
        console.error(error);
        // Set empty data on error to prevent retries and show a blank heatmap
        setDensityData({ pokemon: [], museum: [] });
      }
    };

    fetchDensityData();
  }, []);

  const handleChange = (newValue: number) => {
    onChange(newValue);
  };

  const valueToSize = (val: number) => {
    const sizeInCm = sliderValueToCm(val);
    return formatSize(sizeInCm);
  };

  // Generate density heatmap as full background gradient
  const generateHeatmapBackground = () => {
    if (!densityData) {
      // Return a transparent gradient while data is loading
      return {
        redGradient: "linear-gradient(90deg, transparent, transparent)",
        blueGradient: "linear-gradient(90deg, transparent, transparent)",
      };
    }

    const calculateDensityPoints = (heights: number[]) => {
      if (heights.length === 0) return [];

      const points = Array.from({ length: 21 }, (_, i) => ({
        position: i * 5,
        count: 0,
      }));

      heights.forEach((height) => {
        const sliderVal = cmToSliderValue(height);
        const index = Math.round(sliderVal / 5);
        if (points[index]) {
          points[index].count++;
        }
      });

      const maxCount = Math.max(...points.map((p) => p.count), 1);

      return points.map((p) => ({
        position: p.position,
        density: Math.sqrt(p.count / maxCount), // Use sqrt for better visual spread
      }));
    };

    const pokemonDensityPoints = calculateDensityPoints(densityData.pokemon);
    const museumDensityPoints = calculateDensityPoints(densityData.museum);

    const createGradient = (densityPoints: any[]) => {
      if (densityPoints.length === 0) return "transparent";
      const stops = densityPoints
        .map((point) => {
          const alpha = 0.1 + point.density * 0.7;
          return `rgba(239, 68, 68, ${alpha}) ${point.position}%`;
        })
        .join(", ");
      return `linear-gradient(90deg, ${stops})`;
    };
    const createBlueGradient = (densityPoints: any[]) => {
      if (densityPoints.length === 0) return "transparent";
      const stops = densityPoints
        .map((point) => {
          const alpha = 0.1 + point.density * 0.7;
          return `rgba(59, 130, 246, ${alpha}) ${point.position}%`;
        })
        .join(", ");
      return `linear-gradient(90deg, ${stops})`;
    };

    return {
      redGradient: createGradient(pokemonDensityPoints),
      blueGradient: createBlueGradient(museumDensityPoints),
    };
  };

  const getScaleLabel = (val: number) => {
    const sizeInCm = sliderValueToCm(val);

    if (sizeInCm < 1) return "Microscopic";
    if (sizeInCm < 50) return "Tiny";
    if (sizeInCm < 220) return "Human-sized";
    if (sizeInCm < 1000) return "Large";
    return "Colossal";
  };

  const labels = ["Micro", "Tiny", "Human-sized", "Large", "Colossal"];
  const currentLabel = getScaleLabel(value);

  return (
    <div
      className={`flex w-full flex-col items-center space-y-3 sm:space-y-6 ${className}`}
    >
      {/* Slider Container with matching styling */}
      <div className="w-full max-w-2xl">
        <div
          className="relative flex items-center bg-gray-500/10 backdrop-blur-xs rounded-3xl p-3 sm:p-6 shadow-inner overflow-hidden"
          onPointerEnter={() => setIsInteracting(true)}
          onPointerLeave={() => setIsInteracting(false)}
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={() => setIsInteracting(false)}
        >
          {/* Scale Boundary Lines */}
          <div className="absolute top-0 bottom-0 left-3 sm:left-6 right-3 sm:right-6 pointer-events-none">
            {[1, 50, 220, 1000].map((cm) => (
              <div
                key={cm}
                className="absolute top-0 w-0.5 h-full bg-black/30"
                style={{ left: `${cmToSliderValue(cm)}%` }}
              />
            ))}
          </div>
          {/* Custom Slider Track with Heatmap Background */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
            className={`w-full rounded-full appearance-none cursor-pointer slider-custom ${
              isInteracting ? "thumb-active" : ""
            }`}
            style={{
              backgroundImage: `${generateHeatmapBackground().redGradient}, ${
                generateHeatmapBackground().blueGradient
              }`,
              backgroundSize: "100% 50%",
              backgroundPosition: "top, bottom",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Tooltip - only show on hover */}
          {isInteracting && (
            <div
              className="absolute -top-12 transform -translate-x-1/2 bg-gray-900/90 text-white text-xs px-3 py-2 rounded-lg transition-opacity duration-200 pointer-events-none"
              style={{ left: `${value}%` }}
            >
              {valueToSize(value)}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/90"></div>
            </div>
          )}
        </div>

        {/* Scale Labels */}
        <div className="relative mt-2 sm:mt-4 flex w-full justify-between text-xs sm:text-sm px-1">
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

        {/* Current Scale Display */}
        {showDescription && (
          <div className="mt-2 sm:mt-4 text-center">
            <div className="text-base sm:text-lg font-semibold text-white/90">
              Size: {valueToSize(value)}
            </div>
            <div className="text-xs sm:text-sm text-gray-400/80 mt-1">
              {getScaleLabel(value)} • Finding objects of this size...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
