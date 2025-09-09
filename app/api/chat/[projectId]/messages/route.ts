import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const client = await clientPromise;
    const collection = client.db().collection("chatSessions");

    const sessionId = await request.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 401 }
      );
    }

    const chatSession = await collection.findOne({
      _id: new ObjectId(sessionId),
    });

    return NextResponse.json(chatSession?.messages || []);
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
