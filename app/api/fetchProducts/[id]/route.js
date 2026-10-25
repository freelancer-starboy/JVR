import mongoose from "mongoose"
import connectDb from "@/lib/database/db"
import Product from "@/lib/Schema/productSchema"

export async function GET(req, {params}) {
    try {
        if(!params?.id || !mongoose.Types.ObjectId.isValid(params.id)){
            return new Response(JSON.stringify({ message : "Product not found"}), { status : 404 })
        }
        await connectDb()
        const data = await Product.findById(params.id)
        if(!data){
            return new Response(JSON.stringify({ message : "Product not found"}), { status : 404 })
        }
        return new Response(JSON.stringify(data), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ message : error.message }), { status : 500})
    }
}
