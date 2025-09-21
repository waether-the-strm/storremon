// --- UTILITY FUNCTIONS AND TYPES ---

const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";

interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number; // in decimeters
  weight: number; // in hectograms
  sprites: {
    front_default: string | null;
    back_default: string | null;
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface FormattedPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprite: string;
  backSprite: string | null;
  types: string[];
  // Additional fields for enhanced card display
  primaryType: string;
  generation: number; // Based on ID ranges
  category: string; // Always "Pokemon"
}

async function processInBatches<T, R>(
  items: T[],
  asyncOperation: (item: T) => Promise<R | null>,
  batchSize = 100
) {
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

    // Helper function to determine generation based on ID
    const getGeneration = (id: number): number => {
      if (id <= 151) return 1;
      if (id <= 251) return 2;
      if (id <= 386) return 3;
      if (id <= 493) return 4;
      if (id <= 649) return 5;
      if (id <= 721) return 6;
      if (id <= 809) return 7;
      if (id <= 905) return 8;
      return 9;
    };

    const types = details.types.map((t) => t.type.name);

    return {
      id: details.id,
      name: details.name,
      height: details.height,
      weight: details.weight,
      sprite: details.sprites.front_default,
      backSprite: details.sprites.back_default,
      types,
      primaryType: types[0] || "unknown",
      generation: getGeneration(details.id),
      category: "Pokemon",
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

export const fetchAndCachePokemon = async (): Promise<void> => {
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

export const getPokemonCache = () => pokemonCache;
