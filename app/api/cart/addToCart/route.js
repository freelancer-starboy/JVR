import Cart from "@/lib/Schema/cartSchema";
import Product from "@/lib/Schema/productSchema";
import connectDb from "@/lib/database/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, productId, quantity, size, color } = body;
    const parsedQuantity = parseInt(quantity, 10);
    // Validate the input
    if (!userId || !productId || isNaN(parsedQuantity)) {
      return new Response(JSON.stringify({ message: "Invalid input" }), { status: 400 });
    }

    // Connect to MongoDB
    await connectDb();

    // Fetch product details by productId
    const product = await Product.findById(productId);
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new one with an empty items array
      cart = new Cart({
        userId,
        items: [{ 
          productId: product._id,
          productName: product.productName,
          productPrice: product.productPrice,
          productImage: product.productImage[0],
          productColor: color,
          productSize: size,
          quantity: parsedQuantity,

        }],
      });
    } else {
      // Ensure that cart.items is initialized as an array if it's undefined
      if (!Array.isArray(cart.items)) {
        cart.items = [];
    }

      // If cart exists, check if the product is already in the cart
      const existingProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);
      
      if (existingProductIndex > -1) {
        // If product exists, update the quantity
        cart.items[existingProductIndex].quantity += parsedQuantity;
      } else {
        // If it's a new product, add it to the cart
        cart.items.push({
          productId: product._id,
          productName: product.productName,
          productPrice: product.productPrice,
          productImage: product.productImage[0],
          productColor: color,
          productSize: size,
          quantity: parsedQuantity

        });
      }
    }

    // Update the timestamp for cart modification
    cart.updatedAt = new Date();

    // Save the updated cart
    await cart.save();

    // Return the updated cart as a response
    return new Response(JSON.stringify({message: "Item added to cart successfully", cart}), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Cart error:", error);
    return new Response(
        JSON.stringify({ 
            message: error.message || "Failed to add item to cart" 
        }), 
        { status: 500 }
    );
  }
} 



export async function PUT(req){
  try {
    
    const cartItems = await req.json()
    if(!Array.isArray(cartItems) || cartItems.length === 0){
      return new Response(JSON.stringify({message : "Invalid cart items"}), {status : 400})
    }
    await connectDb()
    let updatedProducts = []
    for( const { productId, quantity} of cartItems){
      const updatedProduct = await Product.findOneAndUpdate({ _id : productId}, { $inc: {productStock : -quantity}}, {new : true})
      updatedProducts.push(updatedProduct)
    }
    
        return new Response(JSON.stringify({ message : "Stock updated successfully", updatedProducts}), { status: 200 });
    
  } catch (error) {
      return new Response(
        JSON.stringify({ message : error.message}), { status : 500}
      )
  }
}