import Razorpay from "razorpay";

export async function POST(req) {
  try {
    // Parse the request body
    const { paymentId } = await req.json();

    // Check if paymentId is provided
    if (!paymentId) {
      return new Response(
        JSON.stringify({ error: "Payment ID is required" }),
        { status: 400 }
      );
    }

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: "rzp_test_VYuZWJPpXhlvvU", // Your Razorpay Key ID from environment variables
      key_secret: "xg3fbZUmKMmX2kdbwETi01Dj", // Your Razorpay Key Secret from environment variables
    });

    // Fetch payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(paymentId);
    console.log("Payment Details fom backend:", paymentDetails);
    // Respond with the payment details
    return new Response(
      JSON.stringify({
        transaction_id: paymentDetails.id,
        status: paymentDetails.status,
        method: paymentDetails.method,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        created_at: paymentDetails.created_at,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch payment details" }),
      { status: 500 }
    );
  }
}
