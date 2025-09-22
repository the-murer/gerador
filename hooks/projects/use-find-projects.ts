import { useQuery } from "@tanstack/react-query";
import { Project } from "@/types/project";

interface UseFindProjectsParams {
  enabled?: boolean;
}

async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch("/api/user/projects");
    if (response.ok) {
      const data = await response.json();
      console.log("🚀 ~ fetchProjects ~ data => ", data);
      return data as Project[];
    }
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }
  return [];
}

export function useFindProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchProjects(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
