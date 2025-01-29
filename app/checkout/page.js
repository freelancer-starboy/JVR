"use client";
import { useAuth } from "@/components/AuthContent/AuthContent";
import Preloader from "@/components/elements/Preloader";
import Layout from "@/components/layout/Layout";
import Loader from "@/components/Loader/page";
import PaymentPage from "@/components/paymentSample/PaymentPage";
import {
  useFetchCartQuery,
  useFetchStockMutation,
} from "@/features/api/cartApi";
import {
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
  const [showContent, setShowContent] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [status, setStatus] = useState(null);
  const [method, setMethod] = useState(null);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [isStock, setIsStock] = useState(false);
  const [stockValue, setStockValue] = useState(null);

  const handleLoginToggle = () => setLoginToggle(!isLoginToggle);
  const [details, setDetails] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
  });

  const [isCuponToggle, setCuponToggle] = useState(false);
  const handleCuponToggle = () => setCuponToggle(!isCuponToggle);

  const [isCboxToggle, setCboxToggle] = useState(false);
  const handleCboxToggle = () => setCboxToggle(!isCboxToggle);

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
  const [updateStockValue, { loading, error }] = useFetchStockMutation();

  const [validStock] = useStockValidationMutation();

  useEffect(() => {
    if (cartItems) {
      const validateStock = async () => {
        setLoadingScreen(true);
        try {
          const response = await validStock(cartItems).unwrap();
          setStockValue(response);
        } catch (error) {
          console.error("Error validating stock:", error);
        } finally {
          setLoadingScreen(false);
        }
      };
      validateStock();
    }
  }, [cartItems, validStock]);
  useEffect(() => {
    if (successOrder) {
      setLoadingScreen(true);
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
          // Show success toast and navigate to the success page
          toast.success("Order Placed Successfully");
          router.push(`/orderSuccess?transactionId=${transactionId}`);
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

  const updateCheckout = async () => {
    try {
      const response = await fetch("/api/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          cartItems: cartItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.productPrice,
            color: item.productColor,
            size: item.productSize,
          })),
          shippingAddress: details,
          paymentDetails: {
            method: method,
            transactionId: transactionId,
            status: status,
          },
          orderTotal: orderTotal,
          orderStatus: "Processing",
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Checkout saved successfully", response);
        toast.success("order checkout saved successfully");
      } else {
        console.error("Error saving checkout:", data.message);
        toast.error(data.message || "Failed to save order checkout");
      }
    } catch (error) {
      console.error("Error during checkout update:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  if (isLoading) {
    return <Preloader />;
  }
  if (isError) {
    return <p>Error</p>;
  }
  let total = 0;
  cartItems?.forEach((item) => {
    const price = item.quantity * item.productPrice;
    total = total + price;
  });
  let shipping = 50;
  if (total >= 1000) {
    shipping = 0;
  }
  let orderTotal = 0;
  if (total > 0) {
    orderTotal = total + shipping;
  }
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDetails({
      ...details,
      [name]: value,
    });
  };

  const isDetailsEmpty = Object.values(details).every(
    (value) => value.trim() !== ""
  );

  const getStockStatus = (item) => {
    if (!stockValue) return null;

    const itemId = item.variantId || item.productId;
    const itemSize = item.size || item.productSize;

    // Check in stock array
    const inStockItem = stockValue.stock.find(
      (stock) => stock.variantId === itemId && stock.productSize === itemSize
    );

    if (inStockItem) {
      const value = inStockItem.stock;
      return `${inStockItem.stock} in Stock`;
    }

    // Check in outOfStockItems array
    const outOfStockItem = stockValue.outOfStockItems.find(
      (outOfStock) =>
        outOfStock.variantId === itemId && outOfStock.productSize === itemSize
    );

    if (outOfStockItem) {
      const message = outOfStockItem.message;
      orderTotal = orderTotal - item.productPrice * item.quantity;
      return outOfStockItem.message;
    }

    return `No stock info available for size ${itemSize}`;
  };

  if (isLoading) {
    return <div>Loading stock information...</div>;
  }

  // if (!stockValue) {
  //   return <div>Error loading stock information</div>;
  // }

  return (
    <>
      <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Checkout">
        {loadingScreen && <Loader />}
        <div>
          <section
            className="coupon-area pt-80 pb-30 wow fadeInUp"
            data-wow-duration=".8s"
            data-wow-delay=".2s"
          >
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="coupon-accordion">
                    {/* ACCORDION START */}
                    <h3>
                      Returning customer?{" "}
                      <span id="showlogin" onClick={handleLoginToggle}>
                        Click here to login
                      </span>
                    </h3>
                    <div
                      id="checkout-login"
                      className="coupon-content"
                      style={{ display: `${isLoginToggle ? "block" : "none"}` }}
                    >
                      <div className="coupon-info">
                        <p className="coupon-text">
                          Quisque gravida turpis sit amet nulla posuere lacinia.
                          Cras sed est sit amet ipsum luctus.
                        </p>
                        <form action="#">
                          <p className="form-row-first">
                            <label>
                              Username or email{" "}
                              <span className="required">*</span>
                            </label>
                            <input type="text" />
                          </p>
                          <p className="form-row-last">
                            <label>
                              Password <span className="required">*</span>
                            </label>
                            <input type="text" />
                          </p>
                          <p className="form-row">
                            <button
                              className="tp-btn tp-color-btn"
                              type="submit"
                            >
                              Login
                            </button>
                            <label>
                              <input type="checkbox" />
                              Remember me
                            </label>
                          </p>
                          <p className="lost-password">
                            <Link href="#">Lost your password?</Link>
                          </p>
                        </form>
                      </div>
                    </div>
                    {/* ACCORDION END */}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="coupon-accordion">
                    {/* ACCORDION START */}
                    <h3>
                      Have a coupon?{" "}
                      <span id="showcoupon" onClick={handleCuponToggle}>
                        Click here to enter your code
                      </span>
                    </h3>
                    <div
                      id="checkout_coupon"
                      className="coupon-checkout-content"
                      style={{ display: `${isCuponToggle ? "block" : "none"}` }}
                    >
                      <div className="coupon-info">
                        <form action="#">
                          <p className="checkout-coupon">
                            <input type="text" placeholder="Coupon Code" />
                            <button
                              className="tp-btn tp-color-btn"
                              type="submit"
                            >
                              Apply Coupon
                            </button>
                          </p>
                        </form>
                      </div>
                    </div>
                    {/* ACCORDION END */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* coupon-area end */}
          {/* checkout-area start */}
          <section
            className="checkout-area pb-50 wow fadeInUp"
            data-wow-duration=".8s"
            data-wow-delay=".2s"
          >
            <div className="container">
              <form action="#">
                <div className="row">
                  <div className="col-lg-6 col-md-12">
                    <div className="checkbox-form">
                      <h3>Billing Details</h3>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Full Name <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="fullName"
                              placeholder="John Doe"
                              required
                              value={details.fullName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Phone<span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="phone"
                              value={details.phone}
                              placeholder="98989 98989"
                              required
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Address Line 1 <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="addressLine1"
                              placeholder="Street address"
                              required
                              value={details.addressLine1}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>Address Line 2 </label>
                            <input
                              type="text"
                              placeholder="Street address"
                              name="addressLine2"
                              value={details.addressLine2}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Town / City <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Town / City"
                              name="city"
                              required
                              value={details.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              State <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="state"
                              placeholder="State"
                              required
                              value={details.state}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Postcode / Zip <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Postcode / Zip"
                              name="postalCode"
                              required
                              value={details.postalCode}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Country <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              value="India"
                              disabled
                              name="country"
                              required
                              //   onChange={handleChange}
                            />
                          </div>
                        </div>
                        {/* <div className="col-md-12">
                                                    <div className="checkout-form-list create-acc">
                                                        <input id="cbox" type="checkbox" onClick={handleCboxToggle} />
                                                        <label>Create an account?</label>
                                                    </div>
                                                    <div id="cbox_info" className="checkout-form-list create-account" style={{ display: `${isCboxToggle ? "block" : "none"}` }}>
                                                        <p>Create an account by entering the information below. If you are a returning
                                                            customer please login at the top of the page.</p>
                                                        <label>Account password <span className="required">*</span></label>
                                                        <input type="password" placeholder="password" />
                                                    </div>
                                                </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="your-order mb-30 ">
                      <h3>Your order</h3>
                      <div className="your-order-table table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th className="product-name">Product</th>
                              <th className="product-total">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems?.map((item) => (
                              <tr
                                key={`${item.productId || item.variantId}-${
                                  item.size || item.productSize
                                }`}
                              >
                                <td>
                                  {item.productName}{" "}
                                  <strong className="product-quantity">
                                    × {item.quantity}
                                  </strong>
                                  <br />
                                  <small className="stock-status">
                                    {getStockStatus(item)}
                                  </small>
                                </td>
                                <td>
                                  <span className="amount">
                                    ₹ {item.productPrice}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="cart-subtotal">
                              <th>Cart Subtotal</th>
                              <td>
                                <span className="amount">₹ {total}</span>
                              </td>
                            </tr>
                            <tr className="shipping">
                              <th>Shipping</th>
                              <td>
                                <span className="amount">₹ {shipping}</span>
                              </td>
                            </tr>
                            <tr className="order-total">
                              <th>Order Total</th>
                              <td>
                                <strong>
                                  <span className="amount">₹ {orderTotal}</span>
                                </strong>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="payment-method">
                        <div className="accordion" id="checkoutAccordion">
                          <div className="accordion-item"></div>
                        </div>
                        {isDetailsEmpty ? (
                          <div className="order-button-payment mt-20">
                            <PaymentPage
                              amount={orderTotal}
                              onPaymentSuccess={setSuccessOrder}
                              transactionId={transactionId}
                              setTransactionId={setTransactionId}
                              setStatus={setStatus}
                              setMethod={setMethod}
                            />
                          </div>
                        ) : (
                          <>
                            <div className="order-button-payment mt-20">
                              <button
                                type="submit"
                                className="tp-btn tp-color-btn w-100 banner-animation"
                              >
                                Fill all details
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
