"use client";

import { ChatInterface } from "@/components/chat-interface";
import React from "react";
import { useFindProjectById } from "@/hooks/projects/use-find-project-by-id";
import { useParams } from "next/navigation";
import { NotFound } from "@/components/common/not-found";
import { Loading } from "@/components/common/loading";
import { ProjectHeader } from "@/components/projects/project-header";

export default function Page() {
  const params = useParams();

  const projectId = params.projectId as string;

  const { data: project, isLoading } = useFindProjectById(projectId);

  if (isLoading) return <Loading />;
  if (!project) return <NotFound />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <ProjectHeader project={project} />

      <ChatInterface project={project} />
    </div>
  );
}
