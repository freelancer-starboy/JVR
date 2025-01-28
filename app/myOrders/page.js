"use client";
import { useAuth } from "@/components/AuthContent/AuthContent";
import Preloader from "@/components/elements/Preloader";
import Layout from "@/components/layout/Layout";
import { useFetchCheckOutQuery } from "@/features/api/checkout";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import OrderSuccess from "../orderSuccess/page";

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
    <Layout headerStyle={5} footerStyle={2}>
      <div className="container p-4 mb-10">
        <h1 className="mb-4">Your Orders</h1>
        {data && data.length > 0 ? (
          <div className="row row-cols-1 g-4">
            {data.map((order) => (
              <div key={order._id} className="col">
                <div className="card">
                  <div className="card-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <span className="me-2">
                        <span className="fw-bold">Order Placed: </span>
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day : '2-digit',
                            month : 'short',
                            year: 'numeric'
                        })}
                      </span>
                      <span className="text-muted">
                        Order ID #-JVR-{order._id.slice(-6)}
                      </span>
                    </div>
                    <div className="fw-bold">
                      <span className="me-2 text-danger">Total: </span>₹
                      {order.orderTotal}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-3">
                        <h6 className="text-muted">Shipping Address</h6>
                        <p>
                          {order.shippingAddress?.addressLine1},{" "}
                          {order.shippingAddress?.addressLine2}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">Payment</h6>
                        <p>
                          {order.paymentDetails?.method?.toUpperCase()} -{" "}
                          {order.paymentDetails?.status}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">Delivery Status</h6>
                        <p className="fw-bold text-success">
                          {order.orderStatus}
                        </p>
                      </div>
                      <div className="col-md-3">
                        <h6 className="text-muted">Expected Delivery</h6>
                        <p className="fw-bold text-success">
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

                    <table className="table table-striped">
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
          <div className="alert alert-info text-center">No Orders Found</div>
        )}
      </div>
    </Layout>
  );
};

export default OrdersPage;
