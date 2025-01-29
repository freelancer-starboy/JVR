import Razorpay from "razorpay";
import crypto from "crypto";

function validateAmount(amount) {
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error("Invalid amount");
  }
  return numAmount;
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.amount) {
      return new Response(
        JSON.stringify({ error: "Amount is required" }),
        { status: 400 }
      );
    }

    // Validate amount
    let amount;
    try {
      amount = validateAmount(body.amount);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
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

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET, // ✅ Fixed
    });

    const orderData = {
      amount: amount * 100,
      currency: body.currency || "INR",
      receipt: `receipt_${Date.now()}`,
      notes: body.notes || {},
      partial_payment: false,
    };

    let retries = 3;
    let order;

    while (retries > 0) {
      try {
        order = await razorpay.orders.create(orderData);
        break;
      } catch (error) {
        console.error("Error creating order, retries left:", retries, error);
        retries--;
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return new Response(
      JSON.stringify({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return new Response(
      JSON.stringify({
        error: "Payment initialization failed",
        code: "PAYMENT_INIT_ERROR",
      }),
      { status: 500 }
    );
  }
}
