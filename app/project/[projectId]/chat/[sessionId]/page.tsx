"use client";

import { ChatInterface } from "@/components/chat-interface";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFindProjectById } from "@/hooks/projects/use-find-project-by-id";
import { useParams } from "next/navigation";
import { NotFound } from "@/components/common/not-found";
import { Loading } from "@/components/common/loading";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const projectId = params.projectId as string;
  const sessionId = params.sessionId as string;

  const { data: project, isLoading } = useFindProjectById(projectId);

  if (isLoading) return <Loading />;
  if (!project) return <NotFound />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex-col">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">{project.githubRepo}</p>
        </div>
      </div>

      <ChatInterface project={project} resumedSession={sessionId} />
    </div>
  );
}
