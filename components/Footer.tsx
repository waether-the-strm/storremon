"use client";

import { useState } from "react";

export function Footer() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{" "}
          <span
            className="relative inline-block font-medium whitespace-nowrap min-w-max"
            style={{
              transformStyle: "preserve-3d",
              perspective: "600px",
              height: "1.25rem",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Front face - STRM */}
            <a
              href="https://strm.dev"
              target="_blank"
              rel="noreferrer"
              className="block transition-all duration-700 ease-in-out"
              style={{
                transform: isHovered
                  ? "rotateX(-90deg) translateZ(10px)"
                  : "rotateX(0deg) translateZ(10px)",
                backfaceVisibility: "hidden",
                transformOrigin: "center center",
              }}
            >
              <span className="text-red-500">ST</span>
              <span className="text-blue-500">RM</span>
            </a>
            {/* Top face - Jan Mirecki */}
            <a
              href="https://strm.dev"
              target="_blank"
              rel="noreferrer"
              className="absolute top-0 left-0 transition-all duration-700 ease-in-out"
              style={{
                transform: isHovered
                  ? "rotateX(0deg) translateZ(10px)"
                  : "rotateX(90deg) translateZ(10px)",
                backfaceVisibility: "hidden",
                transformOrigin: "center center",
              }}
            >
              <span>Jan&nbsp;Mirecki</span>
            </a>
          </span>
          .
        </p>
      </div>
    </footer>
  );
}
