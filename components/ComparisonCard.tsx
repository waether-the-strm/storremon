interface ComparisonCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  value?: string | number;
  isRevealed?: boolean;
  position?: "left" | "right";
}

export function ComparisonCard({
  emoji,
  title,
  subtitle,
  value,
  isRevealed = false,
  position,
}: ComparisonCardProps) {
  // 3D transform based on position
  const hoverTransform =
    position === "left"
      ? "hover:rotate-y-[8deg] hover:rotate-x-[2deg]"
      : position === "right"
      ? "hover:rotate-y-[-8deg] hover:rotate-x-[2deg]"
      : "";

  const perspectiveClass = "perspective-1000";
  return (
    <div className={`${perspectiveClass}`}>
      <div
        className={`h-[420px] bg-card border border-border rounded-3xl p-12 flex flex-col justify-between transition-all duration-300 ease-out relative overflow-hidden group hover:bg-card-hover hover:border-border-subtle ${hoverTransform}`}
      >
        {/* Subtle top border gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />

        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="w-44 h-44 bg-gradient-to-br from-accent-cyan-transparent to-accent-purple-transparent rounded-2xl flex items-center justify-center text-7xl opacity-80">
            {emoji}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-foreground-secondary mb-6">{subtitle}</p>
          <div className="text-5xl font-bold tracking-tight relative">
            {/* Hidden state - shows ??? */}
            <div
              className={`absolute inset-0 text-foreground-tertiary transition-opacity duration-500 ${
                isRevealed ? "opacity-0" : "opacity-100"
              }`}
            >
              ???
            </div>

            {/* Revealed state - shows actual value with gradient */}
            <div
              className={`bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent transition-opacity duration-500 ${
                isRevealed ? "opacity-100" : "opacity-0"
              }`}
            >
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
