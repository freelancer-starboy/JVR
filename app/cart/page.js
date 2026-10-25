"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import {
  useDeleteCartItemMutation,
  useFetchCartQuery,
  useUpdateCartMutation,
} from "@/features/api/cartApi";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { toast } from "react-toastify";
import Preloader from "@/components/elements/Preloader";
import WhatsAppOrderButton from "@/components/whatsapp/WhatsAppOrderButton";
import { cartItemsToOrderItems } from "@/lib/whatsapp";
import { CHECKOUT_ENABLED } from "@/lib/siteConfig";

export default function Cart() {
  const { userId, isAuthLoading } = useAuth();
  const [updateQuantity] = useUpdateCartMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();

  const { data, isLoading } = useFetchCartQuery(userId, { skip: !userId });
  const cartItems = Array.isArray(data) ? data : [];

  if (isAuthLoading || isLoading) {
    return <Preloader />;
  }

  const Subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.productPrice, 0);
  const shipping = cartItems.length > 0 ? 50 : 0;
  const total = Subtotal + shipping;

  const handleQuantityChange = async (item, quantity) => {
    if (quantity < 1) return handleDelete(item.productId);
    if (item.productStock && quantity > item.productStock) {
      toast.error(`Only ${item.productStock} left in stock`);
      return;
    }
    try {
      await updateQuantity({ id: item.productId, quantity, userId }).unwrap();
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error(error?.data?.message || "Failed to update quantity");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCartItem({ id, userId }).unwrap();
      toast.success("Item removed successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to remove item");
    }
  };

  const itemKey = (item) => `${item.productId}-${item.productSize}-${item.productColor}`;

  return (
    <>
      <Layout headerStyle={3} footerStyle={2}>
        <section className="custom-cart-section">
          <div className="custom-cart-container">
            {cartItems.length === 0 ? (
              <div className="jvr-empty-state">
                <i className="fal fa-shopping-bag" />
                <h3>Your cart is empty</h3>
                <p>Explore our collection and add something you love.</p>
                <Link href="/shop-2" className="tpcheck-btn d-inline-block">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
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
                    {cartItems.map((item) => (
                      <tr key={itemKey(item)}>
                        <td>
                          <Link href={`/ShopDetails/${item.productId}`} className="jvr-cart-product">
                            <img src={item.productImage} alt={item.productName} />
                            <div>
                              <div className="jvr-cart-product__name">{item.productName}</div>
                              <div className="jvr-cart-product__meta">
                                Color:
                                <span
                                  className="jvr-color-dot"
                                  style={{ backgroundColor: item.productColor }}
                                  title={item.productColor}
                                />
                                {item.productSize && `| Size: ${item.productSize}`}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td>₹{item.productPrice}</td>
                        <td>
                          <div className="custom-cart-quantity">
                            <button
                              className="custom-cart-quantity-btn"
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >-</button>
                            <span>{item.quantity}</span>
                            <button
                              className="custom-cart-quantity-btn"
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >+</button>
                          </div>
                        </td>
                        <td>₹{(item.productPrice * item.quantity).toFixed(2)}</td>
                        <td>
                          <button onClick={() => handleDelete(item.productId)} className="jvr-link-danger">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile View */}
                <div className="custom-cart-mobile-view">
                  {cartItems.map((item) => (
                    <div key={itemKey(item)} className="custom-cart-mobile-card">
                      <div className="custom-cart-mobile-content">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          className="custom-cart-mobile-image"
                        />
                        <div className="custom-cart-mobile-details">
                          <h3 style={{ margin: "0 0 8px 0" }}>{item.productName}</h3>
                          <div style={{ color: "#666", marginBottom: "12px" }}>
                            {item.productColor && `Color: ${item.productColor}`}
                            {item.productSize && ` | Size: ${item.productSize}`}
                          </div>
                          <div className="custom-cart-quantity" style={{ marginBottom: "12px" }}>
                            <button
                              className="custom-cart-quantity-btn"
                              onClick={() => handleQuantityChange(item, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >-</button>
                            <span>{item.quantity}</span>
                            <button
                              className="custom-cart-quantity-btn"
                              onClick={() => handleQuantityChange(item, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >+</button>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>₹{(item.productPrice * item.quantity).toFixed(2)}</div>
                            <button onClick={() => handleDelete(item.productId)} className="jvr-link-danger">
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                  {/* Summary Section */}
                  <div className="custom-cart-summary">
                    <h3 className="custom-cart-summary-title">Cart Summary</h3>
                    <div className="custom-cart-summary-row">
                      <span>Subtotal</span>
                      <span>₹{Subtotal.toFixed(2)}</span>
                    </div>
                    <div className="custom-cart-summary-row">
                      <span>Shipping</span>
                      <span>₹{shipping}</span>
                    </div>
                    <div className="custom-cart-summary-row" style={{ borderTop: "1px solid #eee", paddingTop: "12px", marginTop: "12px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "600" }}>Total</span>
                      <span style={{ fontSize: "18px", fontWeight: "600", color: "green" }}>₹{total.toFixed(2)}</span>
                    </div>
                    {CHECKOUT_ENABLED ? (
                      <Link href="/checkout">
                        <button className="custom-cart-checkout-btn">
                          Proceed to Checkout
                        </button>
                      </Link>
                    ) : (
                      <>
                        <WhatsAppOrderButton
                          source="cart"
                          items={cartItemsToOrderItems(cartItems)}
                          className="w-100"
                        />
                        <p className="jvr-whatsapp-note">
                          No address or payment needed here — our team will confirm your order,
                          delivery and payment with you on WhatsApp.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}
