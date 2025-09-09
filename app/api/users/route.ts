import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const users = client.db().collection("users")

    const userList = await users.find({}, { projection: { password: 0 } }).toArray()

    return NextResponse.json(userList)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
