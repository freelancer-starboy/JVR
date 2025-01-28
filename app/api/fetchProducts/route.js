import connectDb from "@/lib/database/db";
import Product from "@/lib/Schema/productSchema";

export async function GET(req, { params }) {
    try {
        await connectDb();
        const url = new URL(req.url);
        const category = url.searchParams.get('category');

        if (category) {
            const data = await Product.find({ productCategory: category });
            return new Response(JSON.stringify(data), { status: 200 });
        }

        return new Response(JSON.stringify({ message: "Product not found" }), { status: 500 });
    } catch (error) {
        return new Response(JSON.stringify({ message: error.message }), { status: 500 });
    }
}
