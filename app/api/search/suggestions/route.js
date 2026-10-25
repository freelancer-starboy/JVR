import connectDb from "@/lib/database/db"
import Product from "@/lib/Schema/productSchema"

export const dynamic = "force-dynamic";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// GET /api/search/suggestions?searchQuery=... -> { words: [...] }
// Without a query, returns the product types in the catalogue (used as "trending" searches).
export async function GET(req){
    try {
        const { searchParams } = new URL(req.url)
        const query = (searchParams.get('searchQuery') || '').trim()
        await connectDb()

        const filter = query && query !== 'undefined'
            ? { productType : { $regex : escapeRegex(query), $options : "i" } }
            : {}
        const types = await Product.distinct('productType', filter)
        const words = types.filter(Boolean).slice(0, 10)

        return new Response(JSON.stringify({ words }), { status : 200 })
    } catch (error) {
        return new Response(JSON.stringify({ words : [], message : error.message }), { status : 500 })
    }
}
