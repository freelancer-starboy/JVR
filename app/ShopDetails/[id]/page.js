'use client';
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useFetchProductsByIdQuery, useRelatedProductsQuery } from "@/features/api/productApi"
import { useAddToCartMutation, useFetchCartQuery } from "@/features/api/cartApi"
import { useAuth } from "@/components/AuthContent/AuthContent"
import { toast } from "react-toastify"
import Preloader from "@/components/elements/Preloader"

export default function ShopDetails() {
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSize] = useState("");
    const [selectedColor, setColor] = useState("");
    const [activeIndex2, setActiveIndex2] = useState(0);
    const [value, setValue] = useState(1);
    const [Loading, setLoading] = useState(false);
    const { userId } = useAuth();
    const [activeIndex, setActiveIndex] = useState(1);

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
            const variant = product.productVariants.find(v => v.color === selectedColor);
            setSelectedVariant(variant);
            console.log("VariantId : ", variant?._id);
            setSize(""); // Reset size when color changes
            setActiveIndex2(0); // Reset image index
        }
    }, [selectedColor, product]);

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
                variantId: selectedVariant._id
            };

            const response = await addToCart(cartData);

            if (response.data) {
                toast.success("Item added to cart successfully");
                refetch();
            } else if (response.error) {
                const errorMessage = response.error.data?.message || "Failed to add item to cart";
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

    const discount = product.productOldPrice > product.productPrice
        ? ((product.productOldPrice - product.productPrice) / product.productOldPrice) * 100
        : 0;

    return (
        <Layout headerStyle={3} footerStyle={1}>
            <div>
                <section className="product-area pt-80 pb-25">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-md-12">
                                <div className="tpproduct-details__nab pr-50 mb-40">
                                    <div className="d-flex align-items-start">
                                        <div className="nav flex-column nav-pills me-3" role="tablist">
                                            {selectedVariant?.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    className={`nav-link ${activeIndex2 === index ? 'active' : ''}`}
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
                                                    className={`tab-pane fade ${activeIndex2 === index ? 'show active' : ''}`}
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
                                        <h3 className="tpproduct-details__title">{product.productName}</h3>
                                        <span className="tpproduct-details__stock">
                                            {selectedVariant ? `${selectedVariant.stock} in stock` : 'Select a variant'}
                                        </span>
                                    </div>
                                    <div className="tpproduct-details__price mb-30">
                                        <del>₹{product.productOldPrice}</del>
                                        <span>₹{product.productPrice}</span>
                                        {discount > 0 && (
                                            <span style={{ color: '#866528', fontSize: '1rem', marginLeft: '0.5rem', fontWeight: 'normal' }}>
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
                                            {product.productVariants.map((variant, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setColor(variant.color)}
                                                    className={`color-selector rounded-circle p-0 border-2 position-relative ${
                                                        selectedColor === variant.color ? 'selected' : ''
                                                    }`}
                                                    style={{
                                                        backgroundColor: variant.color,
                                                        width: '32px',
                                                        height: '32px',
                                                        border: `2px solid ${selectedColor === variant.color ? variant.color : '#e0e0e0'}`,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        outline: selectedColor === variant.color ? `2px solid #212121` : 'none',
                                                        outlineOffset: '2px'
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
                                                {selectedVariant.size.map((size, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setSize(size)}
                                                        className={`size-selector px-3 py-2 rounded-1 ${
                                                            selectedSize === size
                                                                ? 'bg-dark text-white'
                                                                : 'bg-light text-dark'
                                                        }`}
                                                        style={{
                                                            border: '1px solid #dee2e6',
                                                            minWidth: '45px',
                                                            transition: 'all 0.2s ease',
                                                            cursor: 'pointer',
                                                            fontWeight: selectedSize === size ? '600' : '400'
                                                        }}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="tpproduct-details__count d-flex align-items-center flex-wrap mb-25">
                                        <div className="tpproduct-details__quantity">
                                            <span className="cart-minus" onClick={() => setValue(value === 1 ? 1 : value - 1)}>
                                                <i className="far fa-minus" />
                                            </span>
                                            <input className="tp-cart-input" type="text" value={value} readOnly />
                                            <span className="cart-plus" onClick={() => setValue(value + 1)}>
                                                <i className="far fa-plus" />
                                            </span>
                                        </div>
                                        <div className="tpproduct-details__cart ml-20">
                                            {!selectedVariant || selectedVariant.stock === 0 ? (
                                                <button disabled>
                                                    <i className="fal fa-shopping-cart" /> Out Of Stock
                                                </button>
                                            ) : (
                                                <button onClick={handleAddToCart}>
                                                    <i className="fal fa-shopping-cart" /> Add To Cart
                                                </button>
                                            )}
                                        </div>
                                        <div className="tpproduct-details__wishlist ml-20">
                                            <Link href="#"><i className="fal fa-heart" /></Link>
                                        </div>
                                    </div>

                                    <div className="tpproduct-details__information tpproduct-details__categories">
                                        <p>Categories:</p>
                                        <span><Link href="#">{product.productType}</Link></span>
                                    </div>
                                    <div className="tpproduct-details__information tpproduct-details__social">
                                        <p>Share:</p>
                                        <Link href="#"><i className="fab fa-facebook-f" /></Link>
                                        <Link href="#"><i className="fab fa-twitter" /></Link>
                                        <Link href="#"><i className="fab fa-behance" /></Link>
                                        <Link href="#"><i className="fab fa-youtube" /></Link>
                                        <Link href="#"><i className="fab fa-linkedin" /></Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-5">
                                <div className="tpproduct-details__condation">
                                    <ul>
                                        <li>
                                            <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                <div className="tpproduct-details__condation-thumb">
                                                    <img src="/assets/img/icon/product-det-1.png" alt="" />
                                                </div>
                                                <div className="tpproduct-details__condation-text">
                                                    <p>Delivery in 10 Days<br /></p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                <div className="tpproduct-details__condation-thumb">
                                                    <img src="/assets/img/icon/product-det-2.png" alt="" />
                                                </div>
                                                <div className="tpproduct-details__condation-text">
                                                    <p>Replacement Policy<br />No Returns</p>
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
        </Layout>
    );
}