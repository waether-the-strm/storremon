import { describe, it, expect } from "vitest";

// Extract the mathematical functions from ScaleSlider for testing
const MIN_LOG = Math.log(0.1); // 0.1cm
const MAX_LOG = Math.log(3000); // 30m = 3000cm

// Convert slider value (0-100) to real size in cm
const sliderValueToCm = (val: number) => {
  const logValue = MIN_LOG + (val / 100) * (MAX_LOG - MIN_LOG);
  return Math.exp(logValue);
};

// Convert real size in cm to slider value (0-100)
const cmToSliderValue = (cm: number) => {
  if (cm <= 0.1) return 0;
  if (cm >= 3000) return 100;
  const logCm = Math.log(cm);
  return ((logCm - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100;
};

// Format size for display (cm or m)
const formatSize = (cm: number) => {
  return `${cm.toFixed(1)}cm`;
};

// Get scale label based on size
const getScaleLabel = (val: number) => {
  const sizeInCm = sliderValueToCm(val);

  if (sizeInCm < 1) return "Microscopic";
  if (sizeInCm < 50) return "Tiny";
  if (sizeInCm < 220) return "Human-sized";
  if (sizeInCm < 1000) return "Large";
  return "Colossal";
};

describe("Scale calculation functions", () => {
  describe("sliderValueToCm", () => {
    it("should convert slider value 0 to minimum size (0.1cm)", () => {
      const result = sliderValueToCm(0);
      expect(result).toBeCloseTo(0.1, 2);
    });

    it("should convert slider value 100 to maximum size (3000cm)", () => {
      const result = sliderValueToCm(100);
      expect(result).toBeCloseTo(3000, 1);
    });

    it("should convert slider value 50 to middle-range size", () => {
      const result = sliderValueToCm(50);
      expect(result).toBeGreaterThan(1);
      expect(result).toBeLessThan(300);
    });

    it("should handle edge cases", () => {
      // Negative values should still return a positive result (extrapolated)
      expect(sliderValueToCm(-10)).toBeGreaterThan(0);
      expect(sliderValueToCm(-10)).toBeLessThan(0.1);
      expect(sliderValueToCm(110)).toBeGreaterThan(3000);
    });
  });

  describe("cmToSliderValue", () => {
    it("should convert minimum size (0.1cm) to slider value 0", () => {
      expect(cmToSliderValue(0.1)).toBe(0);
    });

    it("should convert maximum size (3000cm) to slider value 100", () => {
      expect(cmToSliderValue(3000)).toBe(100);
    });

    it("should handle sizes below minimum", () => {
      expect(cmToSliderValue(0.05)).toBe(0);
    });

    it("should handle sizes above maximum", () => {
      expect(cmToSliderValue(5000)).toBe(100);
    });

    it("should be inverse of sliderValueToCm", () => {
      const testValues = [10, 25, 50, 75, 90];

      testValues.forEach((sliderVal) => {
        const cm = sliderValueToCm(sliderVal);
        const backToSlider = cmToSliderValue(cm);
        expect(backToSlider).toBeCloseTo(sliderVal, 1);
      });
    });
  });

  describe("formatSize", () => {
    it("should format small sizes with 1 decimal place", () => {
      expect(formatSize(0.1)).toBe("0.1cm");
      expect(formatSize(5.67)).toBe("5.7cm");
    });

    it("should format large sizes correctly", () => {
      expect(formatSize(150.0)).toBe("150.0cm");
      expect(formatSize(1000.5)).toBe("1000.5cm");
    });
  });

  describe("getScaleLabel", () => {
    it("should return correct labels for different size ranges", () => {
      expect(getScaleLabel(0)).toBe("Microscopic"); // 0.1cm
      expect(getScaleLabel(20)).toBe("Microscopic"); // ~0.8cm still microscopic
      expect(getScaleLabel(35)).toBe("Tiny"); // ~3.7cm - tiny range
      expect(getScaleLabel(60)).toBe("Tiny"); // ~48.6cm - still tiny (< 50)
      expect(getScaleLabel(62)).toBe("Human-sized"); // ~52cm - human-sized range
      expect(getScaleLabel(85)).toBe("Large"); // ~639cm - large range
      expect(getScaleLabel(95)).toBe("Colossal"); // ~1792cm - colossal range
    });

    it("should handle edge cases at boundaries", () => {
      // Test values that should be on the boundary between categories
      const tinyToHumanBoundary = cmToSliderValue(50);
      const humanToLargeBoundary = cmToSliderValue(220);
      const largeToColossalBoundary = cmToSliderValue(1000);

      expect(getScaleLabel(tinyToHumanBoundary - 1)).toBe("Tiny");
      expect(getScaleLabel(tinyToHumanBoundary + 1)).toBe("Human-sized");

      expect(getScaleLabel(humanToLargeBoundary - 1)).toBe("Human-sized");
      expect(getScaleLabel(humanToLargeBoundary + 1)).toBe("Large");

      expect(getScaleLabel(largeToColossalBoundary - 1)).toBe("Large");
      expect(getScaleLabel(largeToColossalBoundary + 1)).toBe("Colossal");
    });
  });
});
