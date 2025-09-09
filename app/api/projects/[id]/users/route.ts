import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await request.json()

    const client = await clientPromise
    const projects = client.db().collection("projects")

    await projects.updateOne({ _id: new ObjectId(params.id) }, { $addToSet: { allowedUsers: userId } })

    return NextResponse.json({ message: "User added to project successfully" })
  } catch (error) {
    console.error("Failed to add user to project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
