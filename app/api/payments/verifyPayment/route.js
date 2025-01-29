import Razorpay from "razorpay";
import crypto from "crypto";

function validateSignature(orderId, paymentId, razorPay_sign) {
  const text = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET) // ✅ Fixed
    .update(text)
    .digest("hex");

  console.log("Expected Signature:", expectedSignature);
  console.log("Received Signature:", razorPay_sign);

  return expectedSignature === razorPay_sign;
}

export async function POST(req) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: "Missing required payment verification parameters" }),
        { status: 400 }
      );
    }

    // 🔥 Ensure environment variables are set
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay environment variables");
      return new Response(
        JSON.stringify({ error: "Payment service is unavailable" }),
        { status: 500 }
      );
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET, // ✅ Fixed
    });

    // Fetch payment details from Razorpay
    let paymentDetails;
    try {
      paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      console.log("Fetched Payment Details:", paymentDetails);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch payment details" }),
        { status: 500 }
      );
    }

    // **Capture the Payment (if needed)**
    if (paymentDetails.status === "authorized") {
      try {
        await razorpay.payments.capture(razorpay_payment_id, paymentDetails.amount);
        console.log("Payment captured successfully");
      } catch (error) {
        console.error("Error capturing payment:", error);
        return new Response(
          JSON.stringify({ error: "Failed to capture payment" }),
          { status: 500 }
        );
      }
    }

    // **Verify Payment Signature**
    const isValidSignature = validateSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValidSignature) {
      console.error("Invalid payment signature");
      return new Response(
        JSON.stringify({ error: "Invalid payment signature" }),
        { status: 400 }
      );
    }

    // **Final Response After Successful Verification**
    return new Response(
      JSON.stringify({
        transaction_id: paymentDetails.id,
        order_id: paymentDetails.order_id,
        status: paymentDetails.status,
        amount: paymentDetails.amount / 100, // Convert from paise to INR
        currency: paymentDetails.currency,
        method: paymentDetails.method,
        created_at: new Date(paymentDetails.created_at * 1000).toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return new Response(
      JSON.stringify({ error: "Payment verification failed", code: "VERIFICATION_ERROR" }),
      { status: 500 }
    );
  }
}
