import mongoose from "mongoose";
import connectDb from "@/lib/database/db";
import Review from "@/lib/Schema/review";
import ReviewBlock from "@/lib/Schema/reviewBlockSchema";
import { getRequestUser, json } from "@/lib/auth/verifyRequest";

export const dynamic = "force-dynamic";

// GET /api/review/mine?productId=... -> { blocked, review } for the signed-in customer
export async function GET(req) {
  const user = await getRequestUser(req);
  if (!user) return json({ message: "Please sign in" }, 401);

  const productId = new URL(req.url).searchParams.get("productId");
  if (!mongoose.Types.ObjectId.isValid(productId)) return json({ message: "Invalid product" }, 400);

  try {
    await connectDb();
    const [blocked, review] = await Promise.all([
      ReviewBlock.exists({ userId: user.uid }),
      Review.findOne({ userId: user.uid, productId }).select("-userEmail").lean(),
    ]);
    return json({ blocked: Boolean(blocked), review: review || null });
  } catch (error) {
    console.error("Review status error:", error);
    return json({ message: "Failed to load your review" }, 500);
  }
}
