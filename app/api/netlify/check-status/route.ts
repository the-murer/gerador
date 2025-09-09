import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
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

    const { projectId, pullRequestNumber, messageId, sessionId } = await request.json()

    const client = await clientPromise
    const projects = client.db().collection("projects")
    const project = await projects.findOne({
      _id: new ObjectId(projectId),
      allowedUsers: { $in: [(session as any).user.id] },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found or access denied" }, { status: 404 })
    }

    const { owner, repo } = parseGitHubRepo(project.githubRepo)
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      return NextResponse.json({ error: "GitHub token not configured" }, { status: 500 })
    }

    const github = new GitHubService(githubToken)

    try {
      // Get PR comments to find Netlify bot
      const comments = await github.getPullRequestComments(owner, repo, pullRequestNumber)

      // Look for Netlify bot comment with improved detection
      const netlifyComment = comments.find(
        (comment) => {
          const body = comment.body?.toLowerCase() || ""
          const userLogin = comment.user?.login?.toLowerCase() || ""
          
          return (
            userLogin.includes("netlify") ||
            userLogin.includes("netlify-bot") ||
            body.includes("deploy preview") ||
            body.includes("deploy preview ready") ||
            body.includes("netlify.app") ||
            body.includes("deploy-preview") ||
            body.includes("preview for") ||
            (body.includes("✅") && body.includes("deploy"))
          )
        }
      )

      if (netlifyComment) {
        // Extract preview URL from comment with multiple fallback methods
        let previewUrl = null
        
        // Method 1: Look for markdown links [text](url) format
        const markdownLinkMatch = netlifyComment.body?.match(/\[([^\]]*\.netlify\.app[^\]]*)\]\(([^)]*\.netlify\.app[^)]*)\)/i)
        if (markdownLinkMatch) {
          previewUrl = markdownLinkMatch[2] // Use the URL part of the markdown link
        }
        
        // Method 2: Look for direct netlify.app URLs
        if (!previewUrl) {
          const directUrlMatch = netlifyComment.body?.match(/https:\/\/[^\s\)]+\.netlify\.app[^\s\)]*/i)
          if (directUrlMatch) {
            previewUrl = directUrlMatch[0]
          }
        }
        
        // Method 3: Look for deploy-preview URLs specifically
        if (!previewUrl) {
          const deployPreviewMatch = netlifyComment.body?.match(/https:\/\/deploy-preview-\d+--[^\s\)]+\.netlify\.app[^\s\)]*/i)
          if (deployPreviewMatch) {
            previewUrl = deployPreviewMatch[0]
          }
        }
        
        // Method 4: Look for any URL containing "deploy-preview" and "netlify.app"
        if (!previewUrl) {
          const generalPreviewMatch = netlifyComment.body?.match(/https:\/\/[^\s\)]*deploy-preview[^\s\)]*\.netlify\.app[^\s\)]*/i)
          if (generalPreviewMatch) {
            previewUrl = generalPreviewMatch[0]
          }
        }

        // Update database with Netlify status
        const activities = client.db().collection("activities")
        await activities.updateOne(
          {
            projectId: new ObjectId(projectId),
            pullRequestNumber: pullRequestNumber,
            messageId: messageId,
          },
          {
            $set: {
              netlifyStatus: "deployed",
              netlifyPreviewUrl: previewUrl,
              netlifyComment: netlifyComment.body || "",
              netlifyUpdatedAt: new Date(),
            },
          },
        )

        if (sessionId) {
          const chatSessions = client.db().collection("chatSessions")
          await chatSessions.updateOne(
            {
              sessionId: sessionId,
              projectId: new ObjectId(projectId),
            },
            {
              $set: {
                netlifyStatus: "deployed",
                netlifyPreviewUrl: previewUrl,
                netlifyUpdatedAt: new Date(),
              },
            },
          )
        }

        return NextResponse.json({
          success: true,
          status: "deployed",
          previewUrl: previewUrl,
          comment: netlifyComment.body || "",
          updatedAt: netlifyComment.updated_at,
        })
      } else {
        return NextResponse.json({
          success: true,
          status: "pending",
          message: "Netlify deployment still in progress",
        })
      }
    } catch (error) {
      console.error("Error checking Netlify status:", error)
      return NextResponse.json({ error: "Failed to check Netlify status" }, { status: 500 })
    }
  } catch (error) {
    console.error("Netlify status check error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to check status"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
