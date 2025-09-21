"use client";

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  activeColor?: "red" | "blue" | "green" | "purple" | "yellow";
  className?: string;
}

const colorClasses = {
  red: {
    active:
      "bg-red-500 text-red-900 hover:bg-red-700 hover:text-red-950 font-extrabold border-transparent glow-red hover:glow-red-hover",
    inactive:
      "bg-red-800/5 text-red-400/40 hover:bg-red-400/10 hover:text-red-400 border-red-300/10 hover:glow-subtle-red hover:border-red-400",
  },
  blue: {
    active:
      "bg-blue-500 text-blue-900 hover:bg-blue-700 hover:text-blue-950 font-extrabold border-transparent glow-blue hover:glow-blue-hover",
    inactive:
      "bg-blue-800/5 text-blue-400/30 hover:bg-blue-400/10 hover:text-blue-400 border-blue-300/10 hover:glow-subtle-blue hover:border-blue-400",
  },
  green: {
    active:
      "bg-green-500 text-green-900 hover:bg-green-700 hover:text-green-950 font-extrabold border-transparent glow-green hover:glow-green-hover",
    inactive:
      "bg-green-800/5 text-green-400/30 hover:bg-green-400/10 hover:text-green-400 border-green-300/10 hover:glow-subtle-green hover:border-green-400",
  },
  purple: {
    active:
      "bg-purple-500 text-purple-900 hover:bg-purple-700 hover:text-purple-950 font-extrabold border-transparent glow-purple hover:glow-purple-hover",
    inactive:
      "bg-purple-800/5 text-purple-400/30 hover:bg-purple-400/10 hover:text-purple-400 border-purple-300/10 hover:glow-subtle-purple hover:border-purple-400",
  },
  yellow: {
    active:
      "bg-yellow-500 text-yellow-900 hover:bg-yellow-700 hover:text-yellow-950 font-extrabold border-transparent glow-yellow hover:glow-yellow-hover",
    inactive:
      "bg-yellow-800/5 text-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-400 border-yellow-300/10 hover:glow-subtle-yellow hover:border-yellow-400",
  },
};

export function ToggleButton({
  isActive,
  onClick,
  children,
  activeColor = "blue",
  className = "",
}: ToggleButtonProps) {
  const colors = colorClasses[activeColor];

  return (
    <button
      onClick={onClick}
      className={`w-24 sm:w-32 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl transition-all duration-300 cursor-pointer border-2 ${
        isActive ? colors.active : colors.inactive
      } ${className}`}
    >
      {children}
    </button>
  );
}
