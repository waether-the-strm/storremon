import { NextResponse } from "next/server";
import { fetchAndCachePokemon, getPokemonCache } from "@/lib/pokemon-data";

export async function GET() {
  try {
    const pokemonCache = getPokemonCache();
    if (pokemonCache === null) {
      await fetchAndCachePokemon();
    }

    const finalPokemonCache = getPokemonCache() || [];
    const pokemonHeightsCm = finalPokemonCache.map((p) => p.height * 10);

    return NextResponse.json(
      { heights: pokemonHeightsCm },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    console.error("[API_DENSITY_MAP_POKEMON_ERROR]", error);
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
