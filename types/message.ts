export interface Message {
  id: string;
  role: "user" | "assistant";
  proposedChanges?: any;
  messageId?: string;
  content: string;
  timestamp: Date;
  modifications?: any[];
  commitInfo?: {
    pullRequestNumber: number;
    pullRequestUrl: string;
    commitSha: string;
  };
}
