"use client";

import { set } from "mongoose";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PaymentPage({ amount, onPaymentSuccess, transactionId, setTransactionId, setStatus, setMethod }) {
  const router = useRouter()
  useEffect(() => {
    // Ensure Razorpay script is loaded
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  async function handlePayment(e) {
    e.preventDefault();
    const response = await fetch("/api/payments/createPayment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseInt(amount), // Amount in INR
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
      name: "JVR Textiles",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response) {
        console.log("Payment Successful:", response);
        try {
          const ini = await fetch("/api/payments/verifyPayment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId: response.razorpay_payment_id }),
          })
          const data = await ini.json()
          if (ini.ok) {
            console.log("Transaction Details:", data);
            setTransactionId(data.transaction_id)
            setStatus(data.status)
            setMethod(data.method)
            onPaymentSuccess(true)
            // Redirect to success page with transaction ID
            // router.push(`/success?transactionId=${data.transaction_id}`);
          } else {
            onPaymentSuccess(false)
            console.error("Error:", data.error);
            alert("Failed to fetch transaction details.", data.error);
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
    alert("An unexpected error occurred.");
        }
        
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
      onPaymentSuccess(false)
    });
  }

  return (
    
      <button className="button-razorpay"  onClick={handlePayment}>Pay with RazorPay</button>
    
  );
}
