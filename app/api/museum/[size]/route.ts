import { NextResponse } from "next/server";

// --- UTILITY FUNCTIONS AND TYPES ---

const MET_API_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

interface MetSearchResponse {
  total: number;
  objectIDs: number[] | null;
}

interface MetObject {
  objectID: number;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  dimensions: string;
  primaryImageSmall: string;
  measurements: {
    elementName: string;
    elementMeasurements: {
      Height?: number;
      Width?: number;
    };
  }[];
}

interface FormattedArtifact {
  id: number;
  title: string;
  artist: string;
  date: string;
  height: number; // in cm
  dimensions: string;
  image: string;
}

// NOTE: This function is duplicated from the pokemon route.
// In a real project, this should be extracted to a shared /lib/utils file.
async function processInBatches<T, R>(
  items: T[],
  asyncOperation: (item: T) => Promise<R | null>,
  batchSize = 50
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

const getSculptureObjectIDs = async (): Promise<number[]> => {
  const searchUrl = `${MET_API_URL}/search?departmentId=13&hasImages=true&q=sculpture`;
  // Cache the list of IDs for a day, as it's a heavy and infrequent request.
  const response = await fetch(searchUrl, { next: { revalidate: 3600 * 24 } });
  if (!response.ok) {
    throw new Error("Failed to search for sculptures in The Met API.");
  }
  const data: MetSearchResponse = await response.json();
  // Limit to 800 to keep initial fetch time reasonable.
  return data.objectIDs?.slice(0, 800) ?? [];
};

const fetchArtifactDetails = async (
  objectID: number
): Promise<FormattedArtifact | null> => {
  try {
    const response = await fetch(`${MET_API_URL}/objects/${objectID}`, {
      // Art object details are unlikely to change, so cache for a long time.
      next: { revalidate: 3600 * 24 * 7 }, // 1 week
    });
    if (!response.ok) return null;
    const art: MetObject = await response.json();

    if (!art.primaryImageSmall || !art.measurements) return null;

    const heightMeasurement = art.measurements.find(
      (m) => m.elementName === "Height" || m.elementName === "Overall"
    )?.elementMeasurements?.Height;

    if (!heightMeasurement) return null;
    const heightCm = Math.round(heightMeasurement);

    return {
      id: art.objectID,
      title: art.title,
      artist: art.artistDisplayName,
      date: art.objectDate,
      height: heightCm,
      dimensions: art.dimensions,
      image: art.primaryImageSmall,
    };
  } catch (error) {
    console.error(`Failed to fetch details for object ID ${objectID}:`, error);
    return null;
  }
};

// --- In-Memory Cache using Singleton Pattern ---

let artifactCache: FormattedArtifact[] | null = null;
let isFetching = false;
let fetchPromise: Promise<void> | null = null;

const fetchAndCacheArtifacts = async (): Promise<void> => {
  if (isFetching && fetchPromise) {
    return fetchPromise;
  }
  isFetching = true;

  fetchPromise = (async () => {
    try {
      console.log("Fetching and caching all artifacts...");
      const objectIDs = await getSculptureObjectIDs();
      if (objectIDs.length > 0) {
        const allArtifacts = await processInBatches(
          objectIDs,
          fetchArtifactDetails,
          50
        );
        artifactCache = allArtifacts;
        console.log(`Successfully cached ${allArtifacts.length} artifacts.`);
      } else {
        artifactCache = [];
      }
    } catch (error) {
      console.error("Failed to fetch and cache artifacts:", error);
      artifactCache = []; // Cache an empty array on failure to prevent retries
    } finally {
      isFetching = false;
      fetchPromise = null;
    }
  })();

  return fetchPromise;
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
        { status: 400 }
      );
    }

    // If cache is empty, populate it.
    if (artifactCache === null) {
      await fetchAndCacheArtifacts();
    }

    // Now, filter from the cache.
    const filteredArtifacts =
      artifactCache?.filter((a) => a.height === sizeNum) ?? [];

    // The response in the original code returns the wrong object shape.
    // The client expects an array of artifacts directly.
    return NextResponse.json(filteredArtifacts, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=3600, s-maxage=86400", // Let browser cache filtered result
      },
    });
  } catch (error) {
    console.error("[API_MUSEUM_ERROR]", error);
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
