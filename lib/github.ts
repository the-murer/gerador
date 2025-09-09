import { Octokit } from "@octokit/rest"

export class GitHubService {
  private octokit: Octokit

  constructor(token: string) {
    this.octokit = new Octokit({
      auth: token,
    })
  }

  async getRepositoryFiles(owner: string, repo: string, path = "", ref?: string) {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref,
      })

      const allFiles = []

      await Promise.all(response.data.map(async (file: any) => {
        if (file.type === "dir") {
          const files = await this.getRepositoryFiles(owner, repo, file.path, ref)
          await files.map(async (file: any) => {
            await allFiles.push(file)
          })
        }
        await allFiles.push(file)
      }))

      return allFiles.filter((file: any) => file.type === "file")
    } catch (error) {
      console.error("Error fetching repository files:", error)
      throw new Error(`Failed to fetch repository files: ${error.message}`)
    }
  }

  async getFileContent(owner: string, repo: string, path: string, ref?: string) {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref,
      })

      if (Array.isArray(response.data)) {
        throw new Error("Path is a directory, not a file")
      }

      if (response.data.type !== "file") {
        throw new Error("Path is not a file")
      }

      // Decode base64 content
      const content = Buffer.from(response.data.content, "base64").toString("utf-8")
      return {
        content,
        sha: response.data.sha,
        path: response.data.path,
      }
    } catch (error) {
      console.error("Error fetching file content:", error)
      throw new Error(`Failed to fetch file content: ${error.message}`)
    }
  }

  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string,
    sha?: string,
  ) {
    try {
      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        branch,
        sha, // Required for updates, omit for new files
      })

      return response.data
    } catch (error) {
      console.error("Error creating/updating file:", error)
      throw new Error(`Failed to create/update file: ${error.message}`)
    }
  }

  async createBranch(owner: string, repo: string, newBranch: string, fromBranch = "main") {
    try {
      // Get the SHA of the source branch
      const refResponse = await this.octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${fromBranch}`,
      })

      const sha = refResponse.data.object.sha

      // Create new branch
      const response = await this.octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha,
      })

      return response.data
    } catch (error) {
      if (error.status === 422) {
        // Branch already exists
        return null
      }
      console.error("Error creating branch:", error)
      throw new Error(`Failed to create branch: ${error.message}`)
    }
  }

  async getBranches(owner: string, repo: string) {
    try {
      const response = await this.octokit.rest.repos.listBranches({
        owner,
        repo,
      })

      return response.data
    } catch (error) {
      console.error("Error fetching branches:", error)
      throw new Error(`Failed to fetch branches: ${error.message}`)
    }
  }

  async getRepositoryInfo(owner: string, repo: string) {
    try {
      const response = await this.octokit.rest.repos.get({
        owner,
        repo,
      })

      return response.data
    } catch (error) {
      console.error("Error fetching repository info:", error)
      throw new Error(`Failed to fetch repository info: ${error.message}`)
    }
  }

  async createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body?: string) {
    try {
      const response = await this.octokit.rest.pulls.create({
        owner,
        repo,
        title,
        head,
        base,
        body,
      })

      return response.data
    } catch (error) {
      console.error("Error creating pull request:", error)
      throw new Error(`Failed to create pull request: ${error.message}`)
    }
  }

  async getPullRequestComments(owner: string, repo: string, pullNumber: number) {
    try {
      const response = await this.octokit.rest.issues.listComments({
        owner,
        repo,
        issue_number: pullNumber,
      })

      return response.data
    } catch (error) {
      console.error("Error fetching pull request comments:", error)
      throw new Error(`Failed to fetch pull request comments: ${error.message}`)
    }
  }
}

export function parseGitHubRepo(repoUrl: string): { owner: string; repo: string } {
  // Handle different GitHub URL formats
  const patterns = [/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/.*)?$/, /^([^/]+)\/([^/]+)$/]

  for (const pattern of patterns) {
    const match = repoUrl.match(pattern)
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      }
    }
  }

  throw new Error("Invalid GitHub repository format")
}
