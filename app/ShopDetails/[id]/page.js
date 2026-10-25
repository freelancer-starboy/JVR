"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFetchProductsByIdQuery } from "@/features/api/productApi";
import { useAddToCartMutation } from "@/features/api/cartApi";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { toast } from "react-toastify";
import Preloader from "@/components/elements/Preloader";
import Loader from "@/components/Loader/page";
import RelatedProducts from "@/components/relatedProducts/RelatedProducts";
import { useGetReviewQuery } from "@/features/api/reviewApi";
import ReviewDisplay from "@/components/review/review";
import ReviewForm from "@/components/review/ReviewForm";
import WishlistButton from "@/components/wishlist/WishlistButton";
import WhatsAppOrderButton from "@/components/whatsapp/WhatsAppOrderButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as fullStar,
  faStarHalfAlt as halfStar,
  faStar as emptyStar,
} from "@fortawesome/free-solid-svg-icons";

export default function ShopDetails() {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSize] = useState("");
  const [selectedColor, setColor] = useState("");
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [value, setValue] = useState(1);
  const [Loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const [stock, setStock] = useState(0);

  const params = useParams();
  const id = params.id;
  const { data: product, error, isLoading } = useFetchProductsByIdQuery(id);
  const [addToCart] = useAddToCartMutation();

  // Set initial color and variant when product data is loaded
  useEffect(() => {
    if (product && product.productVariants.length > 0 && !selectedColor) {
      const firstVariant = product.productVariants[0];
      setColor(firstVariant.color);
      setSelectedVariant(firstVariant);
    }
  }, [product]);

  // Update selected variant when color changes
  useEffect(() => {
    if (product && selectedColor) {
      const variant = product.productVariants.find(
        (v) => v.color === selectedColor
      );
      setSelectedVariant(variant);
      setSize(""); // Reset size when color changes
      setActiveIndex2(0); // Reset image index
    }
  }, [selectedColor, product]);

  // Get stock for selected size
  useEffect(() => {
    const getSelectedStock = () => {
      if (!selectedVariant || !selectedSize) return 0;
      const sizeObj = selectedVariant.sizes.find(
        (s) => s.size.trim() === selectedSize.trim()
      );
      return sizeObj ? parseInt(sizeObj.stock) : 0;
    };

    setStock(getSelectedStock()); // Only update stock when dependencies change
  }, [selectedVariant, selectedSize]);

  // get review for product
  const { data: review } = useGetReviewQuery(id, {
    skip: !id,
  });

  const averageRating = review?.length
    ? Number(
        (review.reduce((acc, review) => review.rating + acc, 0) / review.length).toFixed(1)
      )
    : 0;

  // Shared by "Add To Bag" and "Order on WhatsApp".
  const validateSelection = () => {
    if (!selectedColor) {
      toast.error("Please select a color");
      return false;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    if (!selectedVariant) {
      toast.error("Please select a valid variant");
      return false;
    }
    if (stock < value) {
      toast.error("Selected quantity exceeds available stock");
      return false;
    }
    return true;
  };

  const whatsAppItems = product
    ? [
        {
          productId: String(product._id),
          productName: product.productName,
          productImage: selectedVariant?.images?.[0] || product.productVariants?.[0]?.images?.[0],
          price: product.productPrice,
          color: selectedColor,
          size: selectedSize,
          quantity: value,
        },
      ]
    : [];

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!validateSelection()) return;

    setLoading(true);
    try {
      if (!userId) {
        throw new Error("Please login to add items to cart");
      }

      if (!product?._id) {
        throw new Error("Product details not found");
      }

      const cartData = {
        userId,
        productId: id,
        quantity: value,
        size: selectedSize,
        color: selectedColor,
        variantId: selectedVariant._id,
      };

      const response = await addToCart(cartData);

      if (response.data) {
        toast.success("Item added to cart successfully");

      } else if (response.error) {
        const errorMessage =
          response.error.data?.message || "Failed to add item to cart";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred");
      console.error("Cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Preloader />;
  if (error || !product) {
    return (
      <Layout headerStyle={3} footerStyle={2}>
        <div className="container">
          <div className="jvr-empty-state">
            <i className="fal fa-tshirt" />
            <h3>Product not found</h3>
            <p>This product may have been removed or is no longer available.</p>
            <Link href="/shop-2" className="tpcheck-btn d-inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const discount =
    product.productOldPrice > product.productPrice
      ? ((product.productOldPrice - product.productPrice) /
          product.productOldPrice) *
        100
      : 0;

  return (
    <Layout headerStyle={3} footerStyle={2}>
      {Loading && <Loader />}
      <div>
        <section className="product-area pt-80 pb-25">
          <div className="container">
            <div className="row">
              <div className="col-lg-5 col-md-12">
                <div className="tpproduct-details__nab pr-50 mb-40">
                  <div className="d-flex align-items-start">
                    <div
                      className="nav flex-column nav-pills me-3"
                      role="tablist"
                    >
                      {selectedVariant?.images.map((image, index) => (
                        <button
                          key={index}
                          className={`nav-link ${
                            activeIndex2 === index ? "active" : ""
                          }`}
                          onClick={() => setActiveIndex2(index)}
                        >
                          <img src={image} alt="" />
                        </button>
                      ))}
                    </div>
                    <div className="tab-content">
                      {selectedVariant?.images.map((image, index) => (
                        <div
                          key={index}
                          className={`tab-pane fade ${
                            activeIndex2 === index ? "show active" : ""
                          }`}
                        >
                          <img src={image} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-7">
                <div className="tpproduct-details__content">
                  <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-5">
                    <h3 className="tpproduct-details__title">
                      {product.productName}
                    </h3>
                    <span className="tpproduct-details__stock">
                      {selectedVariant && selectedSize
                        ? `${stock} in stock`
                        : "Select variant and size"}
                    </span>
                  </div>
                  <div className="tpproduct-details__price mb-30">
                    <del>₹{product.productOldPrice}</del>
                    <span>₹{product.productPrice}</span>
                    {discount > 0 && (
                      <span
                        style={{
                          color: "#866528",
                          fontSize: "1rem",
                          marginLeft: "0.5rem",
                          fontWeight: "normal",
                        }}
                      >
                        ({discount.toFixed(0)}% off)
                      </span>
                    )}
                  </div>
                  <div className="tpproduct-details__pera">
                    {product.productDetails?.map((detail, index) => (
                      // <li key={index}>{detail}</li>
                      <p
                        key={index}
                        dangerouslySetInnerHTML={{ __html: detail }}
                      />
                    ))}
                  </div>

                  {/* Color Selection */}
                  <div className="mb-4">
                    <label className="form-label h6 mb-3">Color</label>
                    <div className="d-flex flex-wrap gap-3">
                      {product.productVariants.map((variant) => (
                        <button
                          key={variant._id || variant.color}
                          onClick={() => setColor(variant.color)}
                          className={`color-selector rounded-circle p-0 border-2 position-relative`}
                          style={{
                            backgroundColor: variant.color,
                            width: "32px",
                            height: "32px",
                            border: `2px solid ${
                              selectedColor === variant.color
                                ? variant.color
                                : "#e0e0e0"
                            }`,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            outline:
                              selectedColor === variant.color
                                ? `2px solid #212121`
                                : "none",
                            outlineOffset: "2px",
                          }}
                          aria-label={`Select ${variant.color} color`}
                          title={variant.color}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  {selectedVariant && (
                    <div className="mb-4">
                      <label className="form-label h6 mb-3">Size</label>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedVariant.sizes.map((sizeObj) => {
                          const soldOut = Number(sizeObj.stock) <= 0;
                          return (
                            <button
                              key={sizeObj._id || sizeObj.size}
                              onClick={() => {
                                setSize(sizeObj.size);
                                setValue(1);
                              }}
                              className={`size-selector px-3 py-2 rounded-1 ${
                                soldOut ? "is-sold-out" : ""
                              } ${
                                selectedSize === sizeObj.size
                                  ? "bg-dark text-white"
                                  : "bg-light text-dark"
                              }`}
                              title={soldOut ? "Out of stock" : undefined}
                              style={{
                                border: "1px solid #dee2e6",
                                minWidth: "45px",
                                cursor: "pointer",
                                fontWeight:
                                  selectedSize === sizeObj.size ? "600" : "400",
                              }}
                            >
                              {sizeObj.size}
                            </button>
                          );
                        })}
                        <div className="d-flex align-items-center justify-content-center">
                          {selectedVariant &&
                            selectedSize &&
                            (stock ? (
                              stock <= 5 ? (
                                <span className="text-danger">
                                  Hurry, only {stock} left!
                                </span>
                              ) : (
                                <span className="text-success">
                                  {stock} left!
                                </span>
                              )
                            ) : (
                              <span className="text-danger">Out of stock</span>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="tpproduct-details__count d-flex align-items-center flex-wrap mb-25">
                    <div className="tpproduct-details__quantity">
                      <span
                        className="cart-minus"
                        onClick={() => setValue(value === 1 ? 1 : value - 1)}
                      >
                        <i className="far fa-minus" />
                      </span>
                      <input
                        className="tp-cart-input"
                        type="text"
                        value={value}
                        readOnly
                      />
                      <span
                        className="cart-plus"
                        onClick={() => {
                          if (selectedSize && value >= stock) {
                            toast.info(`Only ${stock} available in this size`);
                            return;
                          }
                          setValue(value + 1);
                        }}
                      >
                        <i className="far fa-plus" />
                      </span>
                    </div>
                    <div className="tpproduct-details__cart ml-20">
                      {!selectedVariant || !selectedSize || stock === 0 ? (
                        <button disabled>
                          <i className="fal fa-shopping-cart" />
                          {!selectedSize ? " Select Size" : " Out Of Stock"}
                        </button>
                      ) : (
                        <button onClick={handleAddToCart}>
                          <i className="fal fa-shopping-bag" /> Add To Bag
                        </button>
                      )}
                    </div>
                    <div className="tpproduct-details__wishlist ml-20">
                      <WishlistButton product={product} variant="inline" />
                    </div>
                  </div>

                  <div className="mb-25">
                    <WhatsAppOrderButton
                      source="product"
                      items={whatsAppItems}
                      validate={validateSelection}
                      label="Buy Now on WhatsApp"
                    />
                    <p className="jvr-whatsapp-note">
                      Skip the checkout — chat with our team to confirm size, delivery and payment.
                    </p>
                  </div>

                  <div className="tpproduct-details__information tpproduct-details__categories">
                    <p>Categories:</p>
                    <span>
                      <Link href={`/shop-2?category=${encodeURIComponent(product.productType)}`}>
                        {product.productType}
                      </Link>
                    </span>
                  </div>
                  <div className="tpproduct-details__information tpproduct-details__social">
                    <p>Share:</p>
                    {[
                      { icon: "fa-whatsapp", label: "WhatsApp", url: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}` },
                      { icon: "fa-facebook-f", label: "Facebook", url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
                      { icon: "fa-twitter", label: "Twitter", url: (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
                    ].map((share) => (
                      <a
                        key={share.icon}
                        href="#"
                        aria-label={`Share on ${share.label}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(share.url(window.location.href, product.productName), "_blank");
                        }}
                      >
                        <i className={`fab ${share.icon}`} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-md-5">
                <div className="tpproduct-details__condation">
                  <ul>
                    <li>
                      <div className="tpproduct-details__condation-item d-flex align-items-center">
                        <div className="tpproduct-details__condation-thumb">
                          <img
                            src="/assets/img/icon/product-det-1.png"
                            alt=""
                          />
                        </div>
                        <div className="tpproduct-details__condation-text">
                          <p>
                            Delivery in 10 Days
                            <br />
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="tpproduct-details__condation-item d-flex align-items-center">
                        <div className="tpproduct-details__condation-thumb">
                          <img
                            src="/assets/img/icon/product-det-2.png"
                            alt=""
                          />
                        </div>
                        <div className="tpproduct-details__condation-text">
                          <p>
                            Replacement Policy
                            <br />
                            No Returns
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {review && review.length > 0 ? (
        <>
          <div className="container mt-5">
            <div className="tpsection mb-40">
              <h4 className="tpsection__title">What Our Customers Say</h4>
              <p className="text-muted mt-2">
                Honest reviews from our customers
              </p>
            </div>

            <ReviewForm productId={id} />

            <div className="review-filter mb-4 d-flex flex-wrap align-items-center justify-content-between">
              <div className="review-summary">
                <div className="d-flex align-items-center">
                  <div className="review-average me-3">
                    <span className="fs-1 fw-bold">{averageRating}</span>
                  </div>
                  <div className="review-stars">
                    <div className="jvr-stars">
                      {[1, 2, 3, 4, 5].map((star) => {
                        if (averageRating >= star) {
                          return <FontAwesomeIcon key={star} icon={fullStar} />;
                        } else if (averageRating >= star - 0.5) {
                          return <FontAwesomeIcon key={star} icon={halfStar} />;
                        } else {
                          return (
                            <FontAwesomeIcon
                              key={star}
                              icon={emptyStar}
                              className="is-off"
                            />
                          );
                        }
                      })}
                    </div>

                    <small className="text-muted">
                      Based on {review?.length} reviews
                    </small>
                  </div>
                </div>
              </div>
              <div className="review-sort">
                {/* <select
              className="form-select border-dark"
              aria-label="Filter reviews"
            >
              <option>Most Recent</option>
              <option>Highest Rated</option>
              <option>Lowest Rated</option>
            </select> */}
              </div>
            </div>
            <ReviewDisplay reviews={review} />
          </div>
        </>
      ) : (
        <div className="container mt-5">
            <div className="tpsection mb-40">
              <h4 className="tpsection__title">What Our Customers Say</h4>
              <p className="text-muted mt-2">
                Be the first to review this product
              </p>
            </div>
            <ReviewForm productId={id} />
            </div>
      )}

      <div
        style={{ marginTop: "2rem", marginLeft: "2rem" }}
        className="tpsection mb-40"
      >
        <h4 className="tpsection__title">Related Product</h4>
      </div>
      <RelatedProducts category={product.productCategory} />
    </Layout>
  );
}
