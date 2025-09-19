import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { size: string } }
) {
  const size = params.size;
  // Placeholder data
  const data = {
    size,
    pokemon: [
      { name: "Pikachu", id: 25 },
      { name: "Charizard", id: 6 },
    ],
  };

  return NextResponse.json(data);
}
