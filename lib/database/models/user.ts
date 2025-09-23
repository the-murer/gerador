import mongoose from "mongoose";

export interface User extends mongoose.Document {
  _id: string
  email: string;
  name: string;
  role: string;
  password: string;
  createdAt: Date
}

const UserSchema = new mongoose.Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.models.User ||
  mongoose.model<User>("User", UserSchema);
