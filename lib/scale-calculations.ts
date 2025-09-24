// --- Helper Functions for ScaleSlider ---

export const MIN_LOG = Math.log(0.1); // 0.1cm
export const MAX_LOG = Math.log(3000); // 30m = 3000cm

/**
 * Converts a slider value (0-100) to its corresponding real-world size in centimeters.
 * The conversion is logarithmic to provide better control over smaller sizes.
 *
 * @param val The slider value, ranging from 0 to 100.
 * @returns The size in centimeters.
 */
export const sliderValueToCm = (val: number): number => {
  const logValue = MIN_LOG + (val / 100) * (MAX_LOG - MIN_LOG);
  return Math.exp(logValue);
};

/**
 * Converts a real-world size in centimeters back to its corresponding slider value (0-100).
 * This is the inverse of sliderValueToCm.
 *
 * @param cm The size in centimeters.
 * @returns The slider value, ranging from 0 to 100.
 */
export const cmToSliderValue = (cm: number): number => {
  if (cm <= 0.1) return 0;
  if (cm >= 3000) return 100;
  const logCm = Math.log(cm);
  return ((logCm - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100;
};

/**
 * Formats a size in centimeters for display, showing one decimal place.
 *
 * @param cm The size in centimeters.
 * @returns A formatted string (e.g., "12.3cm").
 */
export const formatSize = (cm: number): string => {
  return `${cm.toFixed(1)}cm`;
};

/**
 * Determines a human-readable scale label based on the size in centimeters.
 *
 * @param val The slider value (0-100).
 * @returns A descriptive label (e.g., "Microscopic", "Human-sized").
 */
export const getScaleLabel = (val: number): string => {
  const sizeInCm = sliderValueToCm(val);

  if (sizeInCm < 1) return "Microscopic";
  if (sizeInCm < 50) return "Tiny";
  if (sizeInCm < 220) return "Human-sized";
  if (sizeInCm < 1000) return "Large";
  return "Colossal";
};
