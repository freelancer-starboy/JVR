import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function PaymentPage({ 
  amount, 
  onPaymentSuccess, 
  setTransactionId, 
  setStatus, 
  setMethod 
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          setError('Failed to load payment gateway. Please refresh the page.');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();

    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate amount
      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      // Create order
      const response = await fetch('/api/payments/createPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseInt(amount),
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: { purpose: 'Test Payment' },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await response.json();

      if (!order.id) {
        throw new Error('Invalid order response');
      }

      // Configure Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'JVR Textiles',
        description: 'Test Transaction',
        order_id: order.id,
        handler: async function (response) {
          console.log("Razorpay Response:", response);
  console.log("Order ID:", order.id);
  if (!response.razorpay_payment_id || !order.id || !response.razorpay_signature) {
    console.error("Missing payment details:", response);
    setError("Payment verification parameters are missing. Please try again.");
    return;
  }
          try {
            const verifyResponse = await fetch('/api/payments/verifyPayment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: order.id,
                razorpay_signature: response.razorpay_signature 
              }),
              
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const data = await verifyResponse.json();
            
            setTransactionId(data.transaction_id);
            setStatus(data.status);
            setMethod(data.method);
            onPaymentSuccess(true);

          } catch (error) {
            console.error('Verification error:', error);
            setError('Payment verification failed. Please contact support.');
            onPaymentSuccess(false);
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9344934224',
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        setError('Payment failed. Please try again.');
        onPaymentSuccess(false);
        setIsLoading(false);
      });

      rzp.open();

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
      onPaymentSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
       {error && (
  <div className="w-full p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50">
    <div className="flex items-center">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <span>{error}</span>
    </div>
  </div>
)}
      
      <button
        onClick={handlePayment}
        disabled={isLoading || !isScriptLoaded}
        style={{ border: '1px solid red', background: 'lightblue' }}
        className={`tp-btn tp-color-btn w-100 banner-animation text-black
          ${isLoading || !isScriptLoaded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}
          transition-colors duration-200 flex items-center justify-center space-x-2`}
        
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{isLoading ? 'Processing...' : 'Pay with Razorpay'}</span>
      </button>
    </div>
  );
}