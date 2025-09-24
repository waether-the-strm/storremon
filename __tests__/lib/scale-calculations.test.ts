import { describe, it, expect } from "vitest";
import {
  sliderValueToCm,
  cmToSliderValue,
  formatSize,
  getScaleLabel,
} from "../../lib/scale-calculations";

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
