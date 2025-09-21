"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface PaginatedDotsProps {
  total: number;
  currentIndex: number;
  maxVisible?: number;
  className?: string;
}

export function PaginatedDots({
  total,
  currentIndex,
  maxVisible = 20,
  className = "",
}: PaginatedDotsProps) {
  if (total <= maxVisible) {
    // If total dots are within the visible limit, render simple dots
    return (
      <div
        className={clsx(
          "flex items-center justify-center space-x-1.5",
          className
        )}
      >
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`h-5 w-0.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary scale-y-100"
                : "bg-foreground/20 scale-y-50"
            }`}
          />
        ))}
      </div>
    );
  }

  const currentPage = Math.floor(currentIndex / maxVisible);
  const indicatorWidthPlusGap = 8; // 2px width (w-0.5) + 6px gap (space-x-1.5)
  const translateX = -currentPage * maxVisible * indicatorWidthPlusGap;

  const hasPrevPage = currentPage > 0;
  const hasNextPage = (currentPage + 1) * maxVisible < total;

  const maskGradient = clsx({
    "mask-gradient-right": hasNextPage && !hasPrevPage,
    "mask-gradient-left": hasPrevPage && !hasNextPage,
    "mask-gradient-both": hasPrevPage && hasNextPage,
  });

  return (
    <div
      className={clsx(
        "relative w-[160px] overflow-hidden",
        className,
        maskGradient
      )}
    >
      <motion.div
        className="flex items-center space-x-1.5"
        animate={{ x: translateX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`h-5 w-0.5 flex-shrink-0 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary scale-y-100"
                : "bg-foreground/20 scale-y-50"
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}
