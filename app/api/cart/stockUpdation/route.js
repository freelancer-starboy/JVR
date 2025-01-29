import connectDb from "@/lib/database/db";
import Product from "@/lib/Schema/productSchema";

export async function POST(req) {
    try {
        // Connect to the database
        await connectDb();

        // Get the request body (cart items)
        const cartItems = await req.json();
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return new Response(JSON.stringify({ message: "Invalid cart items" }), { status: 400 });
        }

        let updatedProducts = [];
        for (const { variantId, size, quantity } of cartItems) {
            // Step 1: Find the product that contains the variant (by variantId)
            const productData = await Product.findOne({ "productVariants._id": variantId });

            if (!productData) {
                return new Response(JSON.stringify({ message: 'Product not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Step 2: Find the specific variant within the product (by variantId)
            const variant = productData.productVariants.find(variant => variant._id.toString() === variantId);

            if (!variant) {
                return new Response(JSON.stringify({ message: 'Variant not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Step 3: Find the selected size within the selected variant
            const sizeItem = variant.sizes.find(sizeItem => sizeItem.size.trim() === size.trim());

            if (!sizeItem) {
                return new Response(JSON.stringify({ message: 'Size not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Step 4: Update the stock for the size within the selected variant
            const updatedProduct = await Product.findOneAndUpdate(
                { "productVariants._id": variantId, "productVariants.sizes.size": size },
                { $inc: { "productVariants.$.sizes.$[elem].stock": -quantity } },
                { 
                    new: true, 
                    arrayFilters: [{ "elem.size": size }] 
                }
            );

            updatedProducts.push(updatedProduct);
        }

        // Step 5: Return the updated products after all items are processed
        return new Response(JSON.stringify({ updatedProducts }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        // Log and handle errors
        console.error("Error updating stock:", error);
        return new Response(JSON.stringify({ message: 'Error occurred while updating stock' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
