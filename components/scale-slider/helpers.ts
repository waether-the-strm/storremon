import { cmToSliderValue } from "@/lib/scale-calculations";

export const generateWaveData = (
  baseOffset: number,
  speedMultiplier: number,
  waveType: "pokemon" | "museum",
  animationTime: number
) => {
  return Array.from({ length: 101 }, (_, i) => {
    const x = i * 1; // 0, 1, 2, ... 100 (denser points)
    const time = animationTime * speedMultiplier;

    let waveValue = 0;

    if (waveType === "pokemon") {
      // Pokemon waves - high frequency, chaotic, sharp peaks
      waveValue += Math.sin((x * 0.3 + time + baseOffset) * 2.5) * 0.3;
      waveValue +=
        Math.sin((x * 0.6 + time * 1.8 + baseOffset + 1.5) * 1.8) * 0.25;
      waveValue +=
        Math.sin((x * 1.2 + time * 1.2 + baseOffset + 3.1) * 3.2) * 0.2;
      waveValue +=
        Math.cos((x * 0.8 + time * 2.5 + baseOffset + 2.2) * 2.1) * 0.15;
      waveValue +=
        Math.sin((x * 1.8 + time * 3.1 + baseOffset + 1.1) * 1.5) * 0.1;
      // Add high-frequency noise for irregularity
      waveValue +=
        Math.sin(x * 2.5 + time * 4.2) * Math.cos(x * 1.8 + time * 2.8) * 0.08;
      waveValue +=
        Math.sin(x * 3.2 + time * 1.9) * Math.sin(x * 2.1 + time * 3.5) * 0.06;
    } else {
      // Museum waves - high frequency but smoother, flowing
      waveValue += Math.sin((x * 0.25 + time + baseOffset) * 2.0) * 0.3;
      waveValue +=
        Math.sin((x * 0.45 + time * 1.2 + baseOffset + 2.1) * 1.8) * 0.25;
      waveValue +=
        Math.cos((x * 0.8 + time * 1.8 + baseOffset + 4.2) * 2.5) * 0.2;
      waveValue +=
        Math.sin((x * 0.6 + time * 1.1 + baseOffset + 1.7) * 2.2) * 0.15;
      waveValue +=
        Math.cos((x * 1.1 + time * 2.2 + baseOffset + 3.3) * 1.6) * 0.1;
      // High-frequency but gentler secondary waves
      waveValue +=
        Math.cos(x * 1.5 + time * 1.8) * Math.sin(x * 1.2 + time * 1.4) * 0.08;
      waveValue +=
        Math.sin(x * 2.2 + time * 2.1) * Math.cos(x * 1.8 + time * 1.6) * 0.05;
    }

    // Normalize and scale
    const normalizedValue = (waveValue + 1) * 0.5; // Convert from [-1,1] to [0,1]

    return {
      x,
      y: Math.max(8, normalizedValue * 70 + 15), // Higher amplitude, better visibility
    };
  });
};

export const calculateChartPoints = (heights: number[]) => {
  if (heights.length === 0) return [];

  // Create data points for every 2% of the slider (50 points total)
  const points = Array.from({ length: 51 }, (_, i) => ({
    position: i * 2, // 0, 2, 4, 6, ... 100
    count: 0,
  }));

  heights.forEach((height) => {
    const sliderVal = cmToSliderValue(height);
    const index = Math.round(sliderVal / 2);
    if (points[index]) {
      points[index].count++;
    }
  });

  // Smooth the data with a simple moving average
  const smoothedPoints = points.map((point, index) => {
    const range = 2; // Look 2 points in each direction
    let sum = 0;
    let count = 0;

    for (
      let i = Math.max(0, index - range);
      i <= Math.min(points.length - 1, index + range);
      i++
    ) {
      sum += points[i].count;
      count++;
    }

    return {
      x: point.position,
      y: sum / count,
    };
  });

  // Normalize to 0-100 scale for chart height
  const maxCount = Math.max(...smoothedPoints.map((p) => p.y), 1);
  return smoothedPoints.map((p) => ({
    x: p.x,
    y: (p.y / maxCount) * 100, // Scale to 0-100
  }));
};
