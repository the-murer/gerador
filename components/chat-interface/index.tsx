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

const ULID_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function randomUUID(date = Date.now()): string {
  const cryptoObj = globalThis.crypto as Crypto | undefined;
  const time = date;
  const timeChars = [];
  let rem = time;
  for (let i = 9; i >= 0; i--) {
    timeChars[i] = ULID_ALPHABET[rem % 32];
    rem = Math.floor(rem / 32);
  }
  const rand = new Uint8Array(16);
  cryptoObj?.getRandomValues ? cryptoObj.getRandomValues(rand) : rand.fill(0);
  const randChars = Array.from(
    { length: 16 },
    (_, i) => ULID_ALPHABET[rand[i] % 32]
  );
  return timeChars.join("") + randChars.join("");
}

export interface MessageType {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  proposedChanges?: any;
  messageId?: string;
}

export interface Project {
  _id: string;
  name: string;
  githubRepo: string;
  destinationBranch: string;
  customPrompt: string;
}

interface ChatInterfaceProps {
  project: Project;
  resumedSession?: any;
}

export interface ChatSession {
  id: string;
  projectId: string;
  isActive: boolean;
  createdAt: Date;
  lastActivity: Date;
}

export function ChatInterface({ project, resumedSession }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(null);
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);
  const [commitLoading, setCommitLoading] = useState(false);
  const [pullInfo, setPullInfo] = useState<{
    pullRequestNumber: number;
    pullRequestUrl: string;
    commitMessageId: string;
    commitSha: string;
  } | null>(null);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [chatClosed, setChatClosed] = useState(false);
  const [showNetlifyStatus, setShowNetlifyStatus] = useState(false);
  const [pullRequestNumber, setPullRequestNumber] = useState<number | null>(
    null
  );
  const [commitMessageId, setCommitMessageId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  useEffect(() => {
    fetchMessages();
    initializeChatSession();
  }, [project._id]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    console.log("🚀 ~ fetchMessages ~ resumedSession => ", resumedSession);
    const response = await fetch(
      `/api/chat/${project._id}/messages?sessionId=${resumedSession?._id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("🚀 ~ fetchMessages ~ response => ", response);

    const data = await response.json();
    console.log("🚀 ~ fetchMessages ~ data => ", data);
    setMessages(data);
  };

  const initializeChatSession = async () => {
    if (resumedSession) {
      setChatSession(resumedSession);
    } else {
      const sessionId = randomUUID();
      setChatSession({
        id: sessionId,
        projectId: project._id,
        isActive: true,
        createdAt: new Date(),
        lastActivity: new Date(),
      });
    }

    setChatClosed(!resumedSession?.isActive);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading || chatClosed) return;

    const messageId = randomUUID();
    const userMessage: MessageType = {
      id: randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
      messageId,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project._id,
          message: input,
          chatHistory: messages,
          sessionId: chatSession?.id,
          messageId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: MessageType = {
          id: randomUUID(),
          role: "assistant",
          content: data.message,
          timestamp: new Date().toLocaleTimeString(),
          proposedChanges: data.proposedChanges,
          messageId: data.messageId || messageId,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (data.proposedChanges) {
          setPendingChanges(data.proposedChanges);
          setPendingMessageId(data.messageId || messageId);
          setShowConfirmDialog(true);
        }
      } else {
        const errorData = await response.json();
        const errorMessage: MessageType = {
          id: randomUUID(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${
            errorData.error || "Unknown error"
          }`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: MessageType = {
        id: randomUUID(),
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setPendingChanges(null);
    setPendingMessageId(null);
    setShowConfirmDialog(false);
    setShowNetlifyStatus(false);
    setPullRequestNumber(null);
    setCommitMessageId(null);
    setPullInfo(null);
    initializeChatSession();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Project Info */}
      <ChatSessionHeader
        handleNewChat={handleNewChat}
        setChatClosed={setChatClosed}
        chatSession={chatSession || null}
        setChatSession={setChatSession || null}
        project={project || undefined}
      />

      {showNetlifyStatus &&
        pullRequestNumber &&
        commitMessageId &&
        chatSession && (
          <div className="mb-4">
            <NetlifyStatus
              projectId={project._id}
              pullRequestNumber={pullRequestNumber}
              messageId={commitMessageId}
              sessionId={chatSession.id}
              messages={messages}
              addMessage={addMessage}
            />
          </div>
        )}

      {/* Chat Section */}
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
                    timestamp: new Date().toLocaleTimeString(),
                  }}
                />
                {messages.map((message) => (
                  <Message key={message.id} message={message} />
                ))}
                {loading && (
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
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2 mt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe the changes you want to make..."
                disabled={loading || chatClosed}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim() || chatClosed}
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
        setPullInfo={setPullInfo}
        setShowNetlifyStatus={setShowNetlifyStatus}
        addMessage={addMessage}
        projectId={project._id}
        sessionId={chatSession?.id || ""}
        pullInfo={pullInfo}
      />
    </div>
  );
}
