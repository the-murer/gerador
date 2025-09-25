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
  messageId: string;
  projectId: string;
  sessionId: string;
  addMessage: (message: MessageType) => void;
  setShowNetlifyStatus: (show: boolean) => void;
  setPullRequestNumber: (number: number) => void;
}

export const PullRequestConfirm = ({
  showConfirmDialog,
  setShowConfirmDialog,
  messageId,
  projectId,
  sessionId,
  addMessage,
  setShowNetlifyStatus, setPullRequestNumber,
}: PullRequestConfirmProps) => {
  const [commitLoading, setCommitLoading] = useState(false);

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
          messageId,
          sessionId: sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPullRequestNumber(data.pullRequestNumber);
        setShowNetlifyStatus(true);

        const successMessage: MessageType = {
          id: randomUUID(),
          role: "assistant",
          content: `✅ Alterações enviadas com sucesso!\n Em breve você poderá ver as alterações por aqui.`,
          timestamp: new Date(),
        };
        addMessage(successMessage);
      } else {
        const errorData = await response.json();
        const errorMessage: MessageType = {
          id: randomUUID(),
          role: "assistant",
          content: `❌ Falha ao enviar as alterações: ${errorData.error}`,
          timestamp: new Date(),
        };
        addMessage(errorMessage);
      }
    } catch (error) {
      const errorMessage: MessageType = {
        id: randomUUID(),
        role: "assistant",
        content: "❌ Falha ao enviar as alterações devido a um erro de rede.",
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
            Confirmar alterações
          </DialogTitle>
          <DialogDescription>
            Ao confirmar as alterações, elas serão enviadas e o chat será fechado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={commitLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleConfirmChanges} disabled={commitLoading}>
              {commitLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando alterações
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
