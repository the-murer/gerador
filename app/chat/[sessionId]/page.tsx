import { ChatInterface } from '@/components/chat-interface'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { serializeProject, serializeChatSession } from '@/lib/project-utils'
import React from 'react'

interface ChatSessionPageProps {
  params: {
    sessionId: string
  }
}

export default async function ChatSessionPage({ params }: ChatSessionPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    notFound()
  }

  // Extract sessionId from URL params
  const { sessionId } = await params

  // Validate sessionId format
  if (!ObjectId.isValid(sessionId)) {
    notFound()
  }

  // Fetch session and project data
  const client = await clientPromise
  const chatSessions = client.db().collection('chatSessions')
  const projects = client.db().collection('projects')
  
  // Get the chat session
  const chatSession = await chatSessions.findOne({
    _id: new ObjectId(sessionId)
  })

  if (!chatSession) {
    notFound()
  }

  // Get the project associated with this session
  const project = await projects.findOne({
    _id: new ObjectId(chatSession.projectId),
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
  const serializedSession = serializeChatSession(chatSession)

  return (
    <div className="min-h-screen bg-background">
      <ChatSessionPageContent 
        project={serializedProject} 
        resumedSession={serializedSession}
        sessionId={sessionId}
      />
    </div>
  )
}

// Client component for interactive functionality
function ChatSessionPageContent({ 
  project, 
  resumedSession, 
  sessionId 
}: { 
  project: any
  resumedSession: any
  sessionId: string
}) {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground">{project.githubRepo}</p>
        <p className="text-sm text-muted-foreground">Session: {sessionId}</p>
      </div>
      
      <ChatInterface 
        project={project} 
        resumedSession={resumedSession}
      />
    </div>
  )
}
