"use client";
import { useAuth } from "@/components/AuthContent/AuthContent";
import Preloader from "@/components/elements/Preloader";
import Layout from "@/components/layout/Layout";
import { useFetchCheckOutQuery } from "@/features/api/checkout";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const OrdersPage = () => {
  const { userId, isAuthLoading } = useAuth();
  const router = useRouter()
  const { data, isLoading, refetch } = useFetchCheckOutQuery(userId, {
    skip: !userId,
  });

  useEffect(() => {
    if (!userId && isAuthLoading) {
      router.push('/');
    }
  }, [userId, isAuthLoading, router]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <Layout headerStyle={3} footerStyle={2}>
      <div className="custom-myorders-container">
        <h1 className="custom-myorders-title">Your Orders</h1>
        {data && data.length > 0 ? (
          <div className="custom-myorders-grid">
            {data.map((order) => (
              <div key={order._id} className="custom-myorders-card">
                <div className="custom-myorders-header">
                  <div className="custom-myorders-header-info">
                    <span className="custom-myorders-date">
                      <span className="custom-myorders-label">Order Placed: </span>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="custom-myorders-id">
                      Order ID #-JVR-{order._id.slice(-6)}
                    </span>
                  </div>
                  <div className="custom-myorders-total">
                    <span className="custom-myorders-total-label">Total: </span>₹
                    {order.orderTotal}
                  </div>
                </div>

                <div className="custom-myorders-content">
                  <div className="custom-myorders-info-grid">
                    <div className="custom-myorders-info-item">
                      <h6 className="custom-myorders-info-title">Shipping Address</h6>
                      <p className="custom-myorders-info-text">
                        {order.shippingAddress?.addressLine1},{" "}
                        {order.shippingAddress?.addressLine2}
                      </p>
                    </div>
                    <div className="custom-myorders-info-item">
                      <h6 className="custom-myorders-info-title">Payment</h6>
                      <p className="custom-myorders-info-text">
                        {order.paymentDetails?.method?.toUpperCase()} -{" "}
                        {order.paymentDetails?.status}
                      </p>
                    </div>
                    <div className="custom-myorders-info-item">
                      <h6 className="custom-myorders-info-title">Delivery Status</h6>
                      <p className="custom-myorders-info-text custom-myorders-success">
                        {order.orderStatus}
                      </p>
                    </div>
                    <div className="custom-myorders-info-item">
                      <h6 className="custom-myorders-info-title">Expected Delivery</h6>
                      <p className="custom-myorders-info-text custom-myorders-success">
                        {new Date(
                          new Date(order.createdAt).getTime() +
                          10 * 24 * 60 * 60 * 1000
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="custom-myorders-table-container">
                    <table className="custom-myorders-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.cartItems?.map((product) => (
                          <tr key={product._id}>
                            <td>{product.productName}</td>
                            <td>{product.quantity}</td>
                            <td>₹{product.price}</td>
                            <td>₹{product.price * product.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="custom-myorders-empty">No Orders Found</div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;