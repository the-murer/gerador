import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddUserToProject {
  projectId: string;
  userId: string;
}

export const useRemoveUserProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, userId }: AddUserToProject) =>
      fetch(`/api/projects/${projectId}/users/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      //   toast.success("Project created successfully")
    },
  });
};
