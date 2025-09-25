import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { GitHubService, parseGitHubRepo } from "@/lib/github";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getNetlifyPreviewUrl } from "@/lib/netlify";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, pullRequestNumber, messageId, sessionId } =
      await request.json();

    const client = await clientPromise;
    const projects = client.db().collection("projects");
    const project = await projects.findOne({
      _id: new ObjectId(projectId),
      allowedUsers: { $in: [(session as any).user.id] },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const { owner, repo } = parseGitHubRepo(project.githubRepo);
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token not configured" },
        { status: 500 }
      );
    }

    const github = new GitHubService(githubToken);

    try {
      const comments = await github.getPullRequestComments(
        owner,
        repo,
        pullRequestNumber
      );

      const netlifyComment = comments.find((comment) => {
        const body = comment.body?.toLowerCase() || "";
        const userLogin = comment.user?.login?.toLowerCase() || "";

        return (
          userLogin.includes("netlify") ||
          userLogin.includes("netlify-bot") ||
          body.includes("deploy preview") ||
          body.includes("deploy preview ready") ||
          body.includes("netlify.app") ||
          body.includes("deploy-preview") ||
          body.includes("preview for") ||
          (body.includes("✅") && body.includes("deploy"))
        );
      });

      if (netlifyComment) {
        const previewUrl = getNetlifyPreviewUrl(netlifyComment.body || "");

        const activities = client.db().collection("activities");
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
          }
        );

        const chatSessions = client.db().collection("chatSessions");
        await chatSessions.updateOne(
          {
            _id: new ObjectId(sessionId),
            projectId: new ObjectId(projectId),
          },
          {
            $set: {
              netlifyStatus: "deployed",
              netlifyPreviewUrl: previewUrl,
              netlifyUpdatedAt: new Date(),
            },
          }
        );

        return NextResponse.json({
          success: true,
          status: "deployed",
          previewUrl: previewUrl,
          comment: netlifyComment.body || "",
          updatedAt: netlifyComment.updated_at,
        });
      } else {
        return NextResponse.json({
          success: true,
          status: "pending",
          message: "Netlify deployment still in progress",
        });
      }
    } catch (error) {
      console.error("Error checking Netlify status:", error);
      return NextResponse.json(
        { error: "Failed to check Netlify status" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Netlify status check error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to check status";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
