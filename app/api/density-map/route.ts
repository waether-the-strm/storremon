import { NextResponse } from "next/server";
import { fetchAndCachePokemon, getPokemonCache } from "@/lib/pokemon-data";
import { fetchAndCacheArtifacts, getArtifactCache } from "@/lib/museum-data";

export async function GET() {
  try {
    // Ensure both caches are populated in parallel if they are empty
    const pokemonCache = getPokemonCache();
    const artifactCache = getArtifactCache();

    const cachePromises: Promise<void>[] = [];
    if (pokemonCache === null) {
      cachePromises.push(fetchAndCachePokemon());
    }
    if (artifactCache === null) {
      cachePromises.push(fetchAndCacheArtifacts());
    }

    if (cachePromises.length > 0) {
      await Promise.all(cachePromises);
    }

    // Retrieve the now-populated caches
    const finalPokemonCache = getPokemonCache() || [];
    const finalArtifactCache = getArtifactCache() || [];

    // Extract just the heights and convert Pokemon heights from dm to cm
    const pokemonHeightsCm = finalPokemonCache.map((p) => p.height * 10);
    const museumHeightsCm = finalArtifactCache.map((a) => a.height);

    return NextResponse.json(
      {
        pokemon: pokemonHeightsCm,
        museum: museumHeightsCm,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    console.error("[API_DENSITY_MAP_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
