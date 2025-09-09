import { ObjectId } from 'mongodb'

/**
 * Serializes a MongoDB project document to a plain object for client components
 * @param project - The MongoDB project document
 * @returns A plain object that can be passed to client components
 */
export function serializeProject(project: any) {
  return {
    _id: project._id.toString(),
    name: project.name,
    githubRepo: project.githubRepo,
    customPrompt: project.customPrompt,
    destinationBranch: project.destinationBranch,
    webhookUrl: project.webhookUrl,
    projectType: project.projectType,
    adminId: project.adminId.toString(),
    allowedUsers: project.allowedUsers,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  }
}

/**
 * Serializes a MongoDB chat session document to a plain object for client components
 * @param session - The MongoDB chat session document
 * @returns A plain object that can be passed to client components
 */
export function serializeChatSession(session: any) {
  return {
    _id: session._id.toString(),
    projectId: session.projectId.toString(),
    isActive: session.isActive,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    messages: session.messages || []
  }
}

/**
 * Extracts project ID from URL path
 * @param pathname - The pathname from usePathname() or window.location.pathname
 * @returns The project ID if found, null otherwise
 */
export function getProjectIdFromPath(pathname: string): string | null {
  // Match patterns like /project/507f1f77bcf86cd799439011
  const match = pathname.match(/^\/project\/([a-f\d]{24})$/i)
  return match ? match[1] : null
}

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The ID string to validate
 * @returns true if valid ObjectId, false otherwise
 */
export function isValidProjectId(id: string): boolean {
  return ObjectId.isValid(id)
}

/**
 * Creates a project URL from project ID
 * @param projectId - The project ID
 * @returns The project URL
 */
export function createProjectUrl(projectId: string): string {
  if (!isValidProjectId(projectId)) {
    throw new Error('Invalid project ID')
  }
  return `/project/${projectId}`
}

/**
 * Extracts session ID from URL path
 * @param pathname - The pathname from usePathname() or window.location.pathname
 * @returns The session ID if found, null otherwise
 */
export function getSessionIdFromPath(pathname: string): string | null {
  // Match patterns like /chat/507f1f77bcf86cd799439011
  const match = pathname.match(/^\/chat\/([a-f\d]{24})$/i)
  return match ? match[1] : null
}

/**
 * Validates if a string is a valid MongoDB ObjectId for sessions
 * @param id - The ID string to validate
 * @returns true if valid ObjectId, false otherwise
 */
export function isValidSessionId(id: string): boolean {
  return ObjectId.isValid(id)
}

/**
 * Creates a chat session URL from session ID
 * @param sessionId - The session ID
 * @returns The chat session URL
 */
export function createChatSessionUrl(sessionId: string): string {
  if (!isValidSessionId(sessionId)) {
    throw new Error('Invalid session ID')
  }
  return `/chat/${sessionId}`
}

/**
 * Hook for client components to get project ID from current path
 * Usage in client components:
 * 
 * ```tsx
 * 'use client'
 * import { usePathname } from 'next/navigation'
 * import { getProjectIdFromPath } from '@/lib/project-utils'
 * 
 * export function MyComponent() {
 *   const pathname = usePathname()
 *   const projectId = getProjectIdFromPath(pathname)
 *   
 *   if (!projectId) {
 *     return <div>No project selected</div>
 *   }
 *   
 *   return <div>Project ID: {projectId}</div>
 * }
 * ```
 */
