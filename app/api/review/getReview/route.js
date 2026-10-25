import connectDb from "@/lib/database/db";
import Review from "@/lib/Schema/review";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// GET /api/review/getReview?id=<productId> -> public reviews for a product, newest first
export async function GET(req){
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('id')
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return new Response(JSON.stringify([]), {status : 200})
    }
    try {
        await connectDb()
        const response = await Review.find({ productId })
            .select("-userEmail")
            .populate("productId", "productName")
            .sort({createdAt : -1})

        return new Response(JSON.stringify(response), {status : 200})
    } catch (error) {
        return new Response(JSON.stringify({message : error.message}), {status : 500})
    }
}
