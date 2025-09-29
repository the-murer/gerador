"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Users, GitBranch } from "lucide-react";
import { Project } from "@/lib/database/models/project";
import { useFindUsers } from "@/hooks/users/use-find-users";
import { useAddUserProject } from "@/hooks/users/use-add-user-project";
import { useRemoveUserProject } from "@/hooks/users/use-remove-user-project";
import { useDeleteProject } from "@/hooks/projects/use-delete-project";
import { EmptyState } from "../common/empty-state";
import { ManageUsersProject } from "./manage-users-project";
import { ProjectToneAndVoice } from "./project-tone-and-voice";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const { mutateAsync: deleteProject } = useDeleteProject();

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    await deleteProject(projectId).catch((error) => {
      console.error("Failed to delete project:", error);
    });
  };

  if (projects.length === 0) {
    return <EmptyState />;
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
                <ManageUsersProject project={project} />
                <ProjectToneAndVoice project={project} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProject(project._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Criação: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
