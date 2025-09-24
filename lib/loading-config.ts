// Configuration for loading progress tracking

export interface LoadingConfig {
  estimatedSize: number; // in bytes
  batchSize: number;
  totalItems: number;
  averageItemSize: number; // in bytes per item
}

export const LOADING_CONFIGS = {
  pokemon: {
    estimatedSize: 2.5 * 1024 * 1024, // ~2.5MB for 1302 Pokemon
    batchSize: 100,
    totalItems: 1302,
    averageItemSize: 2000, // ~2KB per Pokemon (JSON + metadata)
  },
  museum: {
    estimatedSize: 1.8 * 1024 * 1024, // ~1.8MB for artifacts
    batchSize: 50,
    totalItems: 500, // Estimated based on typical museum API responses
    averageItemSize: 3600, // ~3.6KB per artifact (larger due to images metadata)
  },
} as const;

export type LoadingType = keyof typeof LOADING_CONFIGS;

// Utility function to calculate progress based on bytes downloaded
export const calculateProgress = (
  bytesDownloaded: number,
  config: LoadingConfig
): number => {
  const progress = Math.min(
    (bytesDownloaded / config.estimatedSize) * 100,
    100
  );
  return Math.round(progress);
};

// Utility function to estimate remaining time
export const estimateRemainingTime = (
  bytesDownloaded: number,
  config: LoadingConfig,
  startTime: number
): number => {
  const elapsed = Date.now() - startTime;
  const bytesPerMs = bytesDownloaded / elapsed;
  const remainingBytes = config.estimatedSize - bytesDownloaded;

  if (bytesPerMs <= 0) return 0;

  const remainingMs = remainingBytes / bytesPerMs;
  return Math.round(remainingMs / 1000); // Return seconds
};
