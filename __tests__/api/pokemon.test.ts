import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/pokemon/[size]/route";
import { NextRequest } from "next/server";

// Mock the pokemon-data module
vi.mock("@/lib/pokemon-data", () => ({
  fetchAndCachePokemon: vi.fn(),
  getPokemonCache: vi.fn(),
}));

import { fetchAndCachePokemon, getPokemonCache } from "@/lib/pokemon-data";
const mockFetchAndCachePokemon = vi.mocked(fetchAndCachePokemon);
const mockGetPokemonCache = vi.mocked(getPokemonCache);

describe("Pokemon API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return filtered pokemon for valid size", async () => {
    const mockPokemonData = [
      {
        id: 1,
        name: "Bulbasaur",
        height: 50,
        weight: 69,
        sprite: "",
        backSprite: "",
        types: ["grass"],
        abilities: ["overgrow"],
        stats: { hp: 45, attack: 49 },
        primaryType: "grass",
        generation: 1,
        category: "seed",
      },
      {
        id: 2,
        name: "Ivysaur",
        height: 100,
        weight: 130,
        sprite: "",
        backSprite: "",
        types: ["grass"],
        abilities: ["overgrow"],
        stats: { hp: 60, attack: 62 },
        primaryType: "grass",
        generation: 1,
        category: "seed",
      },
      {
        id: 3,
        name: "Venusaur",
        height: 50,
        weight: 1000,
        sprite: "",
        backSprite: "",
        types: ["grass"],
        abilities: ["overgrow"],
        stats: { hp: 80, attack: 82 },
        primaryType: "grass",
        generation: 1,
        category: "seed",
      },
    ];

    mockGetPokemonCache
      .mockReturnValueOnce(mockPokemonData) // First call - cache exists
      .mockReturnValue(mockPokemonData); // Subsequent calls

    const mockParams = Promise.resolve({ size: "50" });
    const mockRequest = {} as NextRequest;

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2); // Should return only pokemon with height 50
    expect(data.every((p: any) => p.height === 50)).toBe(true);
  });

  it("should fetch and cache pokemon if cache is empty", async () => {
    const mockPokemonData = [
      {
        id: 1,
        name: "Bulbasaur",
        height: 50,
        weight: 69,
        sprite: "",
        backSprite: "",
        types: ["grass"],
        abilities: ["overgrow"],
        stats: { hp: 45, attack: 49 },
        primaryType: "grass",
        generation: 1,
        category: "seed",
      },
    ];

    mockGetPokemonCache
      .mockReturnValueOnce(null) // First call - no cache
      .mockReturnValue(mockPokemonData); // After caching

    mockFetchAndCachePokemon.mockResolvedValue(undefined);

    const mockParams = Promise.resolve({ size: "50" });
    const mockRequest = {} as NextRequest;

    const response = await GET(mockRequest, { params: mockParams });

    expect(mockFetchAndCachePokemon).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
  });

  it("should return 400 for invalid size parameter", async () => {
    const mockParams = Promise.resolve({ size: "invalid" });
    const mockRequest = {} as NextRequest;

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid size parameter");
  });

  it("should return 400 for negative size", async () => {
    const mockParams = Promise.resolve({ size: "-10" });
    const mockRequest = {} as NextRequest;

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain("Invalid size parameter");
  });

  it("should return empty array when no pokemon match the size", async () => {
    const mockPokemonData = [
      {
        id: 1,
        name: "Bulbasaur",
        height: 50,
        weight: 69,
        sprite: "",
        backSprite: "",
        types: ["grass"],
        abilities: ["overgrow"],
        stats: { hp: 45, attack: 49 },
        primaryType: "grass",
        generation: 1,
        category: "seed",
      },
      {
        id: 2,
        name: "Ivysaur",
        height: 100,
        weight: 130,
        sprite: "",
        backSprite: "",
        types: ["grass"],
        abilities: ["overgrow"],
        stats: { hp: 60, attack: 62 },
        primaryType: "grass",
        generation: 1,
        category: "seed",
      },
    ];

    mockGetPokemonCache.mockReturnValue(mockPokemonData);

    const mockParams = Promise.resolve({ size: "200" }); // Size that doesn't exist
    const mockRequest = {} as NextRequest;

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(0);
  });

  it("should return 500 when an error occurs", async () => {
    mockGetPokemonCache.mockImplementation(() => {
      throw new Error("Database error");
    });

    const mockParams = Promise.resolve({ size: "50" });
    const mockRequest = {} as NextRequest;

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
  });

  it("should set correct CORS headers", async () => {
    mockGetPokemonCache.mockReturnValue([]);

    const mockParams = Promise.resolve({ size: "50" });
    const mockRequest = {} as NextRequest;

    const response = await GET(mockRequest, { params: mockParams });

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Cache-Control")).toContain("public");
  });

  it("should handle zero size parameter", async () => {
    const mockPokemonData = [
      {
        id: 1,
        name: "TestPokemon",
        height: 0,
        weight: 10,
        sprite: "",
        backSprite: "",
        types: ["normal"],
        abilities: ["test"],
        stats: { hp: 50, attack: 50 },
        primaryType: "normal",
        generation: 1,
        category: "test",
      },
    ];

    mockGetPokemonCache.mockReturnValue(mockPokemonData);

    const mockParams = Promise.resolve({ size: "0" });
    const mockRequest = {} as NextRequest;

    const response = await GET(mockRequest, { params: mockParams });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].height).toBe(0);
  });
});
