import connectDb from "@/lib/database/db"
import Product from "@/lib/Schema/productSchema"
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: "drojxcxa1",
  api_key: "316898787323286",
  api_secret: "en2gIyAB52RDFk7d3VN9K0ua3LM",
});
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const query = searchParams.get('searchQuery')

        console.log(query)

        if(query && query.trim() !== ''){
            await connectDb()
            
            // Product search filter
            const productFilter = {
                $or : [
                    { productName : { $regex : query, $options : "i"}},
                    { productType : { $regex : query, $options : "i"}},
                    { productCategory : { $regex : query, $options : "i"}},
                ]
            }
            
            // Find matching products
            const productResults = await Product.find(productFilter)
            
            // Generate word search suggestions
            const wordSuggestions = generateWordSuggestions(query)
            
            
            // Combine results
            return new Response(JSON.stringify({
                products: productResults || [],
                wordSuggestions: wordSuggestions || []
            }), {status : 200})
        }
        
        return new Response(JSON.stringify({
            products: [],
            wordSuggestions: []
        }), {status : 200})
    } catch (error) {
        return new Response(JSON.stringify({message : error.message}), {status : 500})
    }
}

function generateWordSuggestions(query) {

    
    const baseWords = [
        "cotton shirt", "chinese collar shirt", "oversized shirt", "party wear", "tshirt",
        "oversized tshirt", "printed tshirt", "collar tshirt", "round neck tshirt",
        "pant", "formal pant", "cotton pant", "jean pant", "carrot fit pant", "cargo pant", "slim fit pant",
        "saree", "top", "leggings", "pattiyala", "frock", "lehenga", "kurthi",
        "vesti shirt set", "half pant", "papaku", "fork"
    ];
    
    // Filter words that contain the query
    const exactMatches = baseWords.filter(word => 
        word.toLowerCase().includes(query.toLowerCase())
    )
    
    // Generate variations like "query + common words"
    const variations = [
        `all ${query} in categories`,
        `new ${query} collection`,
        `${query} on sale`
    ];
    
    // Combine and return up to 5 suggestions
    return [...exactMatches, ...variations].slice(0, 5)
}