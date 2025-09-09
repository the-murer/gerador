"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  _id: string;
  name: string;
  githubRepo: string;
  destinationBranch: string;
  customPrompt: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

export function ProjectSelector() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();
  useEffect(() => {
    fetchUserProjects();
  }, []);

  const fetchUserProjects = async () => {
    try {
      const response = await fetch("/api/user/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const handleProjectSelect = (project: Project) => {
    router.push(`/project/${project._id}`);
  };

  if (projects.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Projects Available</h3>
          <p className="text-muted-foreground">
            You don't have access to any projects yet. Contact your
            administrator to get access to projects.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project: Project) => (
        <Card key={project._id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="truncate">{project.name}</span>
              <Badge variant="secondary">
                <GitBranch className="h-3 w-3 mr-1" />
                {project.destinationBranch}
              </Badge>
            </CardTitle>
            <CardDescription className="truncate">
              {project.githubRepo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {project.customPrompt.length > 100
                  ? `${project.customPrompt.substring(0, 100)}...`
                  : project.customPrompt}
              </p>
              <Button
                onClick={() => handleProjectSelect(project)}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Start Chatting
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
