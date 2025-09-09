import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  Clock,
  GitCommit,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ChatSession } from ".";

const getSessionSummary = (session: ChatSession) => {
  const userMessages = session.messages.filter((m) => m.role === "user");
  if (userMessages.length === 0) return "New conversation";

  const firstMessage = userMessages[0].content;
  return firstMessage.length > 60
    ? `${firstMessage.substring(0, 60)}...`
    : firstMessage;
};

const getStatusBadge = (session: ChatSession) => {
  switch (session.status) {
    case "committed":
      return (
        <Badge variant="default" className="bg-green-500">
          <GitCommit className="h-3 w-3 mr-1" />
          Committed
        </Badge>
      );
    case "active":
      return (
        <Badge variant="secondary">
          <MessageSquare className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    case "closed":
      return <Badge variant="outline">Closed</Badge>;
    default:
      return null;
  }
};

export const ChatSessionCard = ({
  session,
  projectId,
  onResumeChat,
}: {
  session: ChatSession;
  projectId: string;
  onResumeChat: (session: ChatSession) => void;
}) => {
  const deleteSession = async (sessionId: string) => {
    try {
      const response = await fetch(
        `/api/chat/${projectId}/sessions/${sessionId}`,
        {
          method: "DELETE",
        }
      );
      //   if (response.ok) {
      //     onResumeChat(session)
      //   }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  return (
    <Card key={session._id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-sm font-medium line-clamp-1">
              {getSessionSummary(session)}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(session.createdAt), {
                addSuffix: true,
              })}
              <span>•</span>
              {session.messages.filter((m) => m.role === "user").length}{" "}
              messages
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(session)}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteSession(session.sessionId)}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {session.messages.some((m) => m.commitInfo) && (
              <>
                <GitCommit className="h-3 w-3" />
                <span>Changes committed</span>
                {session.messages.find((m) => m.commitInfo)?.commitInfo
                  ?.pullRequestUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() =>
                      window.open(
                        session.messages.find((m) => m.commitInfo)?.commitInfo
                          ?.pullRequestUrl,
                        "_blank"
                      )
                    }
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View PR
                  </Button>
                )}
              </>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onResumeChat(session)}
            disabled={session.status === "committed"}
          >
            {session.status === "committed" ? "View" : "Resume"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
