import { useState, useEffect, useRef } from "react";
import {
  LOADING_CONFIGS,
  LoadingType,
  calculateProgress,
  estimateRemainingTime,
} from "@/lib/loading-config";

interface LoadingProgress {
  isLoading: boolean;
  progress: number;
  estimatedTimeRemaining: number; // in seconds
  bytesDownloaded: number;
  startLoading: () => void;
  stopLoading: () => void;
}

interface UseLoadingProgressOptions {
  type: LoadingType;
  onComplete?: () => void;
}

export const useLoadingProgress = ({
  type,
  onComplete,
}: UseLoadingProgressOptions): LoadingProgress => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);
  const [bytesDownloaded, setBytesDownloaded] = useState(0);

  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const config = LOADING_CONFIGS[type];

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
    setBytesDownloaded(0);
    setEstimatedTimeRemaining(0);
    startTimeRef.current = Date.now();

    // Simulate progressive loading with realistic timing
    let currentBytes = 0;
    const bytesPerInterval = config.estimatedSize / 50; // 50 updates over the loading period
    const intervalMs = 100; // Update every 100ms

    intervalRef.current = setInterval(() => {
      currentBytes += bytesPerInterval;

      if (currentBytes >= config.estimatedSize) {
        currentBytes = config.estimatedSize;
        setProgress(100);
        setBytesDownloaded(currentBytes);
        setIsLoading(false);
        onComplete?.();

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        const newProgress = calculateProgress(currentBytes, config);
        const remainingTime = estimateRemainingTime(
          currentBytes,
          config,
          startTimeRef.current
        );

        setProgress(newProgress);
        setBytesDownloaded(currentBytes);
        setEstimatedTimeRemaining(remainingTime);
      }
    }, intervalMs);
  };

  const stopLoading = () => {
    setIsLoading(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isLoading,
    progress,
    estimatedTimeRemaining,
    bytesDownloaded,
    startLoading,
    stopLoading,
  };
};
