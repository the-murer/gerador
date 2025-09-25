import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GitHubService, parseGitHubRepo } from "@/lib/github";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, messageId, sessionId } = await request.json();

    if (!messageId && !sessionId) {
      return NextResponse.json(
        { error: "Invalid message ID or session" },
        { status: 400 }
      );
    }

    const client = await clientPromise;

    const projects = client.db().collection("projects");
    const chatSessions = client.db().collection("chatSessions");

    const chatSession = await chatSessions.findOne({
      _id: new ObjectId(sessionId),
      projectId: new ObjectId(projectId),
    });

    const project = await projects.findOne({
      _id: new ObjectId(projectId),
      allowedUsers: { $in: [session.user.id] },
    });

    const message = chatSession?.messages.find((m: any) => m.id === messageId);

    if (!project || !chatSession) {
      return NextResponse.json(
        { error: "Project or chat session not found or access denied" },
        { status: 404 }
      );
    }

    if (
      !message ||
      !message.proposedChanges ||
      message.proposedChanges.files.length === 0
    ) {
      return NextResponse.json(
        { error: "No proposed changes provided" },
        { status: 400 }
      );
    }

    const { owner, repo } = parseGitHubRepo(project.githubRepo);

    const githubToken = process.env.GITHUB_TOKEN;

    const github = new GitHubService(githubToken!);

    const branchName = `ai-modification-${messageId.slice(0, 8)}`;

    try {
      await github.createBranch(
        owner,
        repo,
        branchName,
        project.destinationBranch
      );

      const commitResults = [];
      for (const fileChange of message.proposedChanges.files) {
        const { path, content, action = "update" } = fileChange;

        let sha = undefined;
        if (action === "update") {
          // Get current file SHA for updates
          try {
            const currentFile = await github.getFileContent(
              owner,
              repo,
              path,
              branchName
            );
            sha = currentFile.sha;
          } catch (error) {
            // File doesn't exist, will be created
          }
        }

        const commitMessage = messageId
          ? `AI modification (${messageId.slice(0, 8)}): ${action} ${path}`
          : `AI modification: ${action} ${path}`;
        const result = await github.createOrUpdateFile(
          owner,
          repo,
          path,
          content,
          commitMessage,
          branchName,
          sha
        );
        commitResults.push(result);
      }

      // Create pull request
      const prTitle = `Modificações requeisitadas por ${session.user.name}`;
      const prBody = `
## Modificações geradas pelo AI

Esta PR contém modificações geradas pelo AI.

Detalhes das modificações: ${message.summary}



**Solicitado por:** ${session.user.name} (${session.user.email})
**Data:** ${new Date().toISOString()}
${messageId ? `**Message ID:** ${messageId}` : ""}
${sessionId ? `**Session ID:** ${sessionId}` : ""}

Revise as modificações antes de mesclar.
      `;

      const pullRequest = await github.createPullRequest(
        owner,
        repo,
        prTitle,
        branchName,
        project.destinationBranch,
        prBody
      );

      const activities = client.db().collection("activities");
      await activities.insertOne({
        projectId: new ObjectId(projectId),
        userId: new ObjectId(session.user.id),
        type: "commit",
        branch: branchName,
        pullRequestUrl: pullRequest.html_url,
        pullRequestNumber: pullRequest.number,
        changes: message.proposedChanges.files,
        messageId: messageId,
        sessionId: new ObjectId(sessionId),
        netlifyStatus: "pending",
        timestamp: new Date(),
      });

      await chatSessions.updateOne(
        {
          _id: new ObjectId(sessionId),
          projectId: new ObjectId(projectId),
        },
        {
          $set: {
            isActive: false,
            completedAt: new Date(),
            commitBranch: branchName,
            pullRequestUrl: pullRequest.html_url,
            pullRequestNumber: pullRequest.number,
            netlifyStatus: "pending",
          },
        }
      );

      return NextResponse.json({
        success: true,
        branch: branchName,
        pullRequest: {
          url: pullRequest.html_url,
          number: pullRequest.number,
        },
        commits: commitResults.length,
        messageId: messageId,
        sessionId: new ObjectId(sessionId),
      });
    } catch (error) {
      console.error("Commit error:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Failed to commit proposed changes",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("GitHub commit error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process commit proposed changes",
      },
      { status: 500 }
    );
  }
}
