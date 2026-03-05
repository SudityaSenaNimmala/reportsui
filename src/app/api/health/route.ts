import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });
    
    return NextResponse.json({
      status: "ok",
      message: "MongoDB connection successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("MongoDB health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "MongoDB connection failed",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
