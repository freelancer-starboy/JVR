import connectDb from "@/lib/database/db";
import Review from "@/lib/Schema/review";

export async function GET(req){
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('id')
    console.log(productId)
    try {
        await connectDb()
        const response = await Review.find({
            productId : productId
        }).populate("productId", "productName").sort({createdAt : -1})
        
        if(response.length === 0){
            return new Response(JSON.stringify({message : "Review not found"}), {status : 404})
        }

        return new Response(JSON.stringify(response), {status : 200})
    } catch (error) {
        return new Response(JSON.stringify({message : error.message}), {status : 500})
    }
}