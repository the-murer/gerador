import React from "react";
import { ChatHistory } from "@/components/chat-history";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { serializeProject } from "@/lib/project-utils";
import { ProjectHeader } from "@/components/projects/project-header";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const { projectId } = await params;

  if (!ObjectId.isValid(projectId)) {
    notFound();
  }

  const client = await clientPromise;
  const projects = client.db().collection("projects");

  const project = await projects.findOne({
    _id: new ObjectId(projectId),
    $or: [
      { allowedUsers: { $in: [(session as any).user.id] } },
      { adminId: new ObjectId((session as any).user.id) },
    ],
  });

  if (!project) {
    notFound();
  }

  const serializedProject = serializeProject(project);

  return (
    <div className="min-h-screen bg-background">
      <ProjectPageContent projectId={projectId} project={serializedProject} />
    </div>
  );
}

function ProjectPageContent({
  projectId,
  project,
}: {
  projectId: string;
  project: any;
}) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <ProjectHeader project={project} />

      <ChatHistory projectId={projectId} />
    </div>
  );
}
