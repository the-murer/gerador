import { useQuery } from "@tanstack/react-query";
import { ChatSession } from "@/types/chat-session";

async function fetchChatHistory(projectId: string): Promise<ChatSession[]> {
  try {
    const response = await fetch(`/api/chat/${projectId}/history`);
    if (response.ok) {
      const data = await response.json();
      return data as ChatSession[];
    }
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
  }
  return [];
}

export function useFindChatHistory(projectId: string) {
  return useQuery({
    queryKey: ["chat-history", projectId],
    queryFn: () => fetchChatHistory(projectId),
    staleTime: 60 * 1000,
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
}
