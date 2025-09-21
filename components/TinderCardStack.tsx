"use client";

import React, { useState, useMemo } from "react";
import {
  motion,
  PanInfo,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ComparisonCard } from "./ComparisonCard";
import { PaginatedDots } from "./PaginatedDots";
import { TabSwitcher } from "./TabSwitcher";

interface TabbedStack {
  id: string;
  label: string;
  color: "red" | "blue";
  items: any[];
}

interface TinderCardStackProps {
  stacks: TabbedStack[];
  className?: string;
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
  stacks,
  className = "",
}: TinderCardStackProps) {
  const [activeTab, setActiveTab] = useState(stacks[0]?.id);
  const [[page, direction], setPage] = useState([0, 0]);
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-300, 0, 300], [20, 0, -20]);
  const opacity = useTransform(
    x,
    [-300, -150, 0, 150, 300],
    [0, 0.8, 1, 0.8, 0]
  );

  const activeStack = stacks.find((s) => s.id === activeTab) || stacks[0];
  const items = activeStack.items;

  // We have to wrap the index to ensure it stays within bounds
  const cardIndex = ((page % items.length) + items.length) % items.length;
  const card = items[cardIndex];

  const paginate = (newDirection: number) => {
    if (!card) return;
    setPage([page + newDirection, newDirection]);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPage([0, 0]); // Reset pagination on tab change
    x.set(0); // Reset x motion value
  };

  if (!stacks || stacks.length === 0) {
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
      className={`relative w-full h-[580px] flex flex-col items-center justify-start overflow-hidden bg-card/50 dark:bg-card/80 border border-border rounded-3xl p-4 ${className}`}
    >
      {stacks.length > 1 && (
        <TabSwitcher
          options={stacks.map(({ id, label, color }) => ({ id, label, color }))}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          className="w-full max-w-xs mb-4"
        />
      )}
      <div className="relative w-full flex-1 flex items-center justify-center perspective-1000">
        {/* Top (Draggable) Card */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${activeTab}-${page}`}
            className="absolute w-full h-full"
            style={{ x, rotateY, opacity }}
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
            {card ? <MemoizedCard item={card} /> : null}
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <button
          onClick={() => paginate(-1)} // Previous
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full border border-border hover:bg-card-hover transition-colors"
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={() => paginate(1)} // Next
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full border border-border hover:bg-card-hover transition-colors"
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
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

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
