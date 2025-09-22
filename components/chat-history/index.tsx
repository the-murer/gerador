"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";
import { ChatSessionCard } from "./card";
import { useRouter } from "next/navigation";
import { useFindChatHistory } from "@/hooks/chat/use-chat-history";
import { ChatSession } from "@/types/chat-session";
import { Loading } from "../common/loading";
import { NotFound } from "../common/not-found";

interface ChatHistoryProps {
  projectId: string;
}

export function ChatHistory({ projectId }: ChatHistoryProps) {
  const { data: sessions, isLoading: loading } = useFindChatHistory(projectId);
  const router = useRouter();

  const onNewChat = () => {
    router.push(`/project/${projectId}/chat`);
  };

  const onResumeChat = (session: ChatSession) => {
    router.push(`/project/${projectId}/chat/${session._id}`);
  };

  if (loading) return <Loading />;

  if (!sessions) return <NotFound />;

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
