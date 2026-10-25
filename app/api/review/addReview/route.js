import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import connectDb from "@/lib/database/db";
import Review from "@/lib/Schema/review";
import ReviewBlock from "@/lib/Schema/reviewBlockSchema";
import Product from "@/lib/Schema/productSchema";
import { getRequestUser, json } from "@/lib/auth/verifyRequest";
import mongoose from "mongoose";


cloudinary.config({
  cloud_name: "drojxcxa1",
  api_key: "316898787323286",
  api_secret: "en2gIyAB52RDFk7d3VN9K0ua3LM",
});

export const dynamic = "force-dynamic";

const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_COMMENT_LENGTH = 2000;

const uploadImage = async (file) => {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "reviews"
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// POST /api/review/addReview (multipart: productId, rating, comment, images[])
// Any signed-in customer can review a product, unless an admin has blocked them.
// One review per customer per product: posting again updates the existing review.
export async function POST(req) {
    const user = await getRequestUser(req)
    if (!user) return json({ message: "Please sign in to write a review" }, 401)

    try {
        const formData = await req.formData()

        const productId = String(formData.get("productId") || "")
        const rating = Number(formData.get("rating"))
        const comment = String(formData.get("comment") || "").trim()
        const images = formData.getAll("images").filter((file) => file && typeof file === "object" && file.size > 0)

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return json({ message: "Invalid product" }, 400)
        }
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            return json({ message: "Please choose a rating from 1 to 5 stars" }, 400)
        }
        if (!comment) {
            return json({ message: "Please write a few words about the product" }, 400)
        }
        if (comment.length > MAX_COMMENT_LENGTH) {
            return json({ message: `Reviews can be up to ${MAX_COMMENT_LENGTH} characters` }, 400)
        }
        if (images.length > MAX_IMAGES) {
            return json({ message: `You can add up to ${MAX_IMAGES} photos` }, 400)
        }
        if (images.some((file) => !String(file.type).startsWith("image/") || file.size > MAX_IMAGE_BYTES)) {
            return json({ message: "Photos must be images under 5 MB" }, 400)
        }

        await connectDb()

        if (await ReviewBlock.exists({ userId: user.uid })) {
            return json({ message: "You can't post reviews on this store. Please contact us if you think this is a mistake." }, 403)
        }
        if (!(await Product.exists({ _id: productId }))) {
            return json({ message: "Product not found" }, 404)
        }

        const uploadedImages = await Promise.all(images.map(uploadImage))
        const existing = await Review.findOne({ userId: user.uid, productId })

        const fields = {
            user: user.name || formData.get("username") || user.email?.split("@")[0] || "Customer",
            userId: user.uid,
            userEmail: user.email,
            productId,
            rating,
            comment,
        }

        if (existing) {
            existing.set(fields)
            // New photos replace the old ones; otherwise keep what was there.
            if (uploadedImages.length) existing.imageUrls = uploadedImages
            await existing.save()
            return json({ message: "Your review has been updated", review: existing }, 200)
        }

        const review = await Review.create({ ...fields, imageUrls: uploadedImages })
        return json({ message: "Thanks! Your review has been posted", review }, 201)
    } catch (error) {
        console.error("Error adding review:", error);
        return json({ message: "Failed to save your review. Please try again." }, 500)
    }
}
