import connectDb from "@/lib/database/db";
import Product from "@/lib/Schema/productSchema";

export async function POST(req) {
    try {
        // Connect to the database
        await connectDb();

        const body = await req.json();
        // Access cartItems from the body
        const cartItems = body.cartItems;
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return new Response(JSON.stringify({ message: "Invalid cart items" }), { status: 400 });
        }

        let stock = [];
        let outOfStockItems = [];

        for (const { variantId, productSize } of cartItems) {
            // Step 1: Find the product that contains the variant (by variantId)
            const productData = await Product.findOne({ "productVariants._id": variantId });

            if (!productData) {
                outOfStockItems.push({ variantId, message: 'Product not found' });
                continue;  // Skip to the next item if product is not found
            }

            // Step 2: Find the specific variant within the product (by variantId)
            const variant = productData.productVariants.find(variant => variant._id.toString() === variantId);

            if (!variant) {
                outOfStockItems.push({ variantId, message: 'Variant not found' });
                continue;
            }

            // Step 3: Find the selected size within the selected variant
            const sizeItem = variant.sizes.find(sizeItem => sizeItem.size.trim() === productSize.trim());

            if (!sizeItem) {
                outOfStockItems.push({ variantId, size, message: 'Size not found' });
                continue;
            }

            // Step 4: Check stock availability
            if (sizeItem.stock > 0) {
                stock.push({ variantId, productSize, stock: sizeItem.stock });
            } else {
                outOfStockItems.push({ variantId, productSize, message: 'Out of stock' });
            }
        }

        // Step 5: Return the result for all items
        if (stock.length > 0 || outOfStockItems.length > 0) {
            return new Response(
                JSON.stringify({ stock, outOfStockItems }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            return new Response(
                JSON.stringify({ message: "No stock information found" }),
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

    } catch (error) {
        // Log and handle errors
        console.error("Error fetching stock", error);
        return new Response(JSON.stringify({ message: 'Error fetching stock' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

