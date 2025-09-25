import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { GitHubService, parseGitHubRepo } from "@/lib/github"

export interface CodeAnalysisResult {
  message: string
  proposedChanges?: {
    files: Array<{
      path: string
      content: string
      action: "create" | "update" | "delete"
      reasoning: string
      originalSha?: string
    }>
    description: string
    summary: string
  }
}

export class AIAgent {
  private github: GitHubService
  private customPrompt: string
  private projectContext: any

  constructor(githubToken: string, customPrompt: string, projectContext: any) {
    this.github = new GitHubService(githubToken)
    this.customPrompt = customPrompt
    this.projectContext = projectContext
  }

  async analyzeAndModify(userRequest: string, chatHistory: any[] = []): Promise<CodeAnalysisResult> {
    try {
      const { owner, repo } = parseGitHubRepo(this.projectContext.githubRepo)

      const repoStructure = await this.getRepositoryStructure(owner, repo)
      const relevantFiles = await this.intelligentFileDiscovery(owner, repo, userRequest, repoStructure)

      const fileContents = await this.readRelevantFiles(owner, repo, relevantFiles)

      const systemPrompt = this.buildSystemPrompt(repoStructure, fileContents)
      const userPrompt = this.buildUserPrompt(userRequest, chatHistory)

      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 4000,
      })

      return this.parseAIResponse(text, fileContents)
    } catch (error) {
      console.error("AI Agent error:", error)
      return {
        message: `I encountered an error while analyzing your request. Please try rephrasing or ask again later.`,
      }
    }
  }

  private async getRepositoryStructure(owner: string, repo: string): Promise<any[]> {
    try {
      const files = await this.github.getRepositoryFiles(owner, repo, "", this.projectContext.destinationBranch)
      return Array.isArray(files) ? files : [files]
    } catch (error) {
      console.error("Error getting repository structure:", error)
      return []
    }
  }

  private async intelligentFileDiscovery(
    owner: string,
    repo: string,
    userRequest: string,
    repoStructure: any[],
  ): Promise<string[]> {
    const allFiles = this.flattenFileStructure(repoStructure)

    const coreFiles = this.identifyCoreFiles(allFiles)
    const configFiles = this.identifyConfigFiles(allFiles)
    const contextualFiles = this.identifyContextualFiles(allFiles, userRequest)

    const prioritizedFiles = [
      ...coreFiles.slice(0, 5), // Top 5 core files
      ...configFiles.slice(0, 3), // Top 3 config files
      ...contextualFiles.slice(0, 7), // Top 7 contextual files
    ]

    const uniqueFiles = Array.from(new Set(prioritizedFiles.map((f) => f.path)))
    return uniqueFiles.slice(0, 15) // Limit to 15 files to avoid token limits
  }

  private flattenFileStructure(files: any[], basePath = ""): any[] {
    const result = []
    for (const file of files) {
      if (file.type === "file") {
        result.push({
          name: file.name,
          path: file.path,
          type: file.type,
        })
      }
    }
    return result
  }

  private async readRelevantFiles(owner: string, repo: string, filePaths: string[]): Promise<any[]> {
    const fileContents = []
    for (const filePath of filePaths) {
      try {
        const fileData = await this.github.getFileContent(owner, repo, filePath, this.projectContext.destinationBranch)
        fileContents.push({
          path: filePath,
          content: fileData.content,
          sha: fileData.sha,
        })
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error)
      }
    }
    return fileContents
  }

  private buildSystemPrompt(repoStructure: any[], fileContents: any[]): string {
    return `${this.customPrompt}

You are an AI assistant helping to modify code in a GitHub repository. Your task is to analyze user requests and generate specific code modifications.

REPOSITORY CONTEXT:
- Repository: ${this.projectContext.githubRepo}
- Branch: ${this.projectContext.destinationBranch}
- Project: ${this.projectContext.name}

CURRENT FILES IN REPOSITORY:
${fileContents
  .map(
    (file) => `
FILE: ${file.path}
\`\`\`
${file.content.substring(0, 2000)}${file.content.length > 2000 ? "\n... (truncated)" : ""}
\`\`\`
`,
  )
  .join("\n")}

INSTRUCTIONS:
1. Analyze the user's request carefully
2. Understand the existing code structure and patterns
3. Generate specific, working code modifications
4. Ensure changes follow the existing code style and patterns
5. Provide clear reasoning for each change

RESPONSE FORMAT:
Your response should include:
1. A conversational explanation of what you understand and plan to do
2. If code changes are needed, end your response with:

PROPOSED_CHANGES_START
{
  "files": [
    {
      "path": "path/to/file.ext",
      "content": "complete file content after modifications",
      "action": "update|create|delete",
      "reasoning": "explanation of why this change is needed"
    }
  ],
  "description": "Brief description of all changes",
  "summary": "One-line summary of the modification"
}
PROPOSED_CHANGES_END

