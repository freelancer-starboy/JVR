import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productOldPrice: { type: Number },
    productImage: { type: String },
    productCategory: { type: String },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// One document per user; items are unique by productId.
const wishlistSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

const Wishlist =
  mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema, "wishlists");

export default Wishlist;
