"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ProjectSelector } from "@/components/project-selector";
import { ChatHistory } from "@/components/chat-history";
import { LogOut, MessageSquare, FolderGit2, ArrowLeft } from "lucide-react";
import { signOut } from "next-auth/react";

export function UserDashboard() {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <FolderGit2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mb-2">Select a Project</h2>
            <p className="text-muted-foreground">
              Choose a project to start making AI-powered modifications
            </p>
          </div>
          <ProjectSelector />
        </div>
      </main>
    </div>
  );
}
