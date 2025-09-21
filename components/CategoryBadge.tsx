interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <div className="self-center mb-12 px-5 py-2 bg-card/80 backdrop-blur-sm border border-border rounded-full text-sm text-foreground-secondary tracking-wider relative z-20">
      CATEGORY: {category.toUpperCase()}
    </div>
  );
}
