"use client";

import React from "react";
import { MessageSquare, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export const Header = () => {
  const { data: session } = useSession();


  const isAdmin = session?.user?.role === "admin";
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          <h1 className="text-xl font-semibold">{isAdmin ? "Admin Dashboard" : "AI Code Assistant"}</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {session?.user?.name}
          </span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};
