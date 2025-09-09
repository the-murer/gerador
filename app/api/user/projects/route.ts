import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const projects = client.db().collection("projects")

    // Find projects where the user is in the allowedUsers array
    const userProjects = await projects
      .find({
        allowedUsers: { $in: [session.user.id] },
      })
      .toArray()

    return NextResponse.json(userProjects)
  } catch (error) {
    console.error("Failed to fetch user projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
