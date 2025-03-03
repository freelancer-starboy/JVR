"use client";
import Address from "@/components/Address/Address";
import { useAuth } from "@/components/AuthContent/AuthContent";
import Preloader from "@/components/elements/Preloader";
import Layout from "@/components/layout/Layout";
import Loader from "@/components/Loader/page";
import PaymentPage from "@/components/paymentSample/PaymentPage";
import {
  useDeleteCartItemMutation,
  useFetchCartQuery,
  useFetchStockMutation,
  useUpdateCartMutation,
} from "@/features/api/cartApi";
import {
  useCreateCheckoutMutation,
  useDeleteCartMutation,
  useStockValidationMutation,
  useUpdateStockMutation,
} from "@/features/api/checkout";
import { set } from "mongoose";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export default function Checkout() {
  const [successOrder, setSuccessOrder] = useState(false);
  const [isLoginToggle, setLoginToggle] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [status, setStatus] = useState(null);
  const [method, setMethod] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [stockValue, setStockValue] = useState(null);
  const [deleteCartItems] = useDeleteCartItemMutation();
  const [updateCart] = useUpdateCartMutation();
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [details, setDetails] = useState([]);
  const [orderTotal, setOrderTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [isCuponToggle, setCuponToggle] = useState(false);
  const handleCuponToggle = () => setCuponToggle(!isCuponToggle);
  const [appliedCoupons, setAppliedCoupons] = useState([]);

  const [isCboxToggle, setCboxToggle] = useState(false);
  const handleCboxToggle = () => setCboxToggle(!isCboxToggle);

  const [createCheckout] = useCreateCheckoutMutation();
  const [isShipToggle, setShipToggle] = useState(false);
  const handleShipToggle = () => setShipToggle(!isShipToggle);

  const [isActive, setIsActive] = useState({
    status: false,
    key: 1,
  });

  const router = useRouter();
  const { userId } = useAuth();
  const {
    data: cartItems,
    isLoading,
    isError,
    refetch,
  } = useFetchCartQuery(userId);

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const newTotal = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.productPrice,
        0
      );
      setTotal(newTotal);
      setOrderTotal(newTotal + shipping);
    } else {
      setShipping(0);
      setTotal(0);
      setOrderTotal(0);
    }
  }, [cartItems, shipping]);

  useEffect(() => {
    if (cartItems && cartItems.length > 0 && shipping === 0) {
      setShipping(50);
    }
  }, [cartItems]);
  const [updateStockValue, { loading, error }] = useFetchStockMutation();

  const [validStock] = useStockValidationMutation();

  useEffect(() => {
    if (cartItems) {
      const validateStock = async () => {
        setLoadingScreen(true);
        try {
          const response = await validStock(cartItems).unwrap();
          setStockValue(response);
          ``;
        } catch (error) {
          console.error("Error validating stock:", error);
        } finally {
          setLoadingScreen(false);
        }
      };
      validateStock();
    }
  }, [cartItems, validStock]);
  const [deleteCart] = useDeleteCartMutation();

  useEffect(() => {
    setLoadingScreen(true);
    if (successOrder) {
      const updateStock = async () => {
        try {
          const stockUpdateData = cartItems.map((item) => ({
            variantId: item.variantId,
            size: item.productSize,
            quantity: item.quantity,
          }));
          const response = await updateStockValue(stockUpdateData).unwrap();
          console.log("Stock update success:", response);
          // Log the success response for debugging
          await updateCheckout();
          await deleteCart(userId).unwrap();
          // Show success toast and navigate to the success page
          toast.success("Order Placed Successfully");
          router.push(`/myOrders?transactionId=${transactionId}`);
        } catch (error) {
          // Handle error case and show appropriate error message
          console.error("Error updating stock:", error); // Log full error for debugging
          toast.error(error?.data?.message || "Error updating stock");
        } finally {
          // Reset the successOrder flag in both success and failure cases
          setSuccessOrder(false);
          setLoadingScreen(false);
        }
      };

      updateStock();
    }
  }, [successOrder, cartItems]);
  useEffect(() => {
    if (cartItems) {
      console.log("Cart Items:", cartItems);
    }
  }, [cartItems]);
  const updateCheckout = async () => {
    try {
      const response = await createCheckout({
        userId,
        cartItems,
        details,
        method,
        transactionId,
        status,
        orderTotal,
      }).unwrap();
      console.log("Checkout saved successfully", response);
    } catch (err) {
      console.error("Checkout failed:", err);
      toast.error("Failed to save order checkout");
    }
  };
  if (isLoading) {
    return <Preloader />;
  }
  if (isError) {
    return <Preloader />;
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (isCouponApplied) {
      toast.error("Coupon already applied");
      return;
    }
    if (couponCode === "WELCOMEJVR") {
      setShipping(0);
      toast.success("Coupon applied successfully!");
      setIsCouponApplied(true);
      setAppliedCoupons([...appliedCoupons, couponCode]);
    } else {
      toast.error("Invalid Coupon Code");
    }
  };

  const isDetailsEmpty = details?.length != 0;

  const getStockStatus = (item) => {
    if (!stockValue) {
      return { stock: null, message: "Stock info unavailable" };
    }

    const itemId = item.variantId || item.productId;
    const itemSize = item.size || item.productSize;

    // Check in stock array
    const inStockItem = stockValue.stock.find(
      (stock) => stock.variantId === itemId && stock.productSize === itemSize
    );

    if (inStockItem) {
      return {
        stock: inStockItem.stock,
        message: `${inStockItem.stock} left!`,
      };
    }

    // Check in outOfStockItems array
    const outOfStockItem = stockValue.outOfStockItems.find(
      (outOfStock) =>
        outOfStock.variantId === itemId && outOfStock.productSize === itemSize
    );

    if (outOfStockItem) {
      return { stock: 0, message: outOfStockItem.message }; // Returning 0 stock for out-of-stock items
    }

    return {
      stock: null,
      message: `No stock info available for size ${itemSize}`,
    };
  };

  if (isLoading) {
    return <div>Loading stock information...</div>;
  }

  // if (!stockValue) {
  //   return <div>Error loading stock information</div>;
  // }

  const handleRemoveCart = async (id) => {
    try {
      const response = await deleteCartItems(id).unwrap();
      if (response) {
        toast.success("Item removed successfully");
        window.location.reload();
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to remove item");
    }
  };
  const handleUpdateCart = async (e, id, quantity) => {
    e.preventDefault();
    try {
      const response = await updateCart({ id, quantity });
      if (response.error) {
        toast.error(
          response.error.data?.message || "Failed to update quantity"
        );
      } else {
        toast.success("Quantity updated successfully");
        window.location.reload();
      }
    } catch {
      console.error("Unexpected Error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const allItemsInStock = cartItems.every((item) => {
    const { stock } = getStockStatus(item);
    return stock !== null && stock >= item.quantity;
  });

  const handleAddressChoose = (address) => {
    console.log("Selected address from front:", address);
    setDetails(address);
  };
  return (
    <>
      <Layout headerStyle={3} footerStyle={2}>
        {loadingScreen && <Loader />}
        <div className="custom-checkout-container">
          <section className="custom-checkout-main">
            {/* <form className="custom-checkout-form"> */}
            <div className="custom-checkout-grid">
              <Address
                userId={userId}
                handleAddressChoose={handleAddressChoose}
              />

              {/* Checkout form */}

              {/* Checkout end */}

              <div className="custom-checkout-order-summary">
                <h3 className="custom-checkout-section-title">Your Order</h3>
                <div className="custom-checkout-order-table">
                  <table className="custom-checkout-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems?.map((item) => {
                        const { stock, message } = getStockStatus(item);
                        return (
                          <tr
                            key={`${item.productId || item.variantId}-${
                              item.size || item.productSize
                            }`}
                          >
                            <td className="custom-checkout-product-cell">
                              <span className="custom-checkout-product-name">
                                {item.productName}
                              </span>
                              <span className="custom-checkout-product-quantity">
                                × {item.quantity}
                              </span>
                              <span className="custom-checkout-stock-status">
                                {message}
                              </span>
                            </td>
                            <td className="custom-checkout-price-cell">
                              <span className="custom-checkout-amount">
                                ₹ {item.productPrice}
                              </span>
                              {stock === 0 && (
                                <button
                                  className="custom-checkout-remove-button"
                                  onClick={() =>
                                    handleRemoveCart(item.productId)
                                  }
                                >
                                  Remove
                                </button>
                              )}
                              {stock !== null &&
                                stock > 0 &&
                                stock < item.quantity && (
                                  <div className="custom-checkout-quantity-update">
                                    <select
                                      className="custom-checkout-select"
                                      value={quantity}
                                      onChange={(e) =>
                                        setQuantity(Number(e.target.value))
                                      }
                                    >
                                      <option value="" disabled>
                                        Select Quantity
                                      </option>
                                      {Array.from({ length: stock }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                          {i + 1}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      className="custom-checkout-update-button"
                                      onClick={(e) =>
                                        handleUpdateCart(
                                          e,
                                          item.productId,
                                          quantity
                                        )
                                      }
                                    >
                                      Update Quantity
                                    </button>
                                  </div>
                                )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>Cart Subtotal</th>
                        <td>₹ {total}</td>
                      </tr>
                      <tr>
                        <th>Shipping</th>
                        <td>₹ {shipping}</td>
                      </tr>
                      <tr className="custom-checkout-order-total">
                        <th>Order Total</th>
                        <td>₹ {orderTotal}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="custom-checkout-payment">
                  {isDetailsEmpty ? (
                    <div className="custom-checkout-payment-button">
                      {allItemsInStock ? (
                        orderTotal <= 0 ? (
                          <div>
                            <button
                              type="button"
                              className="custom-checkout-button custom-checkout-button-disabled"
                              disabled
                            >
                              Add Products to Bag
                            </button>
                          </div>
                        ) : (
                          <PaymentPage
                            amount={orderTotal}
                            onPaymentSuccess={setSuccessOrder}
                            transactionId={transactionId}
                            setTransactionId={setTransactionId}
                            setStatus={setStatus}
                            setMethod={setMethod}
                          />
                        )
                      ) : (
                        <button
                          type="button"
                          className="custom-checkout-button custom-checkout-button-disabled"
                          disabled
                        >
                          Some items are out of stock
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="custom-checkout-payment-button">
                      <button type="submit" className="custom-checkout-button">
                        Pick an address
                      </button>
                    </div>
                  )}
                  <div className="custom-checkout-coupon-section"></div>
                  <div className="custom-checkout-accordion my-2">
                    <h3 className="custom-checkout-accordion-title">
                      Have a coupon?{" "}
                      <span
                        className="custom-checkout-link"
                        onClick={handleCuponToggle}
                      >
                        Click here to enter your code
                      </span>
                    </h3>
                    {isCuponToggle && (
                      <div className="custom-checkout-coupon-content">
                        <form className="custom-checkout-form">
                          <div className="custom-checkout-coupon-row">
                          <div class="custom-coupon-container">
  <input
    type="text"
    class="custom-coupon-input form-control"
    placeholder="Coupon Code"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value)}
  />

  {isCouponApplied && (
    <div class="custom-coupon-applied-container mt-2 d-flex align-items-center">
      <span class="custom-coupon-badge me-2 badge bg-success">{appliedCoupons}</span>
      <span
        class="custom-coupon-remove-btn badge bg-danger d-flex align-items-center justify-content-center"
        style={{ width: '22px', height: '22px', cursor: 'pointer', padding: '0' }}
        onClick={() => {
          setIsCouponApplied(false);
          setCouponCode('');
          setShipping(50);
        }}
      >
        ✖
      </span>
    </div>
  )}
</div>

                            <button
                              className="custom-checkout-button"
                              onClick={(e) => handleApplyCoupon(e)}
                            >
                              Apply Coupon
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* </form> */}
          </section>
        </div>
      </Layout>
    </>
  );
}
