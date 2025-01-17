import connectDb from "@/lib/database/db";
import Checkout from "@/lib/Schema/checkoutSchema";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, cartItems, shippingAddress, paymentDetails, orderTotal, orderStatus } = body;

    // Validate required fields
    if (!userId || !cartItems?.length || !shippingAddress || !paymentDetails || !orderTotal || !orderStatus) {
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
      orderStatus,
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
