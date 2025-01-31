'use client'
import React, { useEffect, useReducer, useState } from 'react';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContent/AuthContent';

const OrderSuccess = ({ transactionId}) => {
  const [showContent, setShowContent] = useState(false);
  const [orderId, setOrderId] = useState('');
  const { userId } = useAuth()
  useEffect(() => {

    if (transactionId) {
      setOrderId(transactionId);
      setShowContent(true);
    }
  }, [transactionId, userId])
  const router = useRouter()

  return (
    <div className="custom-success-container">
      <div className={`custom-success-card ${showContent ? 'custom-success-show' : ''}`}>
        {/* Success Icon */}
        <div className="custom-success-icon-container">
          <div className="custom-success-icon-ping" />
          <CheckCircle className="custom-success-icon" />
        </div>
        
        {/* Success Message */}
        <div className="custom-success-message">
          <h1 className="custom-success-title">Order Successful!</h1>
          <p className="custom-success-subtitle">Thank you for your purchase. Your order has been received.</p>
        </div>

        {/* Order Details */}
        <div className="custom-success-details">
          <div className="custom-success-order-number">
            <Package className="custom-success-package-icon" />
            <div>
              <p className="custom-success-label">Order Number</p>
              <p className="custom-success-value">
                {orderId ? `#ORD-${orderId}` : 'Generating...'}
              </p>
            </div>
          </div>
          
          <div className="custom-success-divider" />
          
          <div className="custom-success-delivery">
            <p className="custom-success-label">Trusted Choice</p>
            <p className="custom-success-value" style={{ fontWeight: "300", fontSize: "14px"}}>
            Thank you for your order with JVR Textiles! We appreciate your trust in our products and look forward to serving you again soon.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="custom-success-actions">
          <button 
            onClick={() => router.push('/myOrders')}
            className="custom-success-primary-button"
          >
            View Order Details
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="custom-success-secondary-button"
          >
            <ArrowLeft className="custom-success-arrow-icon" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;