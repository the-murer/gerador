"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Folder, File, Eye, GitBranch, ExternalLink } from "lucide-react"

interface RepositoryBrowserProps {
  projectId: string
}

export function RepositoryBrowser({ projectId }: RepositoryBrowserProps) {
  const [repoInfo, setRepoInfo] = useState(null)
  const [files, setFiles] = useState([])
  const [currentPath, setCurrentPath] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileContent, setFileContent] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchRepositoryInfo()
    fetchFiles("")
  }, [projectId])

  const fetchRepositoryInfo = async () => {
    try {
      const response = await fetch("/api/github/repository-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      })

      if (response.ok) {
        const data = await response.json()
        setRepoInfo(data)
      }
    } catch (error) {
      console.error("Failed to fetch repository info:", error)
    }
  }

  const fetchFiles = async (path: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/github/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, path }),
      })

      if (response.ok) {
        const data = await response.json()
        setFiles(Array.isArray(data.files) ? data.files : [data.files])
        setCurrentPath(path)
      }
    } catch (error) {
      console.error("Failed to fetch files:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFileContent = async (filePath: string) => {
    try {
      const response = await fetch("/api/github/file-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId, filePath }),
      })

      if (response.ok) {
        const data = await response.json()
        setFileContent(data.content)
        setSelectedFile(filePath)
      }
    } catch (error) {
      console.error("Failed to fetch file content:", error)
    }
  }

  const handleFileClick = (file: any) => {
    if (file.type === "dir") {
      fetchFiles(file.path)
    } else {
      fetchFileContent(file.path)
    }
  }

  const navigateUp = () => {
    const pathParts = currentPath.split("/").filter(Boolean)
    pathParts.pop()
    const newPath = pathParts.join("/")
    fetchFiles(newPath)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Repository Browser
          </span>
          {repoInfo && (
            <Button variant="outline" size="sm" asChild>
              <a href={repoInfo.repository.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          )}
        </CardTitle>
        {repoInfo && (
          <CardDescription className="flex items-center gap-2">
            <span>{repoInfo.repository.fullName}</span>
            <Badge variant="outline">
              <GitBranch className="h-3 w-3 mr-1" />
              {repoInfo.repository.defaultBranch}
            </Badge>
            {repoInfo.repository.language && <Badge variant="secondary">{repoInfo.repository.language}</Badge>}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            {currentPath && (
              <Button variant="outline" size="sm" onClick={navigateUp}>
                ← Back
              </Button>
            )}
            <span className="text-sm text-muted-foreground">/{currentPath}</span>
          </div>

          {/* File List */}
          <ScrollArea className="h-64 border rounded">
            <div className="p-2 space-y-1">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : files.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No files found</div>
              ) : (
                files.map((file: any) => (
                  <div
                    key={file.path}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer"
                    onClick={() => handleFileClick(file)}
                  >
                    {file.type === "dir" ? (
                      <Folder className="h-4 w-4 text-blue-500" />
                    ) : (
                      <File className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="flex-1 text-sm">{file.name}</span>
                    {file.type === "file" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              fetchFileContent(file.path)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{file.name}</DialogTitle>
                          </DialogHeader>
                          <ScrollArea className="h-96">
                            <pre className="text-sm bg-muted p-4 rounded overflow-x-auto">
                              <code>{fileContent}</code>
                            </pre>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
