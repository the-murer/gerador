import { Project } from "@/lib/database/models/project";
import { useQuery } from "@tanstack/react-query";

async function fetchProjectById(projectId: string): Promise<Project | null> {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data as Project;
    }
  } catch (error) {
    console.error("Failed to fetch project by id:", error);
  }
  return null;
}

export function useFindProjectById(projectId: string) {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => fetchProjectById(projectId),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
