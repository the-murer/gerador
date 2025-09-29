import { Project } from "@/lib/database/models/project";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProject {
  projectId: string;
  project: Project;
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, project }: UpdateProject) =>
      fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
