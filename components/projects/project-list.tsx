"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Users, GitBranch } from "lucide-react"
import { Project } from "@/lib/database/models/project"

interface ProjectListProps {
  projects: Project[]
  onProjectUpdate: () => void
}

export function ProjectList({ projects, onProjectUpdate }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState("")

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  const handleAddUser = async (projectId: string) => {
    if (!selectedUserId) return

    try {
      const response = await fetch(`/api/projects/${projectId}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: selectedUserId }),
      })

      if (response.ok) {
        onProjectUpdate()
        setSelectedUserId("")
      }
    } catch (error) {
      console.error("Failed to add user:", error)
    }
  }

  const handleRemoveUser = async (projectId: string, userId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onProjectUpdate()
      }
    } catch (error) {
      console.error("Failed to remove user:", error)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onProjectUpdate()
      }
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No projects configured yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Create your first project to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project._id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {project.name}
                  <Badge variant="secondary">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {project.destinationBranch}
                  </Badge>
                </CardTitle>
                <CardDescription>{project.githubRepo}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedProject(project)
                        fetchUsers()
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Manage Project Users</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Select a user to add" />
                          </SelectTrigger>
                          <SelectContent>
                            {users
                              .filter((user: any) => !project.allowedUsers.includes(user._id))
                              .map((user: any) => (
                                <SelectItem key={user._id} value={user._id}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={() => handleAddUser(project._id)} disabled={!selectedUserId}>
                          Add User
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Current Users</Label>
                        {project.allowedUsers.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No users assigned to this project.</p>
                        ) : (
                          <div className="space-y-2">
                            {project.allowedUsers.map((userId) => {
                              const user: any = users.find((u: any) => u._id === userId)
                              return (
                                <div key={userId} className="flex items-center justify-between p-2 border rounded">
                                  <span>{user?.name || "Unknown User"}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveUser(project._id, userId)}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Custom Prompt:</strong> {project.customPrompt.substring(0, 100)}...
              </p>
              {project.webhookUrl && (
                <p className="text-sm">
                  <strong>Webhook:</strong> {project.webhookUrl}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
