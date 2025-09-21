"use client";

import React, { useState, useMemo } from "react";
import { motion, PanInfo, AnimatePresence } from "framer-motion";
import { ComparisonCard } from "./ComparisonCard";
import { PaginatedDots } from "./PaginatedDots";

interface TinderCardStackProps {
  items: any[];
  onCardSwipe?: (direction: "left" | "right", item: any) => void;
  className?: string;
  renderCard?: (item: any) => React.ReactNode;
}

const swipeThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
    scale: 0.8,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 500 : -500,
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 },
  }),
};

export function TinderCardStack({
  items,
  onCardSwipe,
  className = "",
  renderCard,
}: TinderCardStackProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  // We have to wrap the index to ensure it stays within bounds
  const cardIndex = ((page % items.length) + items.length) % items.length;
  const card = items[cardIndex];

  const paginate = (newDirection: number) => {
    if (!card) return;
    const directionString = newDirection > 0 ? "right" : "left";
    onCardSwipe?.(directionString, card);
    setPage([page + newDirection, newDirection]);
  };

  if (!card) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center text-foreground-secondary">
          <p className="text-lg font-medium">No items to display</p>
          <p className="text-sm">Try adjusting the size slider</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-[500px] flex items-center justify-center overflow-hidden bg-card/50 dark:bg-card/80 border border-border rounded-3xl p-4 ${className}`}
    >
      {/* Cards */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          custom={direction}
          drag="x"
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeThreshold) {
              paginate(1); // Next
            } else if (swipe > swipeThreshold) {
              paginate(-1); // Previous
            }
          }}
        >
          {renderCard ? renderCard(card) : <MemoizedCard item={card} />}
        </motion.div>
      </AnimatePresence>

      {/* Action buttons */}
      <button
        onClick={() => paginate(1)} // Next
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full border border-border hover:bg-card-hover transition-colors"
        aria-label="Next card"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => paginate(-1)} // Previous
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full border border-border hover:bg-card-hover transition-colors"
        aria-label="Previous card"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Bottom navigation */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-center">
        {/* Card Counter (left) */}
        <div className="absolute left-0">
          <div className="inline-block bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground-secondary">
            {cardIndex + 1} / {items.length}
          </div>
        </div>

        {/* Progress indicator (center) */}
        <PaginatedDots
          total={items.length}
          currentIndex={cardIndex}
          maxVisible={20}
        />
      </div>
    </div>
  );
}

// Memoized card component for better performance
const MemoizedCard = React.memo(({ item }: { item: any }) => {
  return (
    <div className="w-full h-full shadow-2xl">
      <ComparisonCard
        imageUrl={item.sprite || item.image}
        backImageUrl={item.backSprite}
        title={
          item.name
            ? item.name.charAt(0).toUpperCase() + item.name.slice(1)
            : item.title || ""
        }
        subtitle={
          item.types
            ? item.types.slice(0, 2).join(" • ")
            : item.artist || item.subtitle || ""
        }
        value={item.height ? `${item.height * 10}cm` : `${item.height}cm`}
        isRevealed={true}
        category={
          item.id ? `#${item.id.toString().padStart(3, "0")}` : `#${item.id}`
        }
        badge={
          item.types
            ? { text: "POKÉ", variant: "pokemon" }
            : { text: "ART", variant: "art" }
        }
        hasFlip={true}
        fallbackText={
          item.name
            ? item.name.charAt(0).toUpperCase()
            : item.title?.charAt(0).toUpperCase()
        }
        metadata={
          item.types
            ? {
                type: item.primaryType || item.types[0],
                gen: `Gen ${item.generation || "?"}`,
                weight: `${(item.weight / 10).toFixed(1)}kg`,
                allTypes: item.types.join(" • "),
                pokedexId: `#${item.id.toString().padStart(3, "0")}`,
                category: item.category,
              }
            : {
                period: item.date,
                artist: item.artist?.split(" ").pop() || "Unknown",
                dimensions: item.dimensions,
                fullArtist: item.artist || "Unknown Artist",
                artId: `#${item.id}`,
                category: "Museum Artifact",
              }
        }
        className="w-full h-full"
      />
    </div>
  );
});
