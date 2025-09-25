import { Message } from "./message";

export interface ChatSession {
  _id: string;
  projectId: string;
  userId: string;
  lastActivity: Date;
  commitBranch: string;
  completedAt: Date;
  netlifyStatus: "pending" | "deployed";
  pullRequestNumber: number;
  netlifyPreviewUrl: string;
  netlifyUpdatedAt: Date;
  messages: Message[];
  status: "active" | "committed" | "closed";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}


