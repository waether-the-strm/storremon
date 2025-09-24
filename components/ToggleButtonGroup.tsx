"use client";

import { ToggleButton } from "./ToggleButton";

interface ToggleOption {
  id: string;
  label: string;
  color: "red" | "blue" | "green" | "purple" | "yellow";
}

interface ToggleButtonGroupProps {
  options: ToggleOption[];
  activeOptions: string[];
  onToggle: (optionId: string) => void;
  className?: string;
  containerClassName?: string;
  loadingStates?: Record<string, { isLoading: boolean; progress?: number }>;
}

export function ToggleButtonGroup({
  options,
  activeOptions,
  onToggle,
  className = "",
  containerClassName = "",
  loadingStates = {},
}: ToggleButtonGroupProps) {
  return (
    <div
      className={`flex bg-gray-100/10 backdrop-blur-xs rounded-3xl p-3 shadow-inner ${containerClassName}`}
    >
      {options.map((option, index) => {
        const loadingState = loadingStates[option.id] || {
          isLoading: false,
          progress: 0,
        };

        return (
          <ToggleButton
            key={option.id}
            isActive={activeOptions.includes(option.id)}
            onClick={() => onToggle(option.id)}
            activeColor={option.color}
            className={`${index > 0 ? "ml-2" : ""} ${className}`}
            isLoading={loadingState.isLoading}
            loadingProgress={loadingState.progress}
          >
            {option.label}
          </ToggleButton>
        );
      })}
    </div>
  );
}
