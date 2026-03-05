import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch external IP from ipify service
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    
    return NextResponse.json({
      ip: data.ip,
      message: "This is the outbound IP address of your Render server",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Failed to fetch IP:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch IP address",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
