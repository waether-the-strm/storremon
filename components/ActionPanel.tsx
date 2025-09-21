interface ActionPanelProps {
  onLighter?: () => void;
  onEqual?: () => void;
  onHeavier?: () => void;
}

export function ActionPanel({
  onLighter,
  onEqual,
  onHeavier,
}: ActionPanelProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-4 sm:mb-6 lg:mb-10">
      <button
        onClick={onLighter}
        className="min-w-0 sm:min-w-[200px] px-6 sm:px-10 py-4 sm:py-5 bg-card border border-border rounded-2xl text-foreground text-sm sm:text-base font-medium transition-all duration-200 relative overflow-hidden hover:scale-95 sm:hover:scale-80 sm:hover:translate-x-5 hover:border-border-subtle before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary before:to-secondary before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-10"
      >
        <span className="relative z-10">↓ Smaller</span>
      </button>

      <button
        onClick={onEqual}
        className="min-w-0 sm:min-w-[200px] px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-br from-primary to-secondary rounded-2xl text-foreground text-sm sm:text-base font-medium transition-all duration-200 hover:scale-105 shadow-primary"
      >
        <span>= Equal</span>
      </button>

      <button
        onClick={onHeavier}
        className="min-w-0 sm:min-w-[200px] px-6 sm:px-10 py-4 sm:py-5 bg-card border border-border rounded-2xl text-foreground text-sm sm:text-base font-medium transition-all duration-200 relative overflow-hidden hover:scale-95 sm:hover:scale-120 sm:hover:translate-x-3 hover:border-border-subtle before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary before:to-secondary before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-10"
      >
        <span className="relative z-10">↑ Bigger</span>
      </button>
    </div>
  );
}
