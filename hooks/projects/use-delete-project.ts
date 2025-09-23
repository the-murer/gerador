import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) =>
      fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      //   toast.success("Project created successfully")
    },
  });
};
