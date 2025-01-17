"use client";

import { useEffect } from "react";

export default function PaymentPage() {
  useEffect(() => {
    // Ensure Razorpay script is loaded
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handlePayment() {
    const response = await fetch("/api/payments/createPayment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 5, // Amount in INR
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { purpose: "Test Payment" },
      }),
    });

    const order = await response.json();

    if (!order.id) {
      alert("Failed to create order. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_VYuZWJPpXhlvvU",
      amount: order.amount,
      currency: order.currency,
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: order.id,
      handler: function (response) {
        console.log("Payment Successful:", response);
        alert(`Payment ID: ${response.razorpay_payment_id}`);
        alert(`Order ID: ${response.razorpay_order_id}`);
        alert(`Signature: ${response.razorpay_signature}`);
      },
      prefill: {
        name: "John Doe",
        email: "john.doe@example.com",
        contact: "9344934224",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      console.error("Payment Failed:", response.error);
      alert("Payment failed. Please try again.");
    });
  }

  return (
    <div>
      <h1>Razorpay Payment Integration</h1>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}
