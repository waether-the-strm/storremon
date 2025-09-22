import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePokemonData } from "@/hooks/usePokemonData";

// Mock SWR
vi.mock("swr", () => ({
  default: vi.fn(),
}));

import useSWR from "swr";
const mockUseSWR = vi.mocked(useSWR);

describe("usePokemonData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return loading state initially", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => usePokemonData(50));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toBeUndefined();
  });

  it("should return data when loaded successfully", () => {
    const mockData = [
      { id: 1, name: "Bulbasaur", height: 7 },
      { id: 2, name: "Ivysaur", height: 10 },
    ];

    mockUseSWR.mockReturnValue({
      data: mockData,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => usePokemonData(50));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.isError).toBeUndefined();
  });

  it("should return error state when fetch fails", () => {
    const mockError = new Error("Failed to fetch");

    mockUseSWR.mockReturnValue({
      data: undefined,
      error: mockError,
      isLoading: false,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { result } = renderHook(() => usePokemonData(50));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isError).toEqual(mockError);
  });

  it("should call SWR with correct URL for different sizes", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: vi.fn(),
      isValidating: false,
    });

    // Test different sizes
    const sizes = [10, 25, 50, 75, 100];

    sizes.forEach((size) => {
      renderHook(() => usePokemonData(size));
      expect(mockUseSWR).toHaveBeenCalledWith(
        `/api/pokemon/${size}`,
        expect.any(Function)
      );
    });
  });

  it("should use the fetcher function correctly", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: vi.fn(),
      isValidating: false,
    });

    renderHook(() => usePokemonData(50));

    // Get the fetcher function that was passed to useSWR
    const fetcherFunction = mockUseSWR.mock.calls[0][1];

    // Mock fetch
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: "test" }),
    });
    global.fetch = mockFetch;

    // Test the fetcher function
    if (fetcherFunction) {
      fetcherFunction("/api/pokemon/50");
    }

    expect(mockFetch).toHaveBeenCalledWith("/api/pokemon/50");
  });

  it("should handle size changes by creating new SWR keys", () => {
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: vi.fn(),
      isValidating: false,
    });

    const { rerender } = renderHook(({ size }) => usePokemonData(size), {
      initialProps: { size: 50 },
    });

    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/pokemon/50",
      expect.any(Function)
    );

    // Change size
    rerender({ size: 75 });

    expect(mockUseSWR).toHaveBeenCalledWith(
      "/api/pokemon/75",
      expect.any(Function)
    );
  });

  it("should maintain consistent return interface", () => {
    const testCases = [
      { data: [], error: undefined, isLoading: false },
      { data: undefined, error: new Error("test"), isLoading: false },
      { data: undefined, error: undefined, isLoading: true },
    ];

    testCases.forEach((testCase) => {
      mockUseSWR.mockReturnValue({
        ...testCase,
        mutate: vi.fn(),
        isValidating: false,
      });

      const { result } = renderHook(() => usePokemonData(50));

      // Check that all expected properties are present
      expect(result.current).toHaveProperty("data");
      expect(result.current).toHaveProperty("isLoading");
      expect(result.current).toHaveProperty("isError");

      expect(result.current.data).toEqual(testCase.data);
      expect(result.current.isLoading).toBe(testCase.isLoading);
      expect(result.current.isError).toEqual(testCase.error);
    });
  });
});
