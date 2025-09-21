"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { useContext, createContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NavLink = ({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="relative text-sm font-medium text-foreground-tertiary transition-colors hover:text-foreground"
    data-active={isActive}
  >
    {children}
    {isActive && (
      <span className="absolute -bottom-7 left-0 right-0 h-px bg-primary" />
    )}
  </Link>
);

type SizeInfo = { size: string; category: string } | null;

// Context for global UI state
export const SizeContext = createContext<{
  sizeInfo: SizeInfo;
  setSizeInfo: React.Dispatch<React.SetStateAction<SizeInfo>>;
  isHovering: boolean;
  setIsHovering: React.Dispatch<React.SetStateAction<boolean>>;
  pokemonCount: number | null;
  setPokemonCount: React.Dispatch<React.SetStateAction<number | null>>;
  artCount: number | null;
  setArtCount: React.Dispatch<React.SetStateAction<number | null>>;
} | null>(null);

export function Header() {
  const pathname = usePathname();
  const context = useContext(SizeContext);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showDesktopStats, setShowDesktopStats] = useState(true);

  // Auto-hide mobile nav after 3 seconds
  useEffect(() => {
    if (showMobileNav) {
      const timer = setTimeout(() => {
        setShowMobileNav(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMobileNav]);

  // Auto-hide mobile stats after 3 seconds
  useEffect(() => {
    if (showMobileStats) {
      const timer = setTimeout(() => {
        setShowMobileStats(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMobileStats]);

  // Close mobile dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showMobileNav &&
        !(event.target as Element).closest(".mobile-nav-container")
      ) {
        setShowMobileNav(false);
      }
      if (
        showMobileStats &&
        !(event.target as Element).closest(".mobile-stats-container")
      ) {
        setShowMobileStats(false);
      }
    };

    if (showMobileNav || showMobileStats) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showMobileNav, showMobileStats]);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Only show mobile nav on small screens, let normal navigation work on larger screens
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      // sm breakpoint
      e.preventDefault();
      setShowMobileNav(!showMobileNav);
    }
  };

  const handleStatsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // On desktop (md+), toggle desktop stats visibility
    // On mobile, show dropdown
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      // md breakpoint
      setShowDesktopStats(!showDesktopStats);
    } else {
      setShowMobileStats(!showMobileStats);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 sm:h-20 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-full items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Center content slot for size info on explorer page */}
        {pathname === "/" && context?.sizeInfo && (
          <motion.div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: context.isHovering ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="text-center bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50">
              <div className="text-sm font-semibold text-white/90">
                Size: {context.sizeInfo.size}
              </div>
              <div className="text-xs text-gray-400/80">
                {context.sizeInfo.category}
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex items-center gap-4 sm:gap-6 lg:gap-10">
          {/* Logo section */}
          <div className="relative mobile-nav-container">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg font-semibold tracking-tighter"
              onClick={handleLogoClick}
            >
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-90" />
              <span className="hidden sm:inline">Størrémon</span>
            </Link>

            {/* Mobile navigation dropdown */}
            <AnimatePresence>
              {showMobileNav && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 bg-background/95 backdrop-blur-lg border border-border rounded-2xl p-3 shadow-xl min-w-[120px] sm:hidden z-[60]"
                >
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/"
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        pathname === "/"
                          ? "bg-primary/20 text-primary"
                          : "text-foreground-secondary hover:text-foreground hover:bg-card"
                      }`}
                      onClick={() => setShowMobileNav(false)}
                    >
                      Explorer
                    </Link>
                    <Link
                      href="/game"
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        pathname === "/game"
                          ? "bg-primary/20 text-primary"
                          : "text-foreground-secondary hover:text-foreground hover:bg-card"
                      }`}
                      onClick={() => setShowMobileNav(false)}
                    >
                      Game
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation section - hidden on mobile */}
          <nav className="hidden sm:flex gap-4 sm:gap-6 lg:gap-10">
            <NavLink href="/" isActive={pathname === "/"}>
              Explorer
            </NavLink>
            <NavLink href="/game" isActive={pathname === "/game"}>
              Game
            </NavLink>
          </nav>
        </div>

        {/* Actions section */}
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Desktop stats - hidden on mobile */}
          <AnimatePresence>
            {showDesktopStats && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="hidden md:flex items-center justify-end gap-4 lg:gap-6 border-r border-border pr-4 lg:pr-6 w-32 sm:w-48 md:w-64 lg:w-80"
              >
                {pathname === "/game" ? (
                  // Game Mode: Show Streak & Score
                  <>
                    <div className="flex flex-col items-end">
                      <span className="mb-1 text-xs uppercase tracking-widest text-foreground-tertiary">
                        Streak
                      </span>
                      <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-lg font-semibold text-transparent">
                        12
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="mb-1 text-xs uppercase tracking-widest text-foreground-tertiary">
                        Score
                      </span>
                      <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-lg font-semibold text-transparent">
                        2,450
                      </span>
                    </div>
                  </>
                ) : (
                  // Explorer Mode: Show Data Stats
                  <>
                    <div className="flex flex-col items-end">
                      <span className="mb-1 text-xs uppercase tracking-widest text-foreground-tertiary">
                        Pokémon
                      </span>
                      <span className="bg-gradient-to-br from-red-500 to-red-600 bg-clip-text text-lg font-semibold text-transparent">
                        {context?.pokemonCount ?? "..."}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="mb-1 text-xs uppercase tracking-widest text-foreground-tertiary">
                        Artifacts
                      </span>
                      <span className="bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-lg font-semibold text-transparent">
                        {context?.artCount ?? "..."}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats toggle button */}
          <button
            className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full border transition-all hover:scale-105 relative mobile-stats-container ${
              showDesktopStats
                ? "border-border bg-card hover:bg-white/5 text-white/80"
                : "border-border bg-card hover:bg-white/5 text-white/50"
            }`}
            onClick={handleStatsClick}
            title={
              typeof window !== "undefined" && window.innerWidth >= 768
                ? showDesktopStats
                  ? "Hide stats"
                  : "Show stats"
                : "Show stats"
            }
          >
            <BarChart3 size={16} className="md:w-5 md:h-5" />

            {/* Mobile stats dropdown */}
            <AnimatePresence>
              {showMobileStats && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border rounded-2xl p-4 shadow-xl min-w-[180px] md:hidden z-[60]"
                >
                  {pathname === "/game" ? (
                    // Game Mode: Show Streak & Score
                    <div className="flex flex-col gap-3">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-widest text-foreground-tertiary mb-1">
                          Streak
                        </div>
                        <div className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-xl font-semibold text-transparent">
                          12
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-widest text-foreground-tertiary mb-1">
                          Score
                        </div>
                        <div className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-xl font-semibold text-transparent">
                          2,450
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Explorer Mode: Show Data Stats
                    <div className="flex flex-col gap-3">
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-widest text-foreground-tertiary mb-1">
                          Pokémon
                        </div>
                        <div className="bg-gradient-to-br from-red-500 to-red-600 bg-clip-text text-xl font-semibold text-transparent">
                          {context?.pokemonCount ?? "..."}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs uppercase tracking-widest text-foreground-tertiary mb-1">
                          Artifacts
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-xl font-semibold text-transparent">
                          {context?.artCount ?? "..."}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
}
