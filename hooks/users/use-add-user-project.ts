import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddUserToProject {
  projectId: string;
  userId: string;
}

export const useAddUserProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId }: AddUserToProject) =>
      fetch(`/api/projects/${projectId}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      //   toast.success("Project created successfully")
    },
  });
};
