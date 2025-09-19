import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size } = await params;
  // Placeholder data
  const data = {
    size,
    artifacts: [
      { title: "The Starry Night", objectID: 436535 },
      { title: "The Great Wave", objectID: 45434 },
    ],
  };

  return NextResponse.json(data);
}
