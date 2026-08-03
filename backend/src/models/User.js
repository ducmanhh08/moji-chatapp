import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // CDN URL for displaying the image
    },
    avatarId: {
      type: String, // Cloudinary public_id for deleting the image
    },
    bio: {
      type: String,
      maxlength: 500, // optional
    },
    phone: {
      type: String,
      sparse: true, // allow null, but do not allow duplicates
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
