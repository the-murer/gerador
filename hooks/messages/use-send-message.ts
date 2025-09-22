import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/message";

interface SendMessageParams {
  projectId: string;
  message: string;
  chatHistory: Message[];
  sessionId: string;
  messageId: string;
}

interface SendMessageResponse {
  message: string;
  proposedChanges?: any;
  messageId: string;
  sessionId: string;
}

async function sendMessage({
  projectId,
  message,
  chatHistory,
  sessionId,
  messageId,
}: SendMessageParams): Promise<SendMessageResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId,
      message,
      chatHistory,
      sessionId,
      messageId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to send message");
  }

  return response.json();
}

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data, variables) => {
      // Invalidate and refetch messages for this project/session
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.projectId, variables.sessionId],
      });
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    },
  });
}
