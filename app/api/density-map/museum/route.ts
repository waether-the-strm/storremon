import { NextResponse } from "next/server";
import { fetchAndCacheArtifacts, getArtifactCache } from "@/lib/museum-data";

export async function GET() {
  try {
    const artifactCache = getArtifactCache();
    if (artifactCache === null) {
      await fetchAndCacheArtifacts();
    }

    const finalArtifactCache = getArtifactCache() || [];
    const museumHeightsCm = finalArtifactCache.map((a) => a.height);

    return NextResponse.json(
      { heights: museumHeightsCm },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    console.error("[API_DENSITY_MAP_MUSEUM_ERROR]", error);
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
