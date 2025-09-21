import { ComparisonCard } from "./ComparisonCard";
import { VSSeparator } from "./VSSeparator";

interface ComparisonData {
  imageUrl: string;
  title: string;
  subtitle: string;
  value: string | number;
  isRevealed?: boolean;
  category?: string;
  type?: string;
}

interface VSArenaProps {
  leftCard: ComparisonData;
  rightCard: ComparisonData;
}

export function VSArena({ leftCard, rightCard }: VSArenaProps) {
  return (
    <div className="flex-1 grid grid-cols-[1fr_auto_1fr] gap-1 sm:gap-8 lg:gap-20 items-center mb-6 sm:mb-10 lg:mb-15">
      <ComparisonCard
        imageUrl={leftCard.imageUrl}
        title={leftCard.title}
        subtitle={leftCard.subtitle}
        value={leftCard.value}
        isRevealed={leftCard.isRevealed}
        position="left"
        category={leftCard.category}
        badge={{ text: leftCard.type || "VS", variant: "info" }}
        isInteractive={true}
      />

      <VSSeparator />

      <ComparisonCard
        imageUrl={rightCard.imageUrl}
        title={rightCard.title}
        subtitle={rightCard.subtitle}
        value={rightCard.value}
        isRevealed={rightCard.isRevealed}
        position="right"
        category={rightCard.category}
        badge={{ text: rightCard.type || "VS", variant: "warning" }}
        isInteractive={true}
      />
    </div>
  );
}
