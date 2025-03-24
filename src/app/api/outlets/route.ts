// src/app/api/outlets/route.ts
import { NextResponse } from "next/server";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL as string;
const OUTLETS_API_URL = `${API_URL}/outlets`;

export async function GET() {
  try {
    const response = await fetch(OUTLETS_API_URL);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.status}` },
        { status: response.status }
      );
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching outlets:", error); // Log the error
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}