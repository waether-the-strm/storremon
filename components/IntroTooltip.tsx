"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface IntroTooltipProps {
  className?: string;
}

export function IntroTooltip({ className = "" }: IntroTooltipProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const controls = useAnimation();
  const finalRotationRef = useRef(0); // Ref to store the random landing rotation
  const pathname = usePathname();

  const isGamePage = pathname === "/game";

  // Set initial state on mount based on localStorage
  useEffect(() => {
    const storageKey = `introTooltipShown_${pathname}`;
    const hasBeenShown = localStorage.getItem(storageKey);

    if (hasBeenShown) {
      // If shown before, start minimized
      setIsExpanded(false);
      setIsMinimized(true);
      controls.set({
        left: `calc(100vw - 80px)`,
        top: `calc(100vh - 80px)`,
        x: "0%",
        y: "0%",
        opacity: 1,
        scale: 1,
        rotate: finalRotationRef.current, // Use last known rotation
      });
    } else {
      // If first time, start expanded (and pokeball hidden in center)
      setIsExpanded(true);
      setIsMinimized(false);
      controls.set({
        left: "50vw",
        top: "50vh",
        x: "-50%",
        y: "-50%",
        opacity: 0,
        scale: 0.5,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Rerun when path changes

  const handleMinimize = useCallback(() => {
    const storageKey = `introTooltipShown_${pathname}`;
    localStorage.setItem(storageKey, "true"); // Mark as shown

    setIsExpanded(false);

    setTimeout(() => {
      controls.set({
        left: "50vw",
        top: "50vh",
        x: "-50%",
        y: "-50%",
        opacity: 1,
        scale: 1,
      });

      const finalAngle = 1080 + (Math.random() * 360 - 180);
      finalRotationRef.current = finalAngle; // Store the final angle

      controls.start({
        left: `calc(100vw - 80px)`,
        top: `calc(100vh - 80px)`,
        x: "0%",
        y: "0%",
        rotate: finalAngle,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 20,
          rotate: { duration: 1.2, ease: "linear" },
        },
      });
    }, 300);

    setTimeout(() => {
      setIsMinimized(true);
    }, 1100);
  }, [controls, pathname]);

  const handleExpand = useCallback(() => {
    setIsMinimized(false);
    controls.set({
      left: `calc(100vw - 80px)`,
      top: `calc(100vh - 80px)`,
      x: "0%",
      y: "0%",
      opacity: 1,
      scale: 1,
      rotate: finalRotationRef.current, // Start from the last known rotation
    });
    controls.start({
      left: [`calc(100vw - 80px)`, "30vw", "50vw"],
      top: [`calc(100vh - 80px)`, "30vh", "50vh"],
      x: ["0%", "0%", "-50%"],
      y: ["0%", "0%", "-50%"],
      rotate: -720,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        rotate: { duration: 0.6, ease: "linear" },
      },
    });

    setTimeout(() => {
      setIsExpanded(true);
      controls.start({ opacity: 0, scale: 0.5, transition: { duration: 0.2 } });
    }, 800);
  }, [controls]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        handleMinimize();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded, handleMinimize]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleMinimize();
    }
  };

  return (
    <>
      <motion.div
        className={`fixed z-[60] w-14 h-14 ${
          isMinimized ? "cursor-pointer" : ""
        }`}
        animate={controls}
        whileHover={
          isMinimized
            ? { scale: 1.15, rotate: finalRotationRef.current + 20 }
            : {}
        }
        onClick={isMinimized ? handleExpand : undefined}
        style={{
          transformOrigin: "center center",
          pointerEvents: isMinimized ? "auto" : "none",
        }}
      >
        <div className="w-full h-full rounded-full flex items-center justify-center shadow-2xl bg-gray-800 border-4 border-gray-700">
          <div
            className="relative w-10 h-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute top-0 left-0 w-10 h-5 rounded-t-full"
              style={{
                background: "linear-gradient(180deg, #FF1F1F 0%, #D80000 100%)",
                boxShadow:
                  "inset 0 2px 3px rgba(255,255,255,0.2), inset 0 -2px 3px rgba(0,0,0,0.2)",
              }}
            ></div>
            <div
              className="absolute bottom-0 left-0 w-10 h-5 rounded-b-full"
              style={{
                background: "linear-gradient(180deg, #F0F0F0 0%, #D4D4D4 100%)",
                boxShadow:
                  "inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.1)",
              }}
            ></div>
            <div className="absolute top-1/2 left-0 w-10 h-1 bg-black transform -translate-y-1/2"></div>
            <div
              className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border-2 border-gray-800 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, #FFFFFF, #E0E0E0)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              <div
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full border border-gray-500"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, #E8E8E8, #C8C8C8)",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={handleOverlayClick}
          >
            <motion.div
              key="modal-content"
              className={`relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 max-w-2xl w-full ${className}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleMinimize}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 transition-colors cursor-pointer"
                aria-label="Minimize intro"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-600 dark:text-gray-400"
                >
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="pr-8 pb-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600 dark:text-amber-500/80"
                    >
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900/90 dark:text-white/80 mb-2">
                      Welcome to Størrémon
                    </h3>
                    {isGamePage ? (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        This{" "}
                        <strong className="text-amber-500">Game section</strong>{" "}
                        showcases a concept for an interactive size comparison
                        experience. The current interface is a{" "}
                        <strong className="text-amber-500">design draft</strong>{" "}
                        demonstrating potential UI patterns and user flows that
                        could be developed into a full gaming experience.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        This project showcases my expertise in{" "}
                        <strong className="text-amber-500">Web Design</strong>{" "}
                        and{" "}
                        <strong className="text-amber-500">
                          Frontend Development
                        </strong>
                        . Størrémon is an interactive prototype focusing on{" "}
                        <strong className="text-amber-500">
                          innovative user interactions
                        </strong>{" "}
                        and{" "}
                        <strong className="text-amber-500">
                          original interface design
                        </strong>{" "}
                        for exploring size relationships between objects through
                        data visualization.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer with separator */}
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 pb-0 pr-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Interactive Prototype</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>Portfolio Project</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>Design & Development Showcase</span>
                  </div>

                  {/* GitHub link */}
                  <a
                    href="https://github.com/yourusername/game-app-layout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    aria-label="View source code on GitHub"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    <span>Source</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
