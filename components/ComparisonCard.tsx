import React from "react";

interface BadgeProps {
  text: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "info"
    | "pokemon"
    | "art";
}

interface ComparisonCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  value?: string | number;
  isRevealed?: boolean;
  position?: "left" | "right";
  badge?: BadgeProps;
  category?: string;
  metadata?: {
    type?: string;
    region?: string;
    period?: string;
    artist?: string;
    [key: string]: string | undefined;
  };
  onClick?: () => void;
  isInteractive?: boolean;
  fallbackText?: string; // Text to show when image fails to load
  hasFlip?: boolean; // Enable card flip for additional content
  backImageUrl?: string; // Additional image for back side (e.g., Pokemon back sprite)
}

export function ComparisonCard({
  imageUrl,
  title,
  subtitle,
  value,
  isRevealed = false,
  position,
  badge,
  category,
  metadata,
  onClick,
  isInteractive = false,
  fallbackText,
  hasFlip = false,
  backImageUrl,
}: ComparisonCardProps) {
  // State for card flip
  const [isFlipped, setIsFlipped] = React.useState(false);

  // 3D transform based on position (only if not flippable)
  const hoverTransform = !hasFlip
    ? position === "left"
      ? "hover:rotate-y-[8deg] hover:rotate-x-[2deg]"
      : position === "right"
      ? "hover:rotate-y-[-8deg] hover:rotate-x-[2deg]"
      : ""
    : "";

  const perspectiveClass = "perspective-1000";

  const badgeVariants = {
    primary: "bg-primary/20 text-primary border-primary/30",
    secondary: "bg-secondary/20 text-secondary border-secondary/30",
    success: "bg-accent-green/20 text-accent-green border-accent-green/30",
    warning: "bg-warning/20 text-warning border-warning/30",
    info: "bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30",
    pokemon: "bg-red-500/20 text-red-400 border-red-500/30",
    art: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  // Determine if metadata should be shown on back
  const hasExtendedMetadata =
    metadata &&
    Object.entries(metadata).filter(([_, value]) => value).length > 2;

  const handleCardClick = () => {
    if (hasFlip) {
      setIsFlipped(!isFlipped);
    }
    onClick?.();
  };

  return (
    <div className={`${perspectiveClass} w-full`}>
      <div
        className={`
          relative w-full h-[420px] transition-all duration-700 transform-style-preserve-3d
          will-change-transform
          ${hasFlip ? "cursor-pointer" : ""}
          ${isFlipped ? "rotate-y-180" : ""}
          ${!hasFlip ? hoverTransform : ""}
        `}
        onClick={handleCardClick}
      >
        {/* FRONT SIDE */}
        <div
          className={`
            absolute inset-0 w-full h-full bg-card/80 backdrop-blur-sm border border-border rounded-3xl 
            flex flex-col transition-all duration-300 ease-out overflow-hidden group backface-hidden
            will-change-transform
            hover:bg-card-hover hover:border-card-border-glow hover:shadow-lg 
            ${!hasFlip && isInteractive ? "hover:scale-[1.02]" : ""}
            ${hasFlip ? "hover:scale-[1.01]" : ""}
          `}
        >
          {/* Ethereal top border with gradient glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-card-border-glow to-transparent" />

          {/* Enhanced corner accents */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-card-border-glow rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-card-border-glow rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-card-border-glow rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-card-border-glow rounded-br-lg" />

          {/* Header section - FIXED HEIGHT */}
          <div className="relative p-4 pb-2 h-16 flex flex-col justify-center">
            <div className="flex items-center justify-between">
              {badge && (
                <div
                  className={`
                  px-2 py-1 text-xs font-medium rounded-full border
                  ${badgeVariants[badge.variant || "primary"]}
                `}
                >
                  {badge.text}
                </div>
              )}
              {category && (
                <div className="text-xs text-foreground-secondary uppercase tracking-wider font-semibold">
                  {category}
                </div>
              )}
            </div>
          </div>

          {/* Main image area - FIXED HEIGHT */}
          <div className="relative mx-4 mb-4 h-40">
            <div className="relative w-full h-full bg-gradient-to-br from-accent-cyan-transparent via-card/50 to-accent-purple-transparent rounded-2xl flex items-center justify-center overflow-hidden border border-border-subtle shadow-inner">
              {/* Inner glow effect */}
              <div className="absolute inset-1 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl" />

              {/* Image container with fallback text */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallbackDiv = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (fallbackDiv) {
                      fallbackDiv.style.display = "flex";
                    }
                  }}
                />
                <div
                  className="hidden w-full h-full items-center justify-center text-2xl leading-none transition-transform duration-300 group-hover:scale-105"
                  style={{ display: "none" }}
                >
                  {fallbackText || title}
                </div>
              </div>
            </div>
          </div>

          {/* Content section - FIXED HEIGHT */}
          <div className="flex-1 px-4 pb-4 flex flex-col justify-between min-h-[200px]">
            {/* Title and subtitle - FIXED HEIGHT */}
            <div className="text-center h-16 flex flex-col justify-center">
              <h2 className="text-lg font-semibold mb-1 tracking-tight line-clamp-1">
                {title.length > 20 ? title.substring(0, 20) + "..." : title}
              </h2>
              <p className="text-sm text-foreground-secondary line-clamp-1">
                {subtitle.length > 30
                  ? subtitle.substring(0, 30) + "..."
                  : subtitle}
              </p>
            </div>

            {/* Basic metadata - MAX 2 items, rest goes to back */}
            {metadata &&
              Object.entries(metadata).some(([_, value]) => value) &&
              !hasFlip && (
                <div className="flex flex-wrap gap-1 justify-center mb-2 h-6">
                  {Object.entries(metadata)
                    .slice(0, 2)
                    .map(([key, value]) =>
                      value ? (
                        <div
                          key={key}
                          className="px-2 py-1 text-xs bg-card-hover border border-border rounded-lg text-foreground-tertiary"
                        >
                          {value}
                        </div>
                      ) : null
                    )}
                </div>
              )}

            {/* Value display - FIXED HEIGHT */}
            <div className="text-center h-20 flex items-center justify-center">
              <div className="text-4xl font-bold tracking-tight relative">
                <div
                  className={`absolute inset-0 text-foreground-tertiary transition-opacity duration-500 ${
                    isRevealed ? "opacity-0" : "opacity-100"
                  }`}
                >
                  ???
                </div>
                <div
                  className={`bg-gradient-to-br from-primary via-secondary to-primary bg-clip-text text-transparent transition-all duration-500 relative ${
                    isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                >
                  {value}
                </div>
              </div>
            </div>

            {/* Flip indicator */}
            {hasFlip && hasExtendedMetadata && (
              <div className="text-center h-6 flex items-end justify-center">
                <div className="text-xs text-foreground-tertiary">
                  ↻ Click to flip
                </div>
              </div>
            )}
          </div>

          {/* Subtle animated border on hover */}
          <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-card-border-glow/50 transition-all duration-300 pointer-events-none" />
        </div>

        {/* BACK SIDE - Only if hasFlip is true */}
        {hasFlip && (
          <div
            className={`
              absolute inset-0 w-full h-[420px] bg-card/90 backdrop-blur-sm border border-border rounded-3xl 
              flex flex-col transition-all duration-300 ease-out overflow-hidden group backface-hidden rotate-y-180
              will-change-transform
              hover:bg-card-hover hover:border-card-border-glow hover:shadow-lg
            `}
          >
            {/* Ethereal top border */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-card-border-glow to-transparent" />

            {/* Enhanced corner accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-card-border-glow rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-card-border-glow rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-card-border-glow rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-card-border-glow rounded-br-lg" />

            {/* Top section with title and back image */}
            <div className="flex justify-between items-start p-4 ">
              {/* Title, subtitle and value in left */}
              <div className="flex-1 pr-3 pt-3">
                <h2 className="text-lg font-semibold mb-1 tracking-tight leading-tight">
                  {title}
                </h2>
                <p className="text-xs text-foreground-secondary mb-2">
                  {subtitle}
                </p>
              </div>
            </div>

            {/* Horizontal bento-style metadata grid */}
            {metadata &&
              Object.entries(metadata).some(([_, value]) => value) && (
                <div className="grid grid-cols-3 gap-1 mb-4 px-4">
                  {Object.entries(metadata)
                    .filter(([_, value]) => value)
                    .map(([key, value], index, filteredArray) => (
                      <div
                        key={key}
                        className={`
                            p-1.5 border border-border rounded-lg
                            ${index === 0 ? "col-span-2" : ""}
                            ${
                              index === filteredArray.length - 1
                                ? "col-span-3"
                                : ""
                            }
                          `}
                      >
                        <div className="text-[9px] font-medium text-foreground-tertiary uppercase tracking-wider mb-1 leading-none">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-xs font-medium text-foreground leading-tight line-clamp-1">
                          {value}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            <div className="flex items-center justify-between px-4">
              {/* Back image miniature on right */}
              {backImageUrl && (
                <div className="size-24 bg-gradient-to-br from-accent-cyan-transparent via-card/50 to-accent-purple-transparent rounded-lg flex items-center justify-center border border-border-subtle shrink-0">
                  <img
                    src={backImageUrl}
                    alt={`${title} back view`}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="font-bold bg-gradient-to-br from-primary via-secondary to-primary bg-clip-text text-transparent">
                {value}
              </div>
            </div>
            {/* Flip indicator at bottom */}
            {hasFlip && (
              <div className="text-center h-6 flex items-end justify-center mt-auto mb-2">
                <div className="text-xs text-foreground-tertiary">
                  ↻ Click to flip back
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
