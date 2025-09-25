import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const collection = client.db().collection("chatSessions")

    const parsedParams = await params;

    const chatSessions = await collection.find({
      projectId: new ObjectId(parsedParams.projectId),  
      userId: new ObjectId(session.user.id),
    }).toArray()


    return NextResponse.json(chatSessions.reverse() || [])
  } catch (error) {
    console.error("Failed to fetch chat history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
