"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { ChatSessionCard } from "./card";
import { useRouter } from "next/navigation";

export interface ChatSession {
  _id: string;
  sessionId: string;
  projectId: string;
  userId: string;
  messages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    modifications?: any[];
    commitInfo?: {
      pullRequestNumber: number;
      pullRequestUrl: string;
      commitSha: string;
    };
  }>;
  status: "active" | "committed" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

interface ChatHistoryProps {
  projectId: string;
}

export function ChatHistory({
  projectId,
}: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchChatHistory();
  }, [projectId]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/chat/${projectId}/history`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data || []);
      }
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const onNewChat = () => {
    router.push(`/chat/${projectId}`);
  };

  const onResumeChat = (session: ChatSession) => {
    router.push(`/chat/${session._id}`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">
            Loading chat history...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Chat History</h3>
        <Button onClick={onNewChat}>
          <MessageSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-lg font-semibold mb-2">No Chat History</h4>
            <p className="text-muted-foreground mb-4">
              Start your first conversation with the AI assistant
            </p>
            <Button onClick={onNewChat}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {sessions.map((session) => (
              <ChatSessionCard
                key={session._id}
                session={session}
                projectId={projectId}
                onResumeChat={onResumeChat}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
