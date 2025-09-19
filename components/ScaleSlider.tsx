"use client";

import { useState, useRef } from "react";

interface ScaleSliderProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export function ScaleSlider({
  value: controlledValue,
  onChange,
  className = "",
}: ScaleSliderProps) {
  const [internalValue, setInternalValue] = useState(50);
  const [isHovering, setIsHovering] = useState(false);
  const value = controlledValue ?? internalValue;

  const handleChange = (newValue: number) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  // Convert slider value (0-100) to real size units
  const valueToSize = (val: number) => {
    // Exponential scale: 0-100 maps to 0.1cm - 100m
    const minLog = Math.log(0.1); // 0.1cm
    const maxLog = Math.log(10000); // 100m = 10000cm
    const logValue = minLog + (val / 100) * (maxLog - minLog);
    const sizeInCm = Math.exp(logValue);

    if (sizeInCm < 100) {
      return `${sizeInCm.toFixed(1)}cm`;
    } else {
      return `${(sizeInCm / 100).toFixed(1)}m`;
    }
  };

  // Generate density heatmap as full background gradient
  const generateHeatmapBackground = () => {
    // Enhanced mock density data simulating real object distribution
    const densityPoints = [
      // Microscopic range
      { position: 0, density: 0.2 },
      { position: 5, density: 0.4 },
      { position: 10, density: 0.6 },

      // Tiny range - high density
      { position: 15, density: 0.9 },
      { position: 20, density: 0.95 },
      { position: 25, density: 0.8 },
      { position: 30, density: 0.7 },

      // Human-sized range - very high density
      { position: 35, density: 0.6 },
      { position: 40, density: 0.85 },
      { position: 45, density: 1.0 }, // Peak density
      { position: 50, density: 0.95 },
      { position: 55, density: 0.8 },
      { position: 60, density: 0.7 },

      // Large range - moderate density
      { position: 65, density: 0.5 },
      { position: 70, density: 0.6 },
      { position: 75, density: 0.4 },

      // Colossal range - low density
      { position: 80, density: 0.3 },
      { position: 85, density: 0.2 },
      { position: 90, density: 0.15 },
      { position: 95, density: 0.1 },
      { position: 100, density: 0.05 },
    ];

    // Create Pokemon (red top) gradient stops - increased visibility
    const redGradientStops = densityPoints
      .map((point) => {
        const alpha = 0.2 + point.density * 0.6; // Base 0.2 + variable 0.6 = max 0.8
        return `rgba(239, 68, 68, ${alpha}) ${point.position}%`;
      })
      .join(", ");

    // Create Art (blue bottom) gradient stops - increased visibility
    const blueGradientStops = densityPoints
      .map((point) => {
        const alpha = 0.2 + point.density * 0.6; // Base 0.2 + variable 0.6 = max 0.8
        return `rgba(59, 130, 246, ${alpha}) ${point.position}%`;
      })
      .join(", ");

    return {
      redGradient: `linear-gradient(90deg, ${redGradientStops})`,
      blueGradient: `linear-gradient(90deg, ${blueGradientStops})`,
    };
  };

  const getScaleLabel = (val: number) => {
    const sizeInCm = Math.exp(
      Math.log(0.1) + (val / 100) * (Math.log(10000) - Math.log(0.1))
    );

    if (sizeInCm < 1) return "Microscopic";
    if (sizeInCm < 50) return "Tiny";
    if (sizeInCm < 200) return "Human-sized";
    if (sizeInCm < 1000) return "Large";
    return "Colossal";
  };

  return (
    <div className={`flex w-full flex-col items-center space-y-6 ${className}`}>
      {/* Slider Container with matching styling */}
      <div className="w-full max-w-2xl">
        <div
          className="relative flex bg-gray-500/10 backdrop-blur-xs rounded-3xl p-6 shadow-inner overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Custom Slider Track with Heatmap Background */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleChange(Number(e.target.value))}
            className="w-full rounded-full appearance-none cursor-pointer slider-custom"
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
          {isHovering && (
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
        <div className="mt-4 flex w-full justify-between text-sm">
          <span className="text-gray-400/60">Microscopic</span>
          <span className="text-gray-400/60">Tiny</span>
          <span className="text-gray-400/60">Human-sized</span>
          <span className="text-gray-400/60">Large</span>
          <span className="text-gray-400/60">Colossal</span>
        </div>

        {/* Current Scale Display */}
        <div className="mt-4 text-center">
          <div className="text-lg font-semibold text-white/90">
            {getScaleLabel(value)}
          </div>
          <div className="text-sm text-gray-400/80 mt-1">
            Size: {valueToSize(value)} • Finding objects of this size...
          </div>
        </div>
      </div>
    </div>
  );
}
