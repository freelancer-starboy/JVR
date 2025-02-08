import connectDb from "@/lib/database/db";
import Product from "@/lib/Schema/productSchema";

export async function GET(req, { params }) {
    try {
        await connectDb();
        const url = new URL(req.url);
        const category = url.searchParams.get('category');
        let data
        if (category) {
            if(category === "mens" || category === "women" || category === "kids"){
            data = await Product.find({ productCategory: category });
            }else{
                data = await Product.find({ productType : category });
            }
        }else{
            data = await Product.find({});
        }
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
