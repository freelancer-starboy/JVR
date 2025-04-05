"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useState, useEffect, createContext } from "react";
import { useParams } from "next/navigation";
import {
  useFetchProductsByIdQuery,
  useRelatedProductsQuery,
} from "@/features/api/productApi";
import {
  useAddToCartMutation,
  useFetchCartQuery,
} from "@/features/api/cartApi";
import { useAuth } from "@/components/AuthContent/AuthContent";
import { toast } from "react-toastify";
import Preloader from "@/components/elements/Preloader";
import Loader from "@/components/Loader/page";
import RelatedProducts from "@/components/relatedProducts/RelatedProducts";
// import { createContext } from "react/cjs/react.production.min";

export default function ShopDetails() {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSize] = useState("");
  const [selectedColor, setColor] = useState("");
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [value, setValue] = useState(1);
  const [Loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const [activeIndex, setActiveIndex] = useState(1);
  const [stock, setStock] = useState(0);
  const stockData = createContext();

  const params = useParams();
  const id = params.id;
  const { data: product, error, isLoading } = useFetchProductsByIdQuery(id);
  const [addToCart] = useAddToCartMutation();
  const { refetch } = useFetchCartQuery(userId);

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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!selectedColor) {
      alert("Please select color");
      return;
    }
    if (!selectedSize) {
      alert("Please select size");
      return;
    }
    if (!selectedVariant) {
      alert("Please select a valid variant");
      return;
    }

    const currentStock = stock;
    if (currentStock < value) {
      toast.error("Selected quantity exceeds available stock");
      return;
    }

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
        productId: product._id,
        quantity: value,
        size: selectedSize,
        color: selectedColor,
        variantId: selectedVariant._id,
      };

      const response = await addToCart(cartData);

      if (response.data) {
        toast.success("Item added to cart successfully");
        refetch();
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
  if (error) return <div>Error: {error.message}</div>;

  const discount =
    product.productOldPrice > product.productPrice
      ? ((product.productOldPrice - product.productPrice) /
          product.productOldPrice) *
        100
      : 0;

  return (
    <Layout headerStyle={3} footerStyle={1}>
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
                      <li key={index}>{detail}</li>
                    ))}
                  </div>

                  {/* Color Selection */}
                  <div className="mb-4">
                    <label className="form-label h6 mb-3">Color</label>
                    <div className="d-flex flex-wrap gap-3">
                      {product.productVariants.map((variant) => (
                        <button
                          key={variant._id.$oid}
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
                        {selectedVariant.sizes.map((sizeObj) => (
                          <button
                            key={sizeObj._id.$oid}
                            onClick={() => setSize(sizeObj.size)}
                            className={`size-selector px-3 py-2 rounded-1 ${
                              stock === 0 ? "bg-gray disabled" : ""
                            }  ${
                              selectedSize === sizeObj.size
                                ? "bg-dark text-white"
                                : "bg-light text-dark"
                            } `}
                            style={{
                              border: "1px solid #dee2e6",
                              minWidth: "45px",
                              transition: "all 0.2s ease",
                              cursor: "pointer",
                              fontWeight:
                                selectedSize === sizeObj.size ? "600" : "400",
                            }}
                          >
                            {sizeObj.size}
                          </button>
                        ))}
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
                        onClick={() => setValue(value + 1)}
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
                      <Link href="#">
                        <i className="fal fa-heart" />
                      </Link>
                    </div>
                  </div>

                  <div className="tpproduct-details__information tpproduct-details__categories">
                    <p>Categories:</p>
                    <span>
                      <Link href="#">{product.productType}</Link>
                    </span>
                  </div>
                  <div className="tpproduct-details__information tpproduct-details__social">
                    <p>Share:</p>
                    <Link href="#">
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-twitter" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-behance" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-youtube" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-linkedin" />
                    </Link>
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
      <div className="container mt-5">
        <div className="tpsection mb-40">
          <h4 className="tpsection__title">What Our Customers Say</h4>
          <p className="text-muted mt-2">
            Authentic reviews from people who purchased this product
          </p>
        </div>

        <div className="review-filter mb-4 d-flex flex-wrap align-items-center justify-content-between">
          <div className="review-summary">
            <div className="d-flex align-items-center">
              <div className="review-average me-3">
                <span className="fs-1 fw-bold">4.5</span>
              </div>
              <div className="review-stars">
                <div style={{ color: "#000" }}>★★★★☆</div>
                <small className="text-muted">Based on 124 reviews</small>
              </div>
            </div>
          </div>
          <div className="review-sort">
            <select
              className="form-select border-dark"
              aria-label="Filter reviews"
            >
              <option>Most Recent</option>
              <option>Highest Rated</option>
              <option>Lowest Rated</option>
            </select>
          </div>
        </div>

        <div className="row">
          {/* Review 1 - Featured Review */}
          <div className="col-12 mb-4">
            <div
              className="border-0 p-4 rounded"
              style={{
                backgroundColor: "#f8f9fa",
                borderLeft: "4px solid #000",
              }}
            >
              <div className="d-flex mb-3 align-items-center">
                <div className="reviewer-avatar me-3">
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <span className="fw-bold">JD</span>
                  </div>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">John Doe</h6>
                  <div className="d-flex align-items-center">
                    <span style={{ color: "#000" }}>★★★★☆</span>
                    <small className="text-muted ms-2">March 25, 2025</small>
                    <span className="badge bg-dark text-white ms-2">
                      Verified Purchase
                    </span>
                  </div>
                </div>
              </div>
              <h6 className="review-title fw-bold mb-2">
                Perfect Fit & Outstanding Quality
              </h6>
              <p className="mb-3">
                Great quality and fits perfectly! The color is vibrant and
                exactly as shown in the pictures. Delivery was quick and the
                packaging was excellent. Definitely recommend this to anyone
                looking for a reliable product.
              </p>
              <div className="helpful-section d-flex align-items-center">
                <button className="btn btn-sm btn-outline-dark me-2">
                  <i className="far fa-thumbs-up me-1"></i> Helpful (12)
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="far fa-comment me-1"></i> Comment
                </button>
              </div>
            </div>
          </div>

          {/* Other Reviews - Card Style */}
          <div className="col-md-4 mb-4">
            <div
              className="border h-100 p-4 rounded shadow-sm"
              style={{
                backgroundColor: "#fff",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseOver="this.style.transform='translateY(-5px)'"
              onMouseOut="this.style.transform='translateY(0)'"
            >
              <div className="d-flex justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px", fontSize: "12px" }}
                  >
                    <span className="fw-bold">SJ</span>
                  </div>
                  <h6 className="mb-0 ms-2 fw-bold">Sarah J.</h6>
                </div>
                <div style={{ color: "#000" }}>★★★★★</div>
              </div>
              <small className="text-muted d-block mb-3">March 18, 2025</small>
              <p className="mb-0">
                Absolutely love this product! The sizing guide was accurate and
                the material feels premium. Would definitely buy again.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div
              className="border h-100 p-4 rounded shadow-sm"
              style={{
                backgroundColor: "#fff",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseOver="this.style.transform='translateY(-5px)'"
              onMouseOut="this.style.transform='translateY(0)'"
            >
              <div className="d-flex justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px", fontSize: "12px" }}
                  >
                    <span className="fw-bold">MC</span>
                  </div>
                  <h6 className="mb-0 ms-2 fw-bold">Michael C.</h6>
                </div>
                <div style={{ color: "#000" }}>★★★☆☆</div>
              </div>
              <small className="text-muted d-block mb-3">March 15, 2025</small>
              <p className="mb-0">
                Good product overall but slightly smaller than expected. The
                quality is decent for the price point though.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div
              className="border h-100 p-4 rounded shadow-sm"
              style={{
                backgroundColor: "#fff",
                transition: "transform 0.3s",
                cursor: "pointer",
              }}
              onMouseOver="this.style.transform='translateY(-5px)'"
              onMouseOut="this.style.transform='translateY(0)'"
            >
              <div className="d-flex justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                    style={{ width: "32px", height: "32px", fontSize: "12px" }}
                  >
                    <span className="fw-bold">ER</span>
                  </div>
                  <h6 className="mb-0 ms-2 fw-bold">Emily R.</h6>
                </div>
                <div style={{ color: "#000" }}>★★★★☆</div>
              </div>
              <small className="text-muted d-block mb-3">March 10, 2025</small>
              <p className="mb-0">
                Excellent customer service and the product arrived earlier than
                expected. Very happy with my purchase!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-3 mb-5">
          <button className="btn btn-dark px-4 py-2">Load More Reviews</button>
        </div>
      </div>

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
