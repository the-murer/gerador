import { Project } from "@/lib/database/models/project";
import { useQuery } from "@tanstack/react-query";

const findAllProjects = async (): Promise<Project[] | undefined> => {
  try {
    const response = await fetch("/api/projects");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }
};

export function useFindAllProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => findAllProjects(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
