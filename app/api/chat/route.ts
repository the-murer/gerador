import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "bson"
import { AIAgent } from "@/lib/ai-agent"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, message, chatHistory, sessionId, messageId } = await request.json()

    // Verify user has access to this project
    const client = await clientPromise
    const projects = client.db().collection("projects")
    const chatSessions = client.db().collection("chatSessions")
    
    const chatSession = await chatSessions.findOne({
      _id: new ObjectId(sessionId),
      projectId: new ObjectId(projectId),
    })

    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
    }

    const project = await projects.findOne({
      _id: new ObjectId(projectId),
      allowedUsers: { $in: [session.user.id] },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    // Check if GitHub token is configured
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 })
    }


    await chatSessions.updateOne(
      {
        _id: new ObjectId(chatSession._id),
        projectId: new ObjectId(projectId),
      },
      {
        $push: {
          messages: {
            id: messageId,
            role: "user",
            content: message,
            timestamp: new Date(),
          },
        },
        $setOnInsert: {
          sessionId: chatSession._id,
          projectId: new ObjectId(projectId),
          userId: new ObjectId(session.user.id),
          createdAt: new Date(),
          isActive: true,
        },
        $set: {
          updatedAt: new Date(),
          lastActivity: new Date(),
        },
      },
      { upsert: true },
    )

    const aiAgent = new AIAgent(githubToken, project.customPrompt, project)

    const aiResponse = await aiAgent.analyzeAndModify(message, chatHistory)

    const responseMessageId = `${messageId}-response`

    await chatSessions.updateOne(
      {
        _id: new ObjectId(chatSession._id),
        projectId: new ObjectId(projectId),
      },
      {
        $push: {
          messages: {
            id: responseMessageId,
            role: "assistant",
            content: aiResponse.message,
            timestamp: new Date(),
            proposedChanges: aiResponse.proposedChanges,
            originalMessageId: messageId,
          },
        },
        $set: {
          updatedAt: new Date(),
          lastActivity: new Date(),
        },
      },
    )

    return NextResponse.json({
      ...aiResponse,
      messageId: responseMessageId,
      sessionId: chatSession._id.toString(),
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
