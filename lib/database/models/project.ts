import mongoose, { Types } from "mongoose";

export interface Project extends mongoose.Document {
  _id: string;
  name: string;
  githubRepo: string;
  destinationBranch: string;
  customPrompt: string;
  webhookUrl: string
  allowedUsers: string[]
  description?: string;
  createdAt: Date
  toneAndVoice?: {
    temperature: number;
    tone: number;
    treatment: number;
    style: number;
  }
}

const ProjectSchema = new mongoose.Schema<Project>({
  name: {
    type: String,
    required: true,
  },
  githubRepo: {
    type: String,
    required: true,
  },
  destinationBranch: {
    type: String,
    required: true,
  },
  customPrompt: {
    type: String,
    required: true,
  },
  webhookUrl: {
    type: String,
    required: true,
  },
  allowedUsers: {
    type: [String],
    required: true,
  },
  toneAndVoice: {
    type: Object,
    required: false,
  },
  description: {
    type: String,
  },
});

export default mongoose.models.User ||
  mongoose.model<Project>("projects", ProjectSchema);
