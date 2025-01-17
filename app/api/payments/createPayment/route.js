import Razorpay from "razorpay";

export async function POST(req) {
  const body = await req.json(); // Parse incoming request body
  
  try {
    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: "rzp_test_VYuZWJPpXhlvvU", 
      key_secret: "xg3fbZUmKMmX2kdbwETi01Dj", 
    });

    // Extract order details from request body
    const { amount, currency, receipt, notes } = body;

    // Create an order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in smallest currency unit (e.g., paise for INR)
      currency: currency || "INR",
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    });

    // Return the order details
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create Razorpay order" }),
      { status: 500 }
    );
  }
}
