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
    <div className="flex justify-center gap-6 mb-10">
      <button
        onClick={onLighter}
        className="min-w-[200px] px-10 py-5 bg-card border border-border rounded-2xl text-foreground text-base font-medium transition-all duration-200 relative overflow-hidden hover:translate-y-[-2px] hover:border-border-subtle before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary before:to-secondary before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-10"
      >
        <span className="relative z-10">← Lighter</span>
      </button>

      <button
        onClick={onEqual}
        className="min-w-[200px] px-10 py-5 bg-gradient-to-br from-primary to-secondary rounded-2xl text-foreground text-base font-medium transition-all duration-200 hover:translate-y-[-2px] hover:scale-[1.02] hover:shadow-[0_10px_40px_rgba(0,217,255,0.3)]"
      >
        <span>= Equal</span>
      </button>

      <button
        onClick={onHeavier}
        className="min-w-[200px] px-10 py-5 bg-card border border-border rounded-2xl text-foreground text-base font-medium transition-all duration-200 relative overflow-hidden hover:translate-y-[-2px] hover:border-border-subtle before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary before:to-secondary before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-10"
      >
        <span className="relative z-10">Heavier →</span>
      </button>
    </div>
  );
}
