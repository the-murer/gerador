"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NetlifyStatus } from "@/components/git/netlify-status";
import { Send, Bot, Loader2 } from "lucide-react";
import { Message } from "./message";
import { PullRequestConfirm } from "../git/pull-request-confirm";
import { ChatSessionHeader } from "./chat-session-header";
import { Message as MessageType } from "@/types/message";
import { Project } from "@/types/project";
import { useSendMessage } from "@/hooks/messages/use-send-message";
import { randomUUID, useFindSessionById } from "@/hooks/chat/use-chat-session";
import { ObjectId } from "bson";
interface ChatInterfaceProps {
  project: Project;
  resumedSession?: string;
}

export function ChatInterface({ project, resumedSession }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);
  const [commitLoading, setCommitLoading] = useState(false);

  const [showNetlifyStatus, setShowNetlifyStatus] = useState(false);
  const [pullRequestNumber, setPullRequestNumber] = useState<number | null>(
    null
  );
  const [commitMessageId, setCommitMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: sendMessage, isPending: pendingMessage } =
    useSendMessage();

  const { data: session, error: sessionError } = useFindSessionById({
    sessionId: resumedSession,
    projectId: project._id,
  });

  const sessionId = resumedSession || new ObjectId().toString();
  const chatClosed = session ? !session?.isActive : false;

  useEffect(() => {
    if (session?._id) {
      setMessages(session.messages);
      setPullRequestNumber(session.pullRequestNumber);
      setCommitMessageId(session.commitBranch);
      setShowNetlifyStatus(!!session.commitBranch);
    }
  }, [session?._id]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message: MessageType) => {
    setMessages([...messages, message]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || pendingMessage || !sessionId) return;

    const messageId = randomUUID();
    addMessage({
      id: new ObjectId().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    });
    const currentInput = input;

    setInput("");

    try {
      const data = await sendMessage({
        projectId: project._id,
        message: currentInput,
        chatHistory: messages,
        sessionId,
        messageId,
      });
      console.log("🚀 ~ handleSendMessage ~ data => ", data);
      addMessage({
        id: new ObjectId().toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      });

      if (data.proposedChanges) {
        setPendingChanges(data.proposedChanges);
        setPendingMessageId(data.messageId || messageId);
        setShowConfirmDialog(true);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleNewChat = () => {
    setPendingChanges(null);
    setPendingMessageId(null);
    setShowConfirmDialog(false);
    setShowNetlifyStatus(false);
    setPullRequestNumber(null);
    setCommitMessageId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <ChatSessionHeader
        handleNewChat={handleNewChat}
        chatSession={session || null}
        setChatClosed={() => {}}
        setChatSession={() => {}}
        project={project || undefined}
      />

      {showNetlifyStatus &&
        pullRequestNumber &&
        commitMessageId &&
        sessionId && (
          <div className="mb-4">
            <NetlifyStatus
              projectId={project._id}
              pullRequestNumber={pullRequestNumber}
              messageId={commitMessageId}
              sessionId={sessionId}
              messages={messages}
              addMessage={addMessage}
            />
          </div>
        )}

      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Chat with AI Assistant</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                <Message
                  message={{
                    id: randomUUID(),
                    role: "assistant",
                    content: `Hello! I'm your AI assistant for the ${project.name} project. I can help you modify the code in your GitHub repository. Just tell me what changes you'd like to make, and I'll analyze the code and propose modifications for you to review.`,
                    timestamp: new Date(),
                  }}
                />
                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
                {pendingMessage && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted text-muted-foreground rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">
                          AI is analyzing your repository...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {sessionError && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-destructive/10 text-destructive rounded-lg p-3">
                      <span className="text-sm">
                        Failed to load messages. Please try again.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the changes you want to make..."
                disabled={pendingMessage || chatClosed}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={pendingMessage || !input.trim() || chatClosed}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PullRequestConfirm
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        pendingChanges={pendingChanges}
        pendingMessageId={pendingMessageId || ""}
        commitLoading={commitLoading}
        setCommitLoading={setCommitLoading}
        setShowNetlifyStatus={setShowNetlifyStatus}
        addMessage={addMessage}
        projectId={project._id}
        sessionId={sessionId || ""}
      />
    </div>
  );
}
