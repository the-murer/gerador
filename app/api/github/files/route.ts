import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { GitHubService, parseGitHubRepo } from "@/lib/github"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, path = "" } = await request.json()

    // Get project details
    const client = await clientPromise
    const projects = client.db().collection("projects")
    const project = await projects.findOne({
      _id: new ObjectId(projectId),
      allowedUsers: { $in: [session.user.id] },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    // Parse GitHub repository
    const { owner, repo } = parseGitHubRepo(project.githubRepo)

    // Initialize GitHub service
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 })
    }

    const github = new GitHubService(githubToken)

    // Get repository files
    const files = await github.getRepositoryFiles(owner, repo, path, project.destinationBranch)

    return NextResponse.json({ files })
  } catch (error) {
    console.error("GitHub files error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch files" }, { status: 500 })
  }
}
