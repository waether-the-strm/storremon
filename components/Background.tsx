export function Background() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-overlay" />
      <div className="fixed inset-0 pointer-events-none z-10 bg-grid-pattern" />
    </>
  );
}
