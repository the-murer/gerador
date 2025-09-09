"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectForm } from "@/components/project-form"
import { ProjectList } from "@/components/project-list"
import { UserManagement } from "@/components/user-management"
import { LogOut, Settings, Users, FolderGit2 } from "lucide-react"
import { signOut } from "next-auth/react"

export function AdminDashboard() {
  const { data: session } = useSession()
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchProjects()
    fetchUsers()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }

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

  return (
    <div className="flex flex-col min-h-screen">


      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="new-project" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              New Project
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>GitHub Projects</CardTitle>
                <CardDescription>Manage your configured GitHub repositories and their settings</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectList projects={projects} onProjectUpdate={fetchProjects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new-project">
            <Card>
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>Configure a new GitHub repository for AI-powered modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectForm onProjectCreated={fetchProjects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and project permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement users={users} projects={projects} onUserUpdate={fetchUsers} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
