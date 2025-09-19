"use client";

import Link from "next/link";

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
      <span className="absolute -bottom-[29px] left-0 right-0 h-px bg-primary" />
    )}
  </Link>
);

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-20 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-full items-center justify-between px-12">
        {/* Logo section */}
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tighter"
        >
          <div className="h-8 w-8 rounded-[8px] bg-gradient-to-br from-primary to-secondary opacity-90" />
          Size Battle
        </Link>

        {/* Navigation section */}
        <nav className="flex gap-10">
          <NavLink href="#" isActive>
            Classic
          </NavLink>
          <NavLink href="#">Accuracy</NavLink>
          <NavLink href="#">Time Rush</NavLink>
          <NavLink href="#">Tournament</NavLink>
        </nav>

        {/* Actions section */}
        <div className="flex items-center gap-8">
          {/* Score display */}
          <div className="flex items-center gap-6 border-r border-border pr-6">
            <div className="flex flex-col items-end">
              <span className="mb-1 text-[11px] uppercase tracking-[0.1em] text-foreground-tertiary">
                Streak
              </span>
              <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-lg font-semibold text-transparent">
                12
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="mb-1 text-[11px] uppercase tracking-[0.1em] text-foreground-tertiary">
                Score
              </span>
              <span className="bg-gradient-to-br from-primary to-secondary bg-clip-text text-lg font-semibold text-transparent">
                2,450
              </span>
            </div>
          </div>

          {/* Profile button */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-all hover:scale-105 hover:bg-white/5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
