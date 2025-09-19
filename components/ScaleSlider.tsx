export function ScaleSlider() {
  return (
    <div className="flex w-full flex-col items-center">
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="50"
        className="w-full"
      />
      <div className="mt-2 flex w-full justify-between text-xs text-neutral-400">
        <span>Tiny</span>
        <span>Human-sized</span>
        <span>Colossal</span>
      </div>
    </div>
  );
}
