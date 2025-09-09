import React from 'react'
import { ChatHistory } from '@/components/chat-history'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { serializeProject } from '@/lib/project-utils'

interface ProjectPageProps {
  params: {
    projectId: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    notFound()
  }

  // Extract projectId from URL params
  const { projectId } = await params

  // Validate projectId format
  if (!ObjectId.isValid(projectId)) {
    notFound()
  }

  // Fetch project data
  const client = await clientPromise
  const projects = client.db().collection('projects')
  
  const project = await projects.findOne({
    _id: new ObjectId(projectId),
    $or: [
      { allowedUsers: { $in: [(session as any).user.id] } },
      { adminId: new ObjectId((session as any).user.id) }
    ]
  })

  if (!project) {
    notFound()
  }

  // Serialize MongoDB objects to plain objects for client components
  const serializedProject = serializeProject(project)

  return (
    <div className="min-h-screen bg-background">
      <ProjectPageContent projectId={projectId} project={serializedProject} />
    </div>
  )
}

// Client component for interactive functionality
function ProjectPageContent({ projectId, project }: { projectId: string; project: any }) {

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.githubRepo}</p>
      </div>
      
      <ChatHistory 
        projectId={projectId} 
      />
    </div>
  )
}
