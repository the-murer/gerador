'use client'

import { usePathname } from 'next/navigation'
import { 
  getProjectIdFromPath, 
  isValidProjectId, 
  getSessionIdFromPath, 
  isValidSessionId 
} from '@/lib/project-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Example component showing how to extract project ID and session ID from the current path
 * This can be used in any client component that needs to know the current project or session ID
 */
export function ProjectIdExample() {
  const pathname = usePathname()
  const projectId = getProjectIdFromPath(pathname)
  const sessionId = getSessionIdFromPath(pathname)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>ID Extraction</CardTitle>
        <CardDescription>Current path information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Current Path:</p>
          <code className="text-xs bg-muted px-2 py-1 rounded">{pathname}</code>
        </div>
        
        <div>
          <p className="text-sm font-medium">Extracted Project ID:</p>
          {projectId ? (
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">{projectId}</code>
              <Badge variant="secondary" className="text-xs">
                Valid
              </Badge>
            </div>
          ) : (
            <Badge variant="outline" className="text-xs">
              No project ID found
            </Badge>
          )}
        </div>

        <div>
          <p className="text-sm font-medium">Extracted Session ID:</p>
          {sessionId ? (
            <div className="flex items-center gap-2">
              <code className="text-xs bg-muted px-2 py-1 rounded">{sessionId}</code>
              <Badge variant="secondary" className="text-xs">
                Valid
              </Badge>
            </div>
          ) : (
            <Badge variant="outline" className="text-xs">
              No session ID found
            </Badge>
          )}
        </div>

        <div>
          <p className="text-sm font-medium">Validation:</p>
          <div className="flex gap-2">
            {projectId && (
              <Badge variant={isValidProjectId(projectId) ? "default" : "destructive"} className="text-xs">
                Project: {isValidProjectId(projectId) ? "Valid" : "Invalid"}
              </Badge>
            )}
            {sessionId && (
              <Badge variant={isValidSessionId(sessionId) ? "default" : "destructive"} className="text-xs">
                Session: {isValidSessionId(sessionId) ? "Valid" : "Invalid"}
              </Badge>
            )}
            {!projectId && !sessionId && (
              <Badge variant="outline" className="text-xs">
                No IDs to validate
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
