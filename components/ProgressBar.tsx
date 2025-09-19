interface ProgressBarProps {
  current: number;
  total: number;
  progress: number;
  unlockCount?: number;
}

export function ProgressBar({
  current,
  total,
  progress,
  unlockCount,
}: ProgressBarProps) {
  return (
    <div className="max-w-[600px] mx-auto w-full">
      <div className="h-1 bg-card rounded-full overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-3 text-xs text-foreground-tertiary">
        <span>
          Round {current} of {total}
        </span>
        {unlockCount && <span>{unlockCount} more to unlock next category</span>}
      </div>
    </div>
  );
}
