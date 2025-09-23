import { User } from "@/lib/database/models/user";
import { useQuery } from "@tanstack/react-query";

const fetchUsers = async (): Promise<User[] | undefined> => {
  try {
    const response = await fetch("/api/users");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
};

export function useFindUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
