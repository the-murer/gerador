"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/database/models/project";

export const ProjectHeader = ({ project }: { project: Project }) => {
  const router = useRouter();

  const handleNewChat = () => {
    router.push(`/project/${project._id}/chat`);
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{project.name}</h1>
        </div>
      </div>
      <div>
        <Button onClick={handleNewChat}>
          <MessageSquare className="h-4 w-4 mr-2" />
          Nova Conversa
        </Button>
      </div>
    </div>
  );
};
