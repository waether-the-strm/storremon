import { NextResponse } from "next/server";
import { fetchAndCacheArtifacts, getArtifactCache } from "@/lib/museum-data";

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
        { status: 400 }
      );
    }

    const artifactCache = getArtifactCache();
    // If cache is empty, populate it.
    if (artifactCache === null) {
      await fetchAndCacheArtifacts();
    }

    const currentCache = getArtifactCache();
    // Now, filter from the cache.
    const filteredArtifacts =
      currentCache?.filter((a) => a.height === sizeNum) ?? [];

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
