"use client";

import React from "react";
import { LogOut, BrainCircuit } from "lucide-react";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";

export const Header = () => {
  const { data: session } = useSession();

  const isAdmin = session?.user?.role === "admin";
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6" />
          <h1 className="text-xl font-semibold">
            {isAdmin ? "Admin Dashboard" : "Gerador"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Bem-vindo, {session?.user?.name}
          </span>
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
