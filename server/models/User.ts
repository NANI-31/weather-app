import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username?: string;
  email: string;
  password?: string;
  googleId?: string;
  picture?: string;
  name?: string;
  createdAt: Date;
  favorites: string[];
  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true, // Not required for google auth initially if we just use name
    unique: false, // Changed from unique true if we allow multiple users with same name (or handle username gen)
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false, // Optional for Google Auth
    minlength: 6,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to not conflict
  },
  picture: {
    type: String,
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  favorites: [
    {
      type: String,
      trim: true,
    },
  ],
  resetPasswordOtp: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
