import connectDb from "@/lib/database/db"
import Product from "@/lib/Schema/productSchema"

export async function GET(req){
    try {
        const { searchParams } = new URL(req.URL)
        const query = searchParams.get('searchQuery')
        if(query && query.trim() !== ''){
            await connectDb()

            const productFilter = {
                $or : [
                    { productName : { $regex : query, $options : "i"}} ,
                    { productType : { $regex : query, $options : "i"}} ,
                    { productCategory : { $regex : query, $options : "i"}} ,
                ]
            }

            const productResults = await Product.find(productFilter)
            if(productResults.length === 0){
            return new Response(JSON.stringify({details : productResults }), {status : 200})
            }
            return new Response({ statuscode : 400, message : "No products found"})
        }
    } catch (error) {
        return new Response({
            statuscode : 500,
            message : error.message
        })
    }
}