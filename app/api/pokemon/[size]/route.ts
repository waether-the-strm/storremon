import { NextResponse } from "next/server";
import { fetchAndCachePokemon, getPokemonCache } from "@/lib/pokemon-data";

// --- API ROUTE HANDLER ---

export async function GET(
  request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  try {
    const resolvedParams = await params;
    const sizeNum = Number(resolvedParams.size);

    if (isNaN(sizeNum) || sizeNum < 0) {
      return NextResponse.json(
        { error: "Invalid size parameter. Must be a non-negative number." },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    const pokemonCache = getPokemonCache();
    if (pokemonCache === null) {
      await fetchAndCachePokemon();
    }

    const currentCache = getPokemonCache();
    const filteredPokemon =
      currentCache?.filter((p) => p.height === sizeNum) ?? [];

    // Return the array of pokemon directly, as expected by the client
    return NextResponse.json(filteredPokemon, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=3600, s-maxage=86400", // 1h browser, 24h CDN
      },
    });
  } catch (error) {
    console.error("[API_POKEMON_ERROR]", error);
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
