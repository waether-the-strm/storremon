import { NextResponse } from "next/server";

// --- UTILITY FUNCTIONS AND TYPES ---

const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  height: number; // in decimeters
  weight: number; // in hectograms
  sprites: {
    front_default: string | null;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface FormattedPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprite: string;
  types: string[];
}

async function processInBatches<T, R>(
  items: T[],
  asyncOperation: (item: T) => Promise<R | null>,
  batchSize = 100
): Promise<R[]> {
  let results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(asyncOperation);
    const batchResults = await Promise.all(batchPromises);
    results = results.concat(batchResults.filter(Boolean) as R[]);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return results;
}

const fetchPokemonDetails = async (
  pokemon: PokemonListItem
): Promise<FormattedPokemon | null> => {
  try {
    const response = await fetch(pokemon.url, {
      next: { revalidate: 3600 * 24 },
    }); // Cache for 24 hours
    if (!response.ok) return null;
    const details: PokemonDetails = await response.json();

    if (!details.sprites.front_default) return null;

    return {
      id: details.id,
      name: details.name,
      height: details.height,
      weight: details.weight,
      sprite: details.sprites.front_default,
      types: details.types.map((t) => t.type.name),
    };
  } catch (error) {
    console.error(`Failed to fetch details for ${pokemon.name}:`, error);
    return null;
  }
};

async function getAllPokemon(): Promise<FormattedPokemon[]> {
  // NOTE: In a production app, this entire result should be cached more aggressively
  // (e.g., in Redis, Vercel KV, or a database) to avoid slow cold starts.
  // For this project, we rely on the caching of individual detail fetches.
  const listResponse = await fetch(`${POKE_API_URL}?limit=1302`);
  if (!listResponse.ok) {
    throw new Error("Failed to fetch the main Pokemon list from PokeAPI.");
  }
  const listData: { results: PokemonListItem[] } = await listResponse.json();

  const allPokemonDetails = await processInBatches(
    listData.results,
    fetchPokemonDetails,
    100
  );

  return allPokemonDetails;
}

// --- In-Memory Cache for Pokemon ---
let pokemonCache: FormattedPokemon[] | null = null;
let isFetchingPokemon = false;
let pokemonFetchPromise: Promise<void> | null = null;

const fetchAndCachePokemon = async (): Promise<void> => {
  if (isFetchingPokemon && pokemonFetchPromise) {
    return pokemonFetchPromise;
  }
  isFetchingPokemon = true;

  pokemonFetchPromise = (async () => {
    try {
      console.log("Fetching and caching all Pokémon...");
      const allPokemon = await getAllPokemon();
      pokemonCache = allPokemon;
      console.log(`Successfully cached ${allPokemon.length} Pokémon.`);
    } catch (error) {
      console.error("Failed to fetch and cache Pokémon:", error);
      pokemonCache = [];
    } finally {
      isFetchingPokemon = false;
      pokemonFetchPromise = null;
    }
  })();

  return pokemonFetchPromise;
};

// --- API ROUTE HANDLER ---

export async function GET(
  request: Request,
  { params }: { params: { size: string } }
) {
  try {
    const sizeNum = Number(params.size);

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

    if (pokemonCache === null) {
      await fetchAndCachePokemon();
    }

    const filteredPokemon =
      pokemonCache?.filter((p) => p.height === sizeNum) ?? [];

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
