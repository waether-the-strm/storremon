import React from "react";
import { cmToSliderValue } from "@/lib/scale-calculations";

interface Point {
  x: number;
  y: number;
}

interface DensityChartProps {
  pokemonPoints: Point[];
  museumPoints: Point[];
  pokemonLoading: boolean;
  museumLoading: boolean;
  showPokemon: boolean;
  showArt: boolean;
  value: number;
}

const ChartLine: React.FC<{
  points: Point[];
  isLoading: boolean;
  show: boolean;
  color: "red" | "blue";
}> = ({ points, isLoading, show, color }) => {
  if (points.length < 2) return null;

  const pathData = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${Math.max(5, point.y)}`
    )
    .join(" ");

  const fillColor = isLoading
    ? color === "red"
      ? "rgba(239, 68, 68, 0.4)"
      : "rgba(59, 130, 246, 0.4)"
    : show
    ? color === "red"
      ? "rgba(239, 68, 68, 0.6)"
      : "rgba(59, 130, 246, 0.6)"
    : "rgba(100, 100, 100, 0.3)";

  const strokeColor = isLoading
    ? color === "red"
      ? "rgb(239, 68, 68)"
      : "rgb(59, 130, 246)"
    : show
    ? color === "red"
      ? "rgb(239, 68, 68)"
      : "rgb(59, 130, 246)"
    : "rgb(120, 120, 120)";

  return (
    <g
      className={isLoading ? "" : "transition-all duration-1000 ease-out"}
      style={{ opacity: isLoading ? 0.8 : 1 }}
    >
      <path
        d={`${pathData} L ${points[points.length - 1].x} 0 L ${
          points[0].x
        } 0 Z`}
        fill={fillColor}
        stroke="none"
      />
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
};

const DensityChart: React.FC<DensityChartProps> = ({
  pokemonPoints,
  museumPoints,
  pokemonLoading,
  museumLoading,
  showPokemon,
  showArt,
  value,
}) => {
  return (
    <div className="w-full max-w-2xl mb-0">
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
          <ChartLine
            points={pokemonPoints}
            isLoading={pokemonLoading}
            show={showPokemon}
            color="red"
          />
          <ChartLine
            points={museumPoints}
            isLoading={museumLoading}
            show={showArt}
            color="blue"
          />
        </svg>

        {/* Position Indicator */}
        <div
          className="absolute -top-2 -bottom-2 flex flex-col items-center justify-between pointer-events-none transition-all duration-150 ease-out z-10"
          style={{
            left: `${value}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-2 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-md" />
          <div className="w-0.5 flex-1 bg-gray-800 mx-auto shadow-sm" />
          <div className="w-2 h-2 bg-gray-800 rounded-full border border-gray-600 shadow-md" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(DensityChart);