Your answer goes to the user. Dont be tehcnical, be human.
Only include PROPOSED_CHANGES if you are right about making actual code modifications. If you have any doubt ask back the user. For questions or clarifications, just provide a conversational response.`
  }

  private buildUserPrompt(userRequest: string, chatHistory: any[]): string {
    let prompt = ""

    if (chatHistory.length > 0) {
      prompt += "RECENT CONVERSATION:\n"
      const recentHistory = chatHistory.slice(-5)
      for (const msg of recentHistory) {
        prompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`
      }
      prompt += "\n"
    }

    prompt += `CURRENT REQUEST: ${userRequest}`

    return prompt
  }

  private parseAIResponse(aiResponse: string, fileContents: any[]): CodeAnalysisResult {
    const changesStartIndex = aiResponse.indexOf("PROPOSED_CHANGES_START")
    const changesEndIndex = aiResponse.indexOf("PROPOSED_CHANGES_END")

    let message = aiResponse
    let proposedChanges = undefined

    if (changesStartIndex !== -1 && changesEndIndex !== -1) {
      message = aiResponse.substring(0, changesStartIndex).trim()

      const changesJson = aiResponse.substring(changesStartIndex + 22, changesEndIndex).trim()
      try {
        proposedChanges = JSON.parse(changesJson)

        if (proposedChanges && proposedChanges.files) {
          proposedChanges.files = proposedChanges.files.map((file: any) => {
            const originalFile = fileContents.find((f) => f.path === file.path)
            return {
              ...file,
              originalSha: originalFile?.sha,
            }
          })
        }
      } catch (error) {
        console.error("Error parsing proposed changes:", error)
        message += "\n\nI prepared some changes but encountered an error formatting them. Please try asking again."
      }
    }

    return {
      message: message || "I've analyzed your request and I'm ready to help!",
      proposedChanges,
    }
  }

  private identifyCoreFiles(allFiles: any[]): any[] {
    const corePatterns = [
      /\/(src|app|pages|components|lib|utils)\/.*\.(ts|tsx|js|jsx)$/,
      /\/index\.(ts|tsx|js|jsx)$/,
      /\/main\.(ts|tsx|js|jsx|py|java|cpp|c|cs|go|rs)$/,
      /\/app\.(ts|tsx|js|jsx|py)$/,
      /\/(models|schemas|types)\/.*\.(ts|tsx|js|jsx)$/,
    ]

    return allFiles
      .filter((file) => corePatterns.some((pattern) => pattern.test(file.path)))
      .sort((a, b) => {
        const depthA = a.path.split("/").length
        const depthB = b.path.split("/").length
        return depthA - depthB
      })
  }

  private identifyConfigFiles(allFiles: any[]): any[] {
    const configPatterns = [
      /package\.json$/,
      /tsconfig\.json$/,
      /next\.config\.(js|ts|mjs)$/,
      /tailwind\.config\.(js|ts)$/,
      /vite\.config\.(js|ts)$/,
      /webpack\.config\.(js|ts)$/,
      /\.env(\..*)?$/,
      /README\.md$/,
      /docker-compose\.ya?ml$/,
      /Dockerfile$/,
    ]

    return allFiles.filter((file) => configPatterns.some((pattern) => pattern.test(file.path)))
  }

  private identifyContextualFiles(allFiles: any[], userRequest: string): any[] {
    const requestLower = userRequest.toLowerCase()
    const keywords = this.extractKeywords(requestLower)

    return allFiles
      .filter((file) => {
        const filePath = file.path.toLowerCase()
        const fileName = file.name.toLowerCase()

        // Check if file path or name contains relevant keywords
        return keywords.some(
          (keyword) =>
            filePath.includes(keyword) ||
            fileName.includes(keyword) ||
            this.isRelevantFileType(file.path, requestLower),
        )
      })
      .sort((a, b) => {
        // Sort by relevance score
        const scoreA = this.calculateRelevanceScore(a, keywords, requestLower)
        const scoreB = this.calculateRelevanceScore(b, keywords, requestLower)
        return scoreB - scoreA
      })
  }

  private extractKeywords(request: string): string[] {
    // Common programming and web development keywords
    const techKeywords = [
      "auth",
      "login",
      "signup",
      "user",
      "admin",
      "dashboard",
      "api",
      "route",
      "component",
      "page",
      "form",
      "button",
      "modal",
      "navbar",
      "sidebar",
      "database",
      "model",
      "schema",
      "migration",
      "seed",
      "query",
      "style",
      "css",
      "theme",
      "color",
      "layout",
      "responsive",
      "test",
      "spec",
      "mock",
      "fixture",
      "util",
      "helper",
      "service",
      "config",
      "env",
      "setting",
      "constant",
      "type",
      "interface",
    ]

    const words = request.split(/\s+/).map((w) => w.replace(/[^\w]/g, ""))
    return words.filter((word) => word.length > 2 && (techKeywords.includes(word) || /^[a-z]+$/i.test(word)))
  }

  private isRelevantFileType(filePath: string, request: string): boolean {
    const fileExt = filePath.split(".").pop()?.toLowerCase()

    // Map request context to relevant file types
    if (request.includes("style") || request.includes("css") || request.includes("design")) {
      return ["css", "scss", "sass", "less", "styl"].includes(fileExt || "")
    }

    if (request.includes("test") || request.includes("spec")) {
      return filePath.includes("test") || filePath.includes("spec") || fileExt === "test"
    }

    if (request.includes("config") || request.includes("setting")) {
      return ["json", "yaml", "yml", "toml", "ini", "env"].includes(fileExt || "")
    }

    return ["ts", "tsx", "js", "jsx", "py", "java", "cpp", "c", "cs", "go", "rs"].includes(fileExt || "")
  }

  private calculateRelevanceScore(file: any, keywords: string[], request: string): number {
    let score = 0
    const filePath = file.path.toLowerCase()
    const fileName = file.name.toLowerCase()

    // Keyword matches in path/name
    keywords.forEach((keyword) => {
      if (fileName.includes(keyword)) score += 3
      if (filePath.includes(keyword)) score += 2
    })

    // File type relevance
    if (this.isRelevantFileType(file.path, request)) score += 1

    // Prefer files in important directories
    if (filePath.includes("/src/") || filePath.includes("/app/")) score += 2
    if (filePath.includes("/components/")) score += 1
    if (filePath.includes("/pages/") || filePath.includes("/routes/")) score += 1

    return score
  }
}
