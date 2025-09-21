"use client";

import { useState, useRef, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import * as analytics from "@/lib/analytics";

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
  showPokemon = true,
  showArt = true,
}: ScaleSliderProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [densityData, setDensityData] = useState<DensityData | null>(null);
  const debouncedValue = useDebounce(value, 500); // Debounce value with 500ms delay
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    if (!densityData) {
      return {
        pokemonPoints: [],
        museumPoints: [],
      };
    }

    const calculateChartPoints = (heights: number[]) => {
      if (heights.length === 0) return [];

      // Create data points for every 2% of the slider (50 points total)
      const points = Array.from({ length: 51 }, (_, i) => ({
        position: i * 2, // 0, 2, 4, 6, ... 100
        count: 0,
      }));

      heights.forEach((height) => {
        const sliderVal = cmToSliderValue(height);
        const index = Math.round(sliderVal / 2);
        if (points[index]) {
          points[index].count++;
        }
      });

      // Smooth the data with a simple moving average
      const smoothedPoints = points.map((point, index) => {
        const range = 2; // Look 2 points in each direction
        let sum = 0;
        let count = 0;

        for (
          let i = Math.max(0, index - range);
          i <= Math.min(points.length - 1, index + range);
          i++
        ) {
          sum += points[i].count;
          count++;
        }

        return {
          x: point.position,
          y: sum / count,
        };
      });

      // Normalize to 0-100 scale for chart height
      const maxCount = Math.max(...smoothedPoints.map((p) => p.y), 1);
      return smoothedPoints.map((p) => ({
        x: p.x,
        y: (p.y / maxCount) * 100, // Scale to 0-100
      }));
    };

    return {
      pokemonPoints: calculateChartPoints(densityData.pokemon),
      museumPoints: calculateChartPoints(densityData.museum),
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

  // Separate state for dragging to control the thumb's appearance
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`flex w-full flex-col items-center space-y-3 sm:space-y-6 ${className}`}
    >
      {/* Line Chart */}
      <div className="w-full max-w-2xl">
        <div className="relative w-full h-6 rounded-lg border-2 border-gray-800 shadow-inner bg-black/20">
          {/* Scale indicator lines */}
          {[1, 50, 220, 1000].map((cm) => (
            <div
              key={cm}
              className="absolute top-0 bottom-0 w-px bg-white/20 pointer-events-none"
              style={{ left: `${cmToSliderValue(cm)}%` }}
            />
          ))}

          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              transform: "scaleY(-1)",
              mixBlendMode: "screen",
            }}
          >
            {/* Pokemon Line (Red) */}
            {(() => {
              const { pokemonPoints } = generateChartData();
              if (pokemonPoints.length > 1) {
                const pathData = pokemonPoints
                  .map(
                    (point, index) =>
                      `${index === 0 ? "M" : "L"} ${point.x} ${Math.max(
                        5,
                        point.y
                      )}`
                  )
                  .join(" ");

                return (
                  <>
                    <path
                      d={`${pathData} L ${
                        pokemonPoints[pokemonPoints.length - 1].x
                      } 0 L ${pokemonPoints[0].x} 0 Z`}
                      fill={
                        showPokemon
                          ? "rgba(239, 68, 68, 0.6)"
                          : "rgba(100, 100, 100, 0.3)"
                      }
                      stroke="none"
                    />
                    <path
                      d={pathData}
                      fill="none"
                      stroke={
                        showPokemon ? "rgb(239, 68, 68)" : "rgb(120, 120, 120)"
                      }
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                );
              }
              return null;
            })()}

            {/* Museum Line (Blue) */}
            {(() => {
              const { museumPoints } = generateChartData();
              if (museumPoints.length > 1) {
                const pathData = museumPoints
                  .map(
                    (point, index) =>
                      `${index === 0 ? "M" : "L"} ${point.x} ${Math.max(
                        5,
                        point.y
                      )}`
                  )
                  .join(" ");

                return (
                  <>
                    <path
                      d={`${pathData} L ${
                        museumPoints[museumPoints.length - 1].x
                      } 0 L ${museumPoints[0].x} 0 Z`}
                      fill={
                        showArt
                          ? "rgba(59, 130, 246, 0.6)"
                          : "rgba(100, 100, 100, 0.3)"
                      }
                      stroke="none"
                    />
                    <path
                      d={pathData}
                      fill="none"
                      stroke={
                        showArt ? "rgb(59, 130, 246)" : "rgb(120, 120, 120)"
                      }
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  </>
                );
              }
              return null;
            })()}
          </svg>

          {/* Position Indicator - dark, extending beyond chart */}
          <div
            className="absolute -top-2 -bottom-2 flex flex-col items-center justify-between pointer-events-none transition-all duration-150 ease-out z-10"
            style={{
              left: `${value}%`,
              transform: "translateX(-50%)",
            }}
          >
            {/* Value tooltip */}
            {showTooltip && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-out">
                <div className="bg-black/30 text-gray-200/70 text-xs font-mono px-2 py-1 rounded shadow-lg border border-gray-900">
                  {valueToSize(value)}
                </div>
              </div>
            )}

            {/* Top dot */}
            <div className="w-2 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-md"></div>

            {/* Vertical line */}
            <div className="w-0.5 flex-1 bg-gray-800 mx-auto shadow-sm"></div>

            {/* Bottom dot */}
            <div className="w-2 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-md"></div>
          </div>

          {/* Hidden input for interaction */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full appearance-none bg-transparent cursor-ew-resize opacity-0"
          />
        </div>

        {/* Scale Labels with angled indicator lines */}
        <div className="relative mt-2 sm:mt-4">
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
    </div>
  );
}
