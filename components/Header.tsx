"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

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

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-20 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="flex h-full items-center justify-between px-12">
        
        <div className="flex items-center gap-10">
          {/* Logo section */}
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-semibold tracking-tighter"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary opacity-90" />
            Størrémon
          </Link>

          {/* Navigation section */}
          <nav className="flex gap-10">
            <NavLink href="/" isActive={pathname === "/"}>
              Explorer
            </NavLink>
            <NavLink href="/game" isActive={pathname === "/game"}>
              Game
            </NavLink>
          </nav>
        </div>

        {/* Actions section */}
        <div className="flex items-center gap-8">
          {/* Contextual Widget */}
          <div className="flex items-center justify-end gap-6 border-r border-border pr-6 w-48 md:w-64 lg:w-80">
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
                    1,010
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="mb-1 text-xs uppercase tracking-widest text-foreground-tertiary">
                    Artifacts
                  </span>
                  <span className="bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-lg font-semibold text-transparent">
                    12,450
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Profile button */}
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-all hover:scale-105 hover:bg-white/5">
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
