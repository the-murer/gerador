"use client";

import { ProjectSelector } from "@/components/project-selector";
import { FolderGit2 } from "lucide-react";

export function UserDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FolderGit2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Selecione um Projeto</h2>
            <p className="text-muted-foreground">
              Selecione um projeto para começar a fazer modificações
            </p>
          </div>
          <ProjectSelector />
        </div>
      </main>
    </div>
  );
}
