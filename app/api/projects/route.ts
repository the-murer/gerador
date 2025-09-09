import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getEnhancedPrompt } from "@/lib/ai-prompts"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const projects = client.db().collection("projects")

    const projectList = await projects.find({}).toArray()

    return NextResponse.json(projectList)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      name,
      githubRepo,
      customPrompt,
      destinationBranch,
      webhookUrl,
      projectType = "general",
    } = await request.json()

    if (!name || !githubRepo || !customPrompt || !destinationBranch) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const enhancedPrompt = getEnhancedPrompt(customPrompt, projectType)

    const client = await clientPromise
    const projects = client.db().collection("projects")

    const result = await projects.insertOne({
      name,
      githubRepo,
      customPrompt: enhancedPrompt,
      destinationBranch,
      webhookUrl: webhookUrl || "",
      projectType,
      adminId: new ObjectId(session.user.id),
      allowedUsers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Project created successfully", projectId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
