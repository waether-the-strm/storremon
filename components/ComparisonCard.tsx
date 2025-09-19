interface ComparisonCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  value?: string | number;
  isRevealed?: boolean;
}

export function ComparisonCard({
  emoji,
  title,
  subtitle,
  value,
  isRevealed = false,
}: ComparisonCardProps) {
  return (
    <div className="h-[420px] bg-card border border-border rounded-[24px] p-12 flex flex-col justify-between transition-all duration-300 ease-out relative overflow-hidden group hover:translate-y-[-4px] hover:bg-[rgba(255,255,255,0.03)] hover:border-border-subtle">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />

      <div className="flex-1 flex items-center justify-center mb-8">
        <div className="w-45 h-45 bg-gradient-to-br from-[rgba(0,217,255,0.1)] to-[rgba(168,85,247,0.1)] rounded-[20px] flex items-center justify-center text-[72px] opacity-80">
          {emoji}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2 tracking-tight">{title}</h2>
        <p className="text-sm text-foreground-secondary mb-6">{subtitle}</p>
        <div
          className={`text-5xl font-bold tracking-tight ${
            isRevealed
              ? "bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent opacity-100 transition-opacity duration-500"
              : "text-foreground-tertiary"
          }`}
        >
          {isRevealed ? value : "???"}
        </div>
      </div>
    </div>
  );
}
