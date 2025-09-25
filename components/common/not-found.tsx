import { FolderX } from "lucide-react";
import React from "react";

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-6">
      <div className="text-center space-y-4">
        <FolderX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Não encontramos o que você está procurando
        </p>
      </div>
    </div>
  );
};
