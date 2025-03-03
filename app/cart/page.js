"use client";
import CartItems from "@/components/elements/CartItems";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { auth } from "@/lib/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  useDeleteCartItemMutation,
  useFetchCartQuery,
  useFetchStockMutation,
  useUpdateCartMutation,
} from "@/features/api/cartApi";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { toast } from "react-toastify";
import Preloader from "@/components/elements/Preloader";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { cart } = useSelector((state) => state.shop) || {};
  const { userId } = useAuth();
  const [stockValue] = useFetchStockMutation();
  const [stock, setStock] = useState(null);
  const router = useRouter();
  const [updateQuantity, { loading: quanLoading, error }] =
    useUpdateCartMutation();

  const [deleteCartItem, { error: deleteCartError }] =
    useDeleteCartItemMutation();

  const {
    data: cartItems,
    isLoading,
    isError,
    refetch,
  } = useFetchCartQuery(userId);
  if (isLoading) {
    return <Preloader />;
  }
  let total = 0;
  cartItems?.forEach((item) => {
    const price = item.quantity * item.productPrice;
    total = total + price;
  });
  let shipping = 50
  if(shipping < total){
    total = total + shipping
  }
  const handleQuantityChange = async (id, quantity) => {
    try {
      console.log("Update Request:", { id, quantity });
      const response = await updateQuantity({ id, quantity });

      console.log("Update Response:", response);

      if (response.error) {
        console.error("Detailed Error:", response.error);
        toast.error(
          response.error.data?.message || "Failed to update quantity"
        );
      } else {
        toast.success("Quantity updated successfully");
        refetch();
      }
    } catch (error) {
      console.error("Unexpected Error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCartItem(id).unwrap();

      if (response) {
        toast.success("Item removed successfully");
        refetch();
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to remove item");
    }
  };
  return (
    <>
      <Layout headerStyle={3} footerStyle={2}>
  <section className="custom-cart-section">
    <div className="custom-cart-container">
      {/* Desktop Table View */}
      <table className="custom-cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartItems && cartItems.length === 0 ? (
            <tr>
              <td colSpan="5" style={{textAlign: 'center'}}>Your cart is empty</td>
            </tr>
          ) : (
            cartItems?.map((item) => (
              <tr key={item.productId}>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <img 
                      src={item.productImage} 
                      alt={item.productName} 
                      style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px'}}
                    />
                    <div>
                      <div>{item.productName}</div>
                      <div style={{fontSize: '14px', color: '#666'}}>
                        {item.productColor && `Color: ${item.productColor}`}
                        {item.productSize && ` | Size: ${item.productSize}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td>₹{item.productPrice}</td>
                <td>
                  <div className="custom-cart-quantity">
                    <button 
                      className="custom-cart-quantity-btn"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      className="custom-cart-quantity-btn"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    >+</button>
                  </div>
                </td>
                <td>₹{(item.productPrice * item.quantity).toFixed(2)}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(item.productId)}
                    style={{color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer'}}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="custom-cart-mobile-view">
        {cartItems && cartItems.length === 0 ? (
          <div className="custom-cart-mobile-card">Your cart is empty</div>
        ) : (
          cartItems?.map((item) => (
            <div key={item.productId} className="custom-cart-mobile-card">
              <div className="custom-cart-mobile-content">
                <img 
                  src={item.productImage} 
                  alt={item.productName}
                  className="custom-cart-mobile-image"
                />
                <div className="custom-cart-mobile-details">
                  <h3 style={{margin: '0 0 8px 0'}}>{item.productName}</h3>
                  <div style={{color: '#666', marginBottom: '12px'}}>
                    {item.productColor && `Color: ${item.productColor}`}
                    {item.productSize && ` | Size: ${item.productSize}`}
                  </div>
                  <div className="custom-cart-quantity" style={{marginBottom: '12px'}}>
                    <button 
                      className="custom-cart-quantity-btn"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    >-</button>
                    <span>{item.quantity}</span>
                    <button 
                      className="custom-cart-quantity-btn"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    >+</button>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>₹{(item.productPrice * item.quantity).toFixed(2)}</div>
                    <button 
                      onClick={() => handleDelete(item.productId)}
                      style={{color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer'}}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
        {/* Coupon Section */}
        {/* <div className="custom-cart-coupon">
          <h3 className="custom-cart-summary-title">Have a Coupon?</h3>
          <input
            type="text"
            className="custom-cart-coupon-input"
            placeholder="Enter coupon code"
          />
          <button className="custom-cart-coupon-btn">
            Apply Coupon
          </button>
        </div> */}

        {/* Summary Section */}
        <div className="custom-cart-summary">
          <h3 className="custom-cart-summary-title">Cart Summary</h3>
          <div className="custom-cart-summary-row">
            <span>Subtotal</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="custom-cart-summary-row">
            <span>Shipping</span>
            <span>₹50</span>
          </div>
          <div className="custom-cart-summary-row" style={{borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '12px'}}>
            <span style={{fontSize: '18px', fontWeight: '600'}}>Total</span>
            <span style={{fontSize: '18px', fontWeight: '600', color: 'green'}}>₹{total.toFixed(2)}</span>
          </div>
          <Link href="/checkout">
            <button className="custom-cart-checkout-btn">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  </section>
</Layout>
    </>
  );
}
