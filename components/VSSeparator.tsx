export function VSSeparator() {
  return (
    <div className="flex flex-col items-center sm:gap-4 lg:gap-6">
      <div className="w-px h-8 sm:h-16 lg:h-25 bg-gradient-to-b from-transparent via-border to-transparent" />
      <div className="px-1 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 bg-background-secondary border border-border rounded-lg sm:rounded-xl text-sm sm:text-lg lg:text-xl font-bold tracking-wider text-foreground-tertiary">
        VS
      </div>
      <div className="w-px h-8 sm:h-16 lg:h-25 bg-gradient-to-b from-transparent via-border to-transparent" />
    </div>
  );
}
