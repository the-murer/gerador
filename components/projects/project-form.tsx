"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_SYSTEM_PROMPTS } from "@/lib/ai-prompts";
import { useCreateProject } from "@/hooks/projects/use-create-project";

export function ProjectForm() {
  const [formData, setFormData] = useState({
    name: "",
    githubRepo: "",
    customPrompt: "",
    destinationBranch: "main",
    webhookUrl: "",
    projectType: "general",
  });
  const { mutateAsync: createProject, isPending, isError } = useCreateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createProject(formData);
      if (response.ok) {
        setFormData({
          name: "",
          githubRepo: "",
          customPrompt: "",
          destinationBranch: "main",
          webhookUrl: "",
          projectType: "general",
        });
      }
    } catch (error) {
      console.log("Error creating project ", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProjectTypeChange = (value: string) => {
    setFormData({
      ...formData,
      projectType: value,
      customPrompt:
        value !== "general" ? DEFAULT_SYSTEM_PROMPTS[value] || "" : "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="My AI Project"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubRepo">GitHub Repository</Label>
          <Input
            id="githubRepo"
            name="githubRepo"
            value={formData.githubRepo}
            onChange={handleChange}
            placeholder="username/repository-name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destinationBranch">Destination Branch</Label>
          <Input
            id="destinationBranch"
            name="destinationBranch"
            value={formData.destinationBranch}
            onChange={handleChange}
            placeholder="main"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
          <Input
            id="webhookUrl"
            name="webhookUrl"
            value={formData.webhookUrl}
            onChange={handleChange}
            placeholder="https://your-webhook-url.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectType">Project Type</Label>
        <Select
          value={formData.projectType}
          onValueChange={handleProjectTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select project type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Development</SelectItem>
            <SelectItem value="frontend">Frontend (React/Next.js)</SelectItem>
            <SelectItem value="backend">Backend/API</SelectItem>
            <SelectItem value="fullstack">Full-Stack Application</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          This helps pre-configure the AI agent with relevant expertise for your
          project type.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customPrompt">Custom Agent Prompt</Label>
        <Textarea
          id="customPrompt"
          name="customPrompt"
          value={formData.customPrompt}
          onChange={handleChange}
          placeholder="You are an AI assistant that helps modify code. Your role is to..."
          rows={6}
          required
        />
        <p className="text-sm text-muted-foreground">
          This prompt will guide the AI agent when making modifications to your
          repository. Be specific about your project's requirements, coding
          standards, and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Example Custom Prompts</CardTitle>
          <CardDescription>
            Here are some examples to help you write effective prompts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <strong>E-commerce Project:</strong>
            <p className="text-muted-foreground">
              "You are helping build an e-commerce platform. Focus on user
              experience, security, and performance. Always validate user
              inputs, handle errors gracefully, and follow our component naming
              convention with 'Ecom' prefix."
            </p>
          </div>
          <div>
            <strong>API Development:</strong>
            <p className="text-muted-foreground">
              "You specialize in building RESTful APIs with Node.js and Express.
              Always include proper error handling, input validation, and follow
              our API response format with status, data, and message fields."
            </p>
          </div>
        </CardContent>
      </Card>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{isError}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating Project..." : "Create Project"}
      </Button>
    </form>
  );
}
