import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { RotateCcw, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Project, ChatSession } from "./index";

interface ChatSessionHeaderProps {
  handleNewChat: () => void;
  setChatClosed: (closed: boolean) => void;
  chatSession: ChatSession | null;
  setChatSession: (session: ChatSession) => void;
  project: Project;
}


export const ChatSessionHeader = ({
  handleNewChat,
  setChatClosed,
  chatSession,
  setChatSession,
  project,
}: ChatSessionHeaderProps) => {


  const handleCloseChat = () => {
    setChatClosed(true);
    if (chatSession) {
      setChatSession({ ...chatSession, isActive: false });
    }
  };
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Project Information</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleNewChat}>
              <RotateCcw className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button variant="outline" size="sm" onClick={handleCloseChat}>
              <X className="h-4 w-4 mr-2" />
              Close Chat
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Repository: {project.githubRepo}</Badge>
          <Badge variant="outline">Branch: {project.destinationBranch}</Badge>
          {chatSession && (
            <Badge variant="secondary">
              Session: {chatSession?.id.slice(0, 8)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
