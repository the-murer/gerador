import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const users = client.db().collection("users")

    await users.deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Failed to delete user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
