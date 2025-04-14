import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import connectDb from "@/lib/database/db";
import Review from "@/lib/Schema/review";


cloudinary.config({
  cloud_name: "drojxcxa1",
  api_key: "316898787323286",
  api_secret: "en2gIyAB52RDFk7d3VN9K0ua3LM",
});

export async function POST(req) {
    try {
        await connectDb()
        const formData = await req.formData()

        const userName = formData.get("username")
        const productId = formData.get("productId")
        const rating = formData.get("rating")
        const comment = formData.get("comment")
        const images = formData.getAll("images")
        
        if(!userName || !productId || !rating || !comment || !Array.isArray(images)) {
            return new Response(JSON.stringify({message : "All fields are required", statusCode : 400}), {status : 400})
        }

        
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

        const uploadedImages = await Promise.all(images.map(uploadImage));

            const newReview = new Review({
                user : userName,
                productId : productId,
                rating : rating,
                imageUrls : uploadedImages,
                comment : comment
            })

            await newReview.save()

            console.log("Review ", newReview)

            if(!newReview){
                return new Response(JSON.stringify({message : "Failed to add review", statusCode : 500}), {status : 500})
            }

            return new Response(JSON.stringify({message : "Review added successfully", statusCode : 201}), {status : 201})
    } catch (error) {
        console.error("Error adding review:", error);
        return new Response(JSON.stringify({message : error.message, statusCode : 500}), {status : 500})
    }
}