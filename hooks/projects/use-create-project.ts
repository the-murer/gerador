import { useMutation } from "@tanstack/react-query"
import { Project } from "@/types/proeject"
// import { toast } from "sonner"

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (project: any) => fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(project),
    }),
    onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["projects"] })
    //   toast.success("Project created successfully")
    },
  })
}