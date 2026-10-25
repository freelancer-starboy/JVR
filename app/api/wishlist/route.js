import mongoose from "mongoose";
import connectDb from "@/lib/database/db";
import Wishlist from "@/lib/Schema/wishlistSchema";
import Product from "@/lib/Schema/productSchema";
import { getRequestUser, json } from "@/lib/auth/verifyRequest";

export const dynamic = "force-dynamic";

// GET /api/wishlist -> wishlist items of the signed-in user (newest first)
export async function GET(req) {
  const user = await getRequestUser(req);
  if (!user) return json({ message: "Please sign in" }, 401);

  try {
    await connectDb();
    const wishlist = await Wishlist.findOne({ userId: user.uid }).lean();
    const items = (wishlist?.items || []).sort(
      (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
    );
    return json(items);
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return json({ message: "Failed to load wishlist" }, 500);
  }
}

// POST /api/wishlist { productId } -> adds a product (no-op if already present)
export async function POST(req) {
  const user = await getRequestUser(req);
  if (!user) return json({ message: "Please sign in to use your wishlist" }, 401);

  try {
    const { productId } = await req.json();
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return json({ message: "Invalid product" }, 400);
    }

    await connectDb();
    const product = await Product.findById(productId).lean();
    if (!product) return json({ message: "Product not found" }, 404);

    const item = {
      productId: String(product._id),
      productName: product.productName,
      productPrice: product.productPrice,
      productOldPrice: product.productOldPrice,
      productImage: product.productVariants?.[0]?.images?.[0] || "",
      productCategory: product.productCategory,
      addedAt: new Date(),
    };

    // Only push when the product isn't already in the list.
    await Wishlist.updateOne(
      { userId: user.uid, "items.productId": { $ne: item.productId } },
      { $push: { items: item } }
    );
    // Create the document for first-time users.
    await Wishlist.updateOne(
      { userId: user.uid },
      { $setOnInsert: { items: [item] } },
      { upsert: true }
    );

    return json({ message: "Added to wishlist", item });
  } catch (error) {
    console.error("Wishlist add error:", error);
    return json({ message: "Failed to add to wishlist" }, 500);
  }
}

// DELETE /api/wishlist?productId=... -> removes a product
export async function DELETE(req) {
  const user = await getRequestUser(req);
  if (!user) return json({ message: "Please sign in" }, 401);

  try {
    const productId = new URL(req.url).searchParams.get("productId");
    if (!productId) return json({ message: "Product ID is required" }, 400);

    await connectDb();
    await Wishlist.updateOne({ userId: user.uid }, { $pull: { items: { productId } } });
    return json({ message: "Removed from wishlist", productId });
  } catch (error) {
    console.error("Wishlist delete error:", error);
    return json({ message: "Failed to remove from wishlist" }, 500);
  }
}
