"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Trash2 } from "lucide-react";
import { User } from "@/lib/database/models/user";

interface Project {
  _id: string;
  name: string;
}

interface UserManagementProps {
  users: User[];
  projects: Project[];
  onUserUpdate: () => void;
}

const UserCard = ({
  user,
  deleteUser,
}: {
  user: User;
  deleteUser: (userId: string) => void;
}) => (
  <div
    key={user._id}
    className="flex items-center justify-between p-3 border rounded-lg"
  >
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{user.name}</span>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      <p className="text-xs text-muted-foreground">
        Created: {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
    <Button variant="outline" size="sm" onClick={() => deleteUser(user._id)}>
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export function UserManagement({
  users,
  projects,
  onUserUpdate,
}: UserManagementProps) {
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setSuccess("User created successfully!");
        setNewUser({ name: "", email: "", password: "", role: "user" });
        onUserUpdate();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create user");
      }
    } catch (error) {
      setError("An error occurred while creating the user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onUserUpdate();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create New User
          </CardTitle>
          <CardDescription>Add a new user to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Name</Label>
                <Input
                  id="userName"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userEmail">Email</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userPassword">Password</Label>
                <Input
                  id="userPassword"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userRole">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? "Creating User..." : "Create User"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Users */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Users</CardTitle>
          <CardDescription>Manage existing user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No users found.
            </p>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  deleteUser={handleDeleteUser}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
