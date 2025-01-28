'use client'
import React, { useEffect, useReducer, useState } from 'react';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';
import Router from 'next/router';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDeleteCartMutation } from '@/features/api/checkout';
import { useAuth } from '@/components/AuthContent/AuthContent';

const OrderSuccess = () => {
  const [showContent, setShowContent] = useState(false);
  const [orderId, setOrderId] = useState('');
  const searchParams = useSearchParams()
  const [deleteCart] = useDeleteCartMutation()
  const { userId } = useAuth()
  useEffect(() => {
    const transactionId = searchParams.get('transactionId');

    if (transactionId) {
      setOrderId(transactionId);
      setShowContent(true);
    }
    const DeleteCart = async() => {
      await deleteCart(userId).unwrap()
      console.log("Cart Cleared successfully")
    }
    DeleteCart()
  }, [searchParams, userId, deleteCart])
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
            <p className="custom-success-label">Estimated Delivery Date</p>
            <p className="custom-success-value">
              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="custom-success-actions">
          <button 
            onClick={() => router.push('/orders')}
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