import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Message as MessageType } from "@/types/message";
import { randomUUID } from "@/hooks/chat/use-chat-session";

export interface PullRequestConfirmProps {
  showConfirmDialog: boolean;
  setShowConfirmDialog: (show: boolean) => void;
  pendingChanges: any;
  pendingMessageId: string;
  commitLoading: boolean;
  setCommitLoading: (loading: boolean) => void;
  projectId: string;
  sessionId: string;
  addMessage: (message: MessageType) => void;
  setShowNetlifyStatus: (show: boolean) => void;
}

export const PullRequestConfirm = ({
  showConfirmDialog,
  setShowConfirmDialog,
  pendingChanges,
  pendingMessageId,
  commitLoading,
  setCommitLoading,
  projectId,
  sessionId,
  addMessage,
  setShowNetlifyStatus,
}: PullRequestConfirmProps) => {
  const [pullInfo, setPullInfo] = useState<{
    pullRequestNumber: number;
    pullRequestUrl: string;
    commitMessageId: string;
    commitSha: string;
  } | null>(null);


  const handleConfirmChanges = async () => {
    setCommitLoading(true);
    try {
      const response = await fetch("/api/github/commit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
          changes: pendingChanges,
          messageId: pendingMessageId,
          sessionId: sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPullInfo({
            pullRequestNumber: data.pullRequest?.number,
            pullRequestUrl: data.pullRequest?.url,
            commitMessageId: data.messageId,
            commitSha: data.commitSha,
        });
        setShowNetlifyStatus(true);

        const successMessage: MessageType = {
          id: randomUUID(),
          role: "assistant",
          content: `✅ Changes have been successfully committed to your repository!\n\nPull Request: ${data.pullRequest?.url}\nBranch: ${data.branch}\n\n🚀 Netlify is now building your changes. You'll see the live preview below once it's ready.`,
          timestamp: new Date(),
        };
        addMessage(successMessage);
      } else {
        const errorData = await response.json();
        const errorMessage: MessageType = {
          id: randomUUID(),
          role: "assistant",
          content: `❌ Failed to commit changes: ${errorData.error}`,
          timestamp: new Date(),
        };
        addMessage(errorMessage);
      }
    } catch (error) {
      const errorMessage: MessageType = {
        id: randomUUID(),
        role: "assistant",
        content: "❌ Failed to commit changes due to a network error.",
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setCommitLoading(false);
      setShowConfirmDialog(false);
    }
  };
  return (
    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Confirm Changes
          </DialogTitle>
          <DialogDescription>
            The AI has prepared changes to your repository. Review and confirm
            to create a pull request.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {pendingChanges && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Files to be modified:</strong>
                <ul className="mt-2 space-y-1 max-h-[200px] overflow-y-auto">
                  {pendingChanges.files?.map((file: any, index: number) => {
                    return (
                      <li key={index} className="text-sm font-mono">
                        • {file.content}
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  Changes will be committed to a new branch and a pull request
                  will be created.
                </p>
                {pendingMessageId && (
                  <p className="mt-1 text-xs text-muted-foreground font-mono">
                    MessageType ID: {pendingMessageId.slice(0, 8)}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={commitLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmChanges} disabled={commitLoading}>
              {commitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating PR...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Pull Request
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
