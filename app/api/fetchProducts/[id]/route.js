import connectDb from "@/lib/database/db"
import Product from "@/lib/Schema/productSchema"

export async function GET(req, {params}) {
    try {
        await connectDb()
        if(params?.id){
            const data = await Product.findById(params.id)
            return new Response(JSON.stringify(data), { status: 200 })
        }
        return new Response( { status : 500}, JSON.stringify({ message : "Product not found"}))
    } catch (error) {
        return new Response( { status : 500}, JSON.stringify({ message : error.message }))
    }
}