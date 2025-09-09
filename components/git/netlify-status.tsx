"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe, Loader2, CheckCircle, Clock } from "lucide-react";
import { randomUUID } from "../chat-interface";

interface NetlifyStatusProps {
  projectId: string;
  pullRequestNumber: number;
  messageId: string;
  sessionId: string;
  messages: any[];
  addMessage: (message: any) => void;
}

export function NetlifyStatus({
  projectId,
  pullRequestNumber,
  messageId,
  sessionId,
  messages,
  addMessage,
}: NetlifyStatusProps) {
  const [status, setStatus] = useState<"pending" | "deployed" | "error">(
    "pending"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkNetlifyStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/netlify/check-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          pullRequestNumber,
          messageId,
          sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus(data.status);
        if (data.previewUrl) {
          // Clean the URL by removing any markdown formatting or extra characters
          let cleanUrl = data.previewUrl;

          // Remove markdown link formatting if present
          if (cleanUrl.includes("](")) {
            cleanUrl = cleanUrl.split("](")[1].split(")")[0];
          }

          // Remove any trailing characters that might be part of markdown
          cleanUrl = cleanUrl.replace(/[\]\)\s]+$/, "");

          // Ensure it's a valid URL
          if (cleanUrl.startsWith("http")) {
            setPreviewUrl(cleanUrl);
          }
        }
        if (data.comment) {
          setComment(data.comment);
        }
        setLastChecked(new Date());

        // Notify parent component
        handleNetlifyStatusUpdate?.(data.status, data.previewUrl);
      }
    } catch (error) {
      console.error("Error checking Netlify status:", error);
      setStatus("error");
    } finally {
      setIsChecking(false);
    }
  };

  const handleNetlifyStatusUpdate = (status: string, previewUrl?: string) => {
    if (status === "deployed" && previewUrl) {
      const deployedMessage: any = {
        id: randomUUID(),
        closeMessageId: randomUUID(),
        role: "assistant",
        content: `🎉 Your changes are now live! The Netlify deployment is complete and you can view your modifications at the preview URL above.`,
        timestamp: new Date().toLocaleTimeString(),
      };
      if (messages.find((message: any) => message.closeMessageId)) {
        return;
      }
      addMessage(deployedMessage);
    }
  };

  // Auto-check status every 30 seconds if still pending
  useEffect(() => {
    if (status === "pending" && !previewUrl) {
      const interval = setInterval(checkNetlifyStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Initial check
  useEffect(() => {
    checkNetlifyStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "deployed":
        return <CheckCircle className="h-4 w-4" />;
      case "error":
        return <ExternalLink className="h-4 w-4" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "secondary";
      case "deployed":
        return "default";
      case "error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle className="text-lg">Netlify Deployment</CardTitle>
          </div>
          <Badge variant={getStatusColor()} className="flex items-center gap-1">
            {getStatusIcon()}
            {status === "pending"
              ? "Building..."
              : status === "deployed"
              ? "Live"
              : "Error"}
          </Badge>
        </div>
        <CardDescription>
          {status === "pending" &&
            "Your changes are being deployed to Netlify..."}
          {status === "deployed" &&
            "Your modifications are now live and ready to view!"}
          {status === "error" &&
            "There was an issue checking the deployment status."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {status === "deployed" && previewUrl && (
          <div className="space-y-2">
            <Button asChild className="w-full" size="lg">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                View Live Preview
              </a>
            </Button>

            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Preview URL:</p>
              <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                {previewUrl}
              </code>
            </div>
          </div>
        )}

        {previewUrl && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {lastChecked
                ? `Last checked: ${lastChecked.toLocaleTimeString()}`
                : "Checking..."}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={checkNetlifyStatus}
              disabled={isChecking}
            >
              {isChecking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Check Now"
              )}
            </Button>
          </div>
        )}

        {comment && (
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              View Netlify Comment
            </summary>
            <div className="mt-2 p-3 bg-muted rounded-md">
              <pre className="whitespace-pre-wrap text-xs">{comment}</pre>
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  );
}
