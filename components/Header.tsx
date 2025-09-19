export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              Scale Explorer
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Placeholder for score */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <span className="font-semibold">Score: 0</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
