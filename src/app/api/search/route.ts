import { NextResponse } from "next/server";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL as string;
const SEARCH_API_URL = `${API_URL}/search`;

export async function GET(request: Request) {
  if (!API_URL) {
    return NextResponse.json(
      { error: "Missing API URL in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Extract query parameter from the request URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Missing search query parameter" },
        { status: 400 }
      );
    }

    // Call the API with the search query
    const response = await fetch(`${SEARCH_API_URL}?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch search results: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: { "Access-Control-Allow-Origin": "*" }, // Fix CORS issues
    });

  } catch (error) {
    console.error("Error fetching search results:", error); // Log the error
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
