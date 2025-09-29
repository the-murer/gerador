import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";
import { Project } from "@/lib/database/models/project";
import { useFindUsers } from "@/hooks/users/use-find-users";
import { useAddUserProject } from "@/hooks/users/use-add-user-project";
import { useRemoveUserProject } from "@/hooks/users/use-remove-user-project";

export const ManageUsersProject = ({ project }: { project: Project }) => {
  const [selectedUserId, setSelectedUserId] = useState("");

  const { mutateAsync: addUserProject } = useAddUserProject();
  const { mutateAsync: removeUserProject } = useRemoveUserProject();
  const { data: users, refetch: fetchUsers } = useFindUsers();

  const handleAddUser = async (projectId: string) => {
    if (!selectedUserId) return;

    try {
      const response = await addUserProject({
        projectId,
        userId: selectedUserId,
      });

      if (response.ok) {
        setSelectedUserId("");
      }
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleRemoveUser = async (projectId: string, userId: string) => {
    await removeUserProject({ projectId, userId }).catch((error) => {
      console.error("Failed to remove user:", error);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            fetchUsers();
          }}
        >
          <Users className="h-4 w-4 mr-2" />
          Gerenciar usuários
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar usuários do projeto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um usuário para adicionar" />
              </SelectTrigger>
              <SelectContent>
                {users
                  ?.filter(
                    (user: any) => !project.allowedUsers.includes(user._id)
                  )
                  .map((user: any) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => handleAddUser(project._id)}
              disabled={!selectedUserId}
            >
              Adicionar usuário
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Usuários atuais</Label>
            {project.allowedUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum usuário atribuído a este projeto.
              </p>
            ) : (
              <div className="space-y-2">
                {project.allowedUsers.map((userId) => {
                  const user: any = users?.find((u: any) => u._id === userId);
                  return (
                    <div
                      key={userId}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{user?.name || "Usuário desconhecido"}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveUser(project._id, userId)}
                      >
                        Remover
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
