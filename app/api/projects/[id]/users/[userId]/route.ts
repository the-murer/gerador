import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string; userId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const projects = client.db().collection("projects")

    await projects.updateOne({ _id: new ObjectId(params.id) }, { $pull: { allowedUsers: params.userId } })

    return NextResponse.json({ message: "User removed from project successfully" })
  } catch (error) {
    console.error("Failed to remove user from project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
