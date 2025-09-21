"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

interface TabOption {
  id: string;
  label: string;
  color: "red" | "blue";
}

interface TabSwitcherProps {
  options: TabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const colorVariants = {
  red: "bg-red-500",
  blue: "bg-blue-500",
};

export function TabSwitcher({
  options,
  activeTab,
  onTabChange,
  className = "",
}: TabSwitcherProps) {
  return (
    <div
      className={clsx(
        "relative flex w-full items-center justify-center p-1 bg-card/50 dark:bg-card/80 border border-border rounded-full",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onTabChange(option.id)}
          className={clsx(
            "relative z-10 w-1/2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            {
              "text-primary-foreground": activeTab === option.id,
              "text-foreground/80 hover:text-foreground":
                activeTab !== option.id,
            }
          )}
          aria-pressed={activeTab === option.id}
        >
          {option.label}
        </button>
      ))}
      <motion.div
        className={clsx(
          "absolute left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-full",
          colorVariants[options.find((o) => o.id === activeTab)?.color || "red"]
        )}
        initial={false}
        animate={{
          x: options.findIndex((o) => o.id === activeTab) === 0 ? "0%" : "100%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </div>
  );
}
