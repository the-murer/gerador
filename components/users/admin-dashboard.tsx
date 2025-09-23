"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectForm } from "@/components/projects/project-form";
import { ProjectList } from "@/components/projects/project-list";
import { UserManagement } from "@/components/users/user-management";
import { Settings, Users, FolderGit2 } from "lucide-react";
import { useFindAllProjects } from "@/hooks/projects/use-find-all-projects";
import { Loading } from "../common/loading";
import { NotFound } from "../common/not-found";
import { useFindUsers } from "@/hooks/users/use-find-users";

export function AdminDashboard() {
  const { data: projects, isLoading: loadingProjects } = useFindAllProjects();

  const {
    data: users,
    isLoading: loadingUsers,
    refetch: fetchUsers,
  } = useFindUsers();

  if (loadingProjects || loadingUsers) return <Loading />;

  if (!projects || !users) return <NotFound />;

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
            <TabsTrigger
              value="new-project"
              className="flex items-center gap-2"
            >
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
                <CardDescription>
                  Manage your configured GitHub repositories and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectList projects={projects} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new-project">
            <Card>
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>
                  Configure a new GitHub repository for AI-powered modifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts and project permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement
                  users={users}
                  projects={projects}
                  onUserUpdate={fetchUsers}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
