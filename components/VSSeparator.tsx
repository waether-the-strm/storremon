export function VSSeparator() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-px h-25 bg-gradient-to-b from-transparent via-border to-transparent" />
      <div className="px-6 py-3 bg-background-secondary border border-border rounded-xl text-xl font-bold tracking-wider text-foreground-tertiary">
        VS
      </div>
      <div className="w-px h-25 bg-gradient-to-b from-transparent via-border to-transparent" />
    </div>
  );
}
