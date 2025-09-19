import { ComparisonCard } from "./ComparisonCard";
import { VSSeparator } from "./VSSeparator";

interface ComparisonData {
  emoji: string;
  title: string;
  subtitle: string;
  value: string | number;
  isRevealed?: boolean;
}

interface VSArenaProps {
  leftCard: ComparisonData;
  rightCard: ComparisonData;
}

export function VSArena({ leftCard, rightCard }: VSArenaProps) {
  return (
    <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-20 items-center mb-15">
      <ComparisonCard
        emoji={leftCard.emoji}
        title={leftCard.title}
        subtitle={leftCard.subtitle}
        value={leftCard.value}
        isRevealed={leftCard.isRevealed}
      />

      <VSSeparator />

      <ComparisonCard
        emoji={rightCard.emoji}
        title={rightCard.title}
        subtitle={rightCard.subtitle}
        value={rightCard.value}
        isRevealed={rightCard.isRevealed}
      />
    </div>
  );
}
