import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteChatSession = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const response = await fetch(
        `/api/chat/${projectId}/sessions/${sessionId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        return true;
      }
      return false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history", projectId] });
    },
  });
};
