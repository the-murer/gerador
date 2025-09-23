export interface Project {
  _id: string;
  name: string;
  githubRepo: string;
  destinationBranch: string;
  customPrompt: string;
  description?: string;
}
