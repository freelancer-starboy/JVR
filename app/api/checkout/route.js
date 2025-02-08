import connectDb from "@/lib/database/db";
import Checkout from "@/lib/Schema/checkoutSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, cartItems, shippingAddress, paymentDetails, orderTotal, orderStatus } = body;

    // Validate required fields
    if (!userId || !cartItems?.length || !shippingAddress || !paymentDetails || !orderTotal) {
      return new Response(
        JSON.stringify({ message: "Invalid input: Ensure all required fields are provided." }),
        { status: 400 }
      );
    }

    // Optional: Additional validation for nested fields
    for (const item of cartItems) {
      if (!item.productId || !item.productName || !item.quantity || !item.price) {
        return new Response(
          JSON.stringify({ message: "Invalid cart item structure. Ensure all fields are present." }),
          { status: 400 }
        );
      }
    }

    // Connect to the database
    await connectDb();

    // Create and save the checkout document
    const newCheckout = new Checkout({
      userId,
      cartItems,
      shippingAddress,
      paymentDetails,
      orderTotal,
      orderStatus : orderStatus || 'Processing',
    });

    const savedCheckout = await newCheckout.save();

    return new Response(
      JSON.stringify({ message: "Checkout saved successfully.", data: savedCheckout }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving checkout:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error", error: error.message }),
      { status: 500 }
    );
  }
}


export async function GET(req){
  const {searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if(!id){
    return new Response(JSON.stringify({message : "User Id not found"}), {status : 500})
  }
  try {
    await connectDb()
      const response = await Checkout.find({
        userId : id
      }).sort({ createdAt: -1 })
      if(!response){
        return new Response(JSON.stringify({message : "Checkout not found"}), {status : 404})
      }
      return new Response(JSON.stringify(response), {status : 200})
  } catch (error) {
    return new Response(JSON.stringify({message : error.message}), {status : 500})
  }
}