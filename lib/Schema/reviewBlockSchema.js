import mongoose from "mongoose";

// Customers the admin has blocked from writing reviews (managed in JVR-ADMIN → Reviews).
const reviewBlockSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true }, // Firebase UID
    name: String,
    email: String,
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);

const ReviewBlock =
  mongoose.models.ReviewBlock || mongoose.model("ReviewBlock", reviewBlockSchema, "review_blocks");

export default ReviewBlock;
