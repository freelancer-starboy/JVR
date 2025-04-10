"use client";
import { useAuth } from "@/components/AuthContent/AuthContent";
import Preloader from "@/components/elements/Preloader";
import Layout from "@/components/layout/Layout";
import { useFetchCheckOutQuery } from "@/features/api/checkout";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import OrderSuccess from "../orderSuccess/page";
import { AiOutlineCopy } from "react-icons/ai";
import { toast } from "react-toastify";
import DeliveryStatusSlider from "@/components/deliverySlider/Slider";
import OrderTracker from "@/components/pop/Popup.js";
import { useAddReviewMutation } from "@/features/api/reviewApi";

const OrdersPage = () => {
  const { userId, isAuthLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");
  const [showSuccess, setShowSuccess] = useState(false);
  const [trackShipment, setTrackShipment] = useState(false);

  // review
  const [showPopup, setShowPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
   if(files.length > 0){
    setImage(files)

    const imagePreviews = []
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreviews.push(e.target.result)
        if (imagePreviews.length === files.length) {
          setImagePreview(imagePreviews); // Update state after all images are processed
        }
      }
      reader.readAsDataURL(file);
    })
   }
  };
  const [ addReview ] = useAddReviewMutation()
  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = () => {
    console.log({
      rating,
      reviewText,
      image,
    });


    try {
      const formData = new FormData()
      formData.append("username", userId)
      formData.append("productId", transactionId)
      formData.append("rating", rating)
      formData.append("reviewText", reviewText)
      let imagesArray = []
      const images = image.forEach((img) => {
        imagesArray.push(img)
      })

      formData.append("images", imagesArray)
      addReview(formData)
    } catch (error) {
      
    }

    setShowPopup(false);

    setRating(0);
    setReviewText("");
    setImage(null);
    setImagePreview(null);
  };

  const { data, isLoading } = useFetchCheckOutQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (transactionId && !isLoading && data) {
      setShowSuccess(true);
    }
  }, [transactionId, isLoading, data]);

  if (isAuthLoading || isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div
        class="w-100 position-fixed d-flex justify-content-center align-items-center"
        style={{ zIndex: "999" }}
      >
        {showSuccess && transactionId && (
          <OrderSuccess transactionId={transactionId} />
        )}
      </div>
      <Layout headerStyle={3} footerStyle={2}>
        <div className="custom-myorders-container">
          <h1 className="custom-myorders-title">Your Orders</h1>
          {data && data.length > 0 && (
            <div className="custom-myorders-grid">
              {data.map((order) => (
                <>
                  <div key={order._id} className="custom-myorders-card">
                    <div className="custom-myorders-header">
                      <div className="custom-myorders-header-info">
                        <span className="custom-myorders-date">
                          <span className="custom-myorders-label">
                            Customer Name: {order.shippingAddress?.fullName}
                          </span>
                          <br />
                          <span className="custom-myorders-label">
                            Order Placed:{" "}
                          </span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <span className="custom-myorders-id">
                          Order ID #-JVR-{order._id}
                          <AiOutlineCopy
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `#-JVR-${order._id}`
                              );
                              toast.success("Copied to clipboard");
                            }}
                            style={{
                              marginLeft: "10px",
                              fontWeight: "bold",
                              fontSize: "20px",
                              cursor: "pointer",
                            }}
                          />
                        </span>
                        <div>
                          <OrderTracker status={order.orderStatus} />
                        </div>
                      </div>
                      <div className="custom-myorders-total">
                        <span className="custom-myorders-total-label">
                          Total:{" "}
                        </span>
                        ₹{order.orderTotal}
                      </div>
                    </div>

                    <div className="custom-myorders-content">
                      <div className="custom-myorders-info-grid">
                        <div className="custom-myorders-info-item">
                          <h6 className="custom-myorders-info-title">
                            Shipping Address
                          </h6>
                          <p className="custom-myorders-info-text">
                            {order.shippingAddress?.addressLine1},{" "}
                            {order.shippingAddress?.addressLine2}
                          </p>
                        </div>
                        <div className="custom-myorders-info-item">
                          <h6 className="custom-myorders-info-title">
                            Payment
                          </h6>
                          <p className="custom-myorders-info-text">
                            {order.paymentDetails?.method?.toUpperCase()} -{" "}
                            {order.paymentDetails?.status}
                          </p>
                        </div>
                        <div className="custom-myorders-info-item">
                          <h6 className="custom-myorders-info-title">
                            Delivery Status
                          </h6>
                          <p className="custom-myorders-info-text custom-myorders-success">
                            {order.orderStatus}
                          </p>
                        </div>
                        {order.orderStatus === "Delivered" ? (
                          <>
                            <div className="custom-myorders-info-item">
                              <h6 className="custom-myorders-info-title">
                                Delivered
                              </h6>
                              <p className="custom-myorders-info-text custom-myorders-success">
                                {new Date(
                                  new Date(order.updatedAt).getTime()
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>

                            <div className="custom-myorders-container">
                              <p className="custom-myorders-info-text custom-myorders-success">
                                <button
                                  className="custom-myorders-review-button"
                                  onClick={() => setShowPopup(true)}
                                >
                                  Add review
                                </button>
                              </p>

                              {showPopup && (
                                <div className="custom-review-popup-overlay">
                                  <div className="custom-review-popup-content">
                                    <div className="custom-review-popup-header">
                                      <h3 className="custom-review-popup-title">
                                        Write your review
                                      </h3>
                                      <button
                                        className="custom-review-popup-close"
                                        onClick={() => setShowPopup(false)}
                                      >
                                        &times;
                                      </button>
                                    </div>

                                    <div className="custom-review-rating-container">
                                      <p className="custom-review-rating-label">
                                        Rating:
                                      </p>
                                      <div className="custom-review-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <span
                                            key={star}
                                            className={`custom-review-star ${
                                              rating >= star
                                                ? "custom-review-star-active"
                                                : ""
                                            }`}
                                            onClick={() =>
                                              handleStarClick(star)
                                            }
                                          >
                                            ★
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="custom-review-image-upload">
                                      <label className="custom-review-image-label">
                                        Upload Image:
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          className="custom-review-image-input"
                                          onChange={handleImageChange}
                                        />
                                      </label>
                                      {imagePreview && imagePreview.map((preview, index) => (
                                      <img key={index} src={preview} alt={`Preview ${index}`} width="100"  
                                       />
                                      ))}
                                    </div>

                                    <div className="custom-review-text-container">
                                      <label className="custom-review-text-label">
                                        Your Review:
                                        <textarea
                                          className="custom-review-text-input"
                                          value={reviewText}
                                          onChange={(e) =>
                                            setReviewText(e.target.value)
                                          }
                                          placeholder="Share your experience..."
                                          rows={4}
                                        />
                                      </label>
                                    </div>

                                    <div className="custom-review-buttons">
                                      <button
                                        className="custom-review-cancel-button"
                                        onClick={() => setShowPopup(false)}
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        className="custom-review-submit-button"
                                        onClick={handleSubmit}
                                        disabled={rating === 0}
                                      >
                                        Submit Review
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="custom-myorders-info-item">
                            <h6 className="custom-myorders-info-title">
                              Expected Delivery
                            </h6>
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
                        )}
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
                </>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default OrdersPage;
