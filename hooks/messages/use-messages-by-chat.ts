import { useQuery } from "@tanstack/react-query";
import { Message } from "@/types/message";

interface UseMessagesByChatParams {
  projectId: string;
  sessionId?: string;
  enabled?: boolean;
}

async function fetchMessages(
  projectId: string,
  sessionId?: string
): Promise<Message[]> {
  const url = sessionId
    ? `/api/chat/${projectId}/messages?sessionId=${sessionId}`
    : `/api/chat/${projectId}/messages`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
}

export function useMessagesByChat({
  projectId,
  sessionId,
  enabled = true,
}: UseMessagesByChatParams) {
  return useQuery({
    queryKey: ["messages", projectId, sessionId],
    queryFn: () => fetchMessages(projectId, sessionId),
    enabled: enabled && !!projectId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
}
