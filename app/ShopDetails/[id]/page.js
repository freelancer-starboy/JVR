'use client'
import Layout from "@/components/layout/Layout"
import RelatedProducts from "@/components/relatedProducts/RelatedProducts"
import { useFetchProductsByIdQuery, useRelatedProductsQuery } from "@/features/api/productApi"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
export default function ShopDetails2() {
    const [activeIndex, setActiveIndex] = useState(2)
    const [category, setCategory] = useState(null)  // category should always exist, even if null initially

    const handleOnClick = (index) => {
        setActiveIndex(index)
    }
    
    const params = useParams()
    const id = params.id
    
    const { data: product, error, isLoading } = useFetchProductsByIdQuery(id)
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error : {error.message}</div>

    // useEffect(() => {
    //     if (product && product.productCategory) {
    //         setCategory(product.productCategory)
    //     }
    // }, [product])

    // Related products query: Always called but skips execution when category is not set
    // const { data: relatedProduct, error: relatedError, isLoading: relatedIsLoading } = useRelatedProductsQuery(category, {
    //     skip: !category,
    // })
    
    // if (relatedIsLoading) return <div>Loading related products...</div>
    // if (relatedError) return <div>Error loading related products: {relatedError.message}</div>

    return (
        <>
            <Layout headerStyle={3} footerStyle={2} breadcrumbTitle="Shop Details 2">
                <section className="product-area pt-80 pb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-md-12">
                                <div className="tpproduct-details__list-img">
                                    {product.productImage.map((image, index) => (
                                        
                                    <div className="tpproduct-details__list-img-item">
                                        <img src={image} alt="" />
                                    </div>
                                    ))}
                                    {/* <div className="tpproduct-details__list-img-item">
                                        <img src="/assets/img/product/product-42.jpg" alt="" />
                                    </div>
                                    <div className="tpproduct-details__list-img-item">
                                        <img src="/assets/img/product/product-43.jpg" alt="" />
                                    </div> */}
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-7">
                                <div className="tpproduct-details__content tpproduct-details__sticky">
                                    <div className="tpproduct-details__tag-area d-flex align-items-center mb-5">
                                        <span className="tpproduct-details__tag">{product.productCategory}</span>
                                        <div className="tpproduct-details__rating">
                                            <Link href="#"><i className="fas fa-star" /></Link>
                                            <Link href="#"><i className="fas fa-star" /></Link>
                                            <Link href="#"><i className="fas fa-star" /></Link>
                                        </div>
                                        <a className="tpproduct-details__reviewers">10 Reviews</a>
                                    </div>
                                    <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-5">
                                        <h3 className="tpproduct-details__title">{product.productName}</h3>
                                        <span className="tpproduct-details__stock">In Stock</span>
                                    </div>
                                    <div className="tpproduct-details__price mb-30">
                                        <del>₹ 9.35</del>
                                        <span>{product.productPrice}</span>
                                    </div>
                                    <div className="tpproduct-details__pera">
                                        <p>{product.productDescription}</p>
                                    </div>
                                    <div className="tpproduct-details__count d-flex align-items-center flex-wrap mb-25">
                                        <div className="tpproduct-details__quantity">
                                            <span className="cart-minus"><i className="far fa-minus" /></span>
                                            <input className="tp-cart-input" type="text" defaultValue={1} />
                                            <span className="cart-plus"><i className="far fa-plus" /></span>
                                        </div>
                                        <div className="tpproduct-details__cart ml-20">
                                            <button><i className="fal fa-shopping-cart" /> Add To Cart</button>
                                        </div>
                                        <div className="tpproduct-details__wishlist ml-20">
                                            <button><i className="fal fa-heart" /></button>
                                        </div>
                                    </div>
                                    <div className="tpproductdot mb-30">
                                        <Link className="tpproductdot__variationitem" href="#">
                                            <div className="tpproductdot__termshape">
                                                <span className="tpproductdot__termshape-bg" />
                                                <span className="tpproductdot__termshape-border" />
                                            </div>
                                        </Link>
                                        <Link className="tpproductdot__variationitem" href="#">
                                            <div className="tpproductdot__termshape">
                                                <span className="tpproductdot__termshape-bg red-product-bg" />
                                                <span className="tpproductdot__termshape-border red-product-border" />
                                            </div>
                                        </Link>
                                        <Link className="tpproductdot__variationitem" href="#">
                                            <div className="tpproductdot__termshape">
                                                <span className="tpproductdot__termshape-bg orange-product-bg" />
                                                <span className="tpproductdot__termshape-border orange-product-border" />
                                            </div>
                                        </Link>
                                        <Link className="tpproductdot__variationitem" href="#">
                                            <div className="tpproductdot__termshape">
                                                <span className="tpproductdot__termshape-bg purple-product-bg" />
                                                <span className="tpproductdot__termshape-border purple-product-border" />
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="tpproduct-details__information tpproduct-details__code">
                                        <p>SKU:</p><span>BO1D0MX8SJ</span>
                                    </div>
                                    <div className="tpproduct-details__information tpproduct-details__categories">
                                        <p>Categories:</p>
                                        <span><Link href="#">{product.productType}</Link></span>
                                       
                                    </div>
                                    {/* <div className="tpproduct-details__information tpproduct-details__tags">
                                        <p>Tags:</p>
                                        <span><Link href="#">fashion,</Link></span>
                                        <span><Link href="#">t-shirts,</Link></span>
                                        <span><Link href="#">women</Link></span>
                                    </div> */}
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
                                                    <img src="/assets/img/icon/product-det-1.png" alt="" className="tpproduct-details__img-hover" />
                                                </div>
                                                <div className="tpproduct-details__condation-text">
                                                    <p>Free Shipping apply to all<br />orders over $100</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                <div className="tpproduct-details__condation-thumb">
                                                    <img src="/assets/img/icon/product-det-2.png" alt="" className="tpproduct-details__img-hover" />
                                                </div>
                                                <div className="tpproduct-details__condation-text">
                                                    <p>Guranteed 100% Organic<br />from natural farmas</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                <div className="tpproduct-details__condation-thumb">
                                                    <img src="/assets/img/icon/product-det-3.png" alt="" className="tpproduct-details__img-hover" />
                                                </div>
                                                <div className="tpproduct-details__condation-text">
                                                    <p>1 Day Returns if you change<br />your mind</p>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="tpproduct-details__condation-item d-flex align-items-center">
                                                <div className="tpproduct-details__condation-thumb">
                                                    <img src="/assets/img/icon/product-det-4.png" alt="" className="tpproduct-details__img-hover" />
                                                </div>
                                                <div className="tpproduct-details__condation-text">
                                                    <p>Covid-19 Info: We keep<br />delivering.</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="product-setails-area">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="tpproduct-details__navtab mb-60">
                                    <div className="tpproduct-details__nav mb-30">
                                        <ul className="nav nav-tabs pro-details-nav-btn" id="myTabs" role="tablist">
                                            <li className="nav-item" onClick={() => handleOnClick(1)}>
                                                <button className={activeIndex == 1 ? "nav-links active" : "nav-links"}>Description</button>
                                            </li>
                                            <li className="nav-item" onClick={() => handleOnClick(2)}>
                                                <button className={activeIndex == 2 ? "nav-links active" : "nav-links"}>Additional information</button>
                                            </li>
                                            {/* <li className="nav-item" onClick={() => handleOnClick(3)}>
                                                <button className={activeIndex == 3 ? "nav-links active" : "nav-links"}>Reviews (2)</button>
                                            </li> */}
                                        </ul>
                                    </div>
                                    <div className="tab-content tp-content-tab" id="myTabContent-2">
                                        <div className={activeIndex == 1 ? "tab-para tab-pane fade show active" : "tab-para tab-pane fade"}>
                                            <p className="mb-30">{product.productDescription}</p>
                                        </div>
                                        <div className={activeIndex == 2 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <div className="product__details-info table-responsive">
                                                <table className="table table-striped">
                                                    <tbody>
                                                        <tr>
                                                            <td className="add-info">Weight</td>
                                                            <td className="add-info-list"> 2 lbs</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Dimensions</td>
                                                            <td className="add-info-list"> 12 × 16 × 19 in</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Product</td>
                                                            <td className="add-info-list"> Purchase this product on rag-bone.com</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Color</td>
                                                            <td className="add-info-list"> Gray, Black</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Size</td>
                                                            <td className="add-info-list"> S, M, L, XL</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Model</td>
                                                            <td className="add-info-list"> Model </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Shipping</td>
                                                            <td className="add-info-list"> Standard shipping: $5,95L</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Care Info</td>
                                                            <td className="add-info-list"> Machine Wash up to 40ºC/86ºF Gentle Cycle</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="add-info">Brand</td>
                                                            <td className="add-info-list">  Kazen</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/* <div className={activeIndex == 3 ? "tab-pane fade show active" : "tab-pane fade"}>
                                            <div className="product-details-review">
                                                <h3 className="tp-comments-title mb-35">3 reviews for “Wide Cotton Tunic extreme hammer”</h3>
                                                <div className="latest-comments mb-55">
                                                    <ul>
                                                        <li>
                                                            <div className="comments-box d-flex">
                                                                <div className="comments-avatar mr-25">
                                                                    <img src="/assets/img/shop/reviewer-01.png" alt="" />
                                                                </div>
                                                                <div className="comments-text">
                                                                    <div className="comments-top d-sm-flex align-items-start justify-content-between mb-5">
                                                                        <div className="avatar-name">
                                                                            <b>Siarhei Dzenisenka</b>
                                                                            <div className="comments-date mb-20">
                                                                                <span>March 27, 2018 9:51 am</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="user-rating">
                                                                            <ul>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fal fa-star" /></Link></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <p className="m-0">This is cardigan is a comfortable warm classic piece. Great to layer with a light top and you can dress up or down given the jewel buttons. I'm 5'8” 128lbs a 34A and the Small fit fine.</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="comments-box d-flex">
                                                                <div className="comments-avatar mr-25">
                                                                    <img src="/assets/img/shop/reviewer-02.png" alt="" />
                                                                </div>
                                                                <div className="comments-text">
                                                                    <div className="comments-top d-sm-flex align-items-start justify-content-between mb-5">
                                                                        <div className="avatar-name">
                                                                            <b>Tommy Jarvis </b>
                                                                            <div className="comments-date mb-20">
                                                                                <span>March 27, 2018 9:51 am</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="user-rating">
                                                                            <ul>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fal fa-star" /></Link></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <p className="m-0">This is cardigan is a comfortable warm classic piece. Great to layer with a light top and you can dress up or down given the jewel buttons. I'm 5'8” 128lbs a 34A and the Small fit fine.</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div className="comments-box d-flex">
                                                                <div className="comments-avatar mr-25">
                                                                    <img src="/assets/img/shop/reviewer-03.png" alt="" />
                                                                </div>
                                                                <div className="comments-text">
                                                                    <div className="comments-top d-sm-flex align-items-start justify-content-between mb-5">
                                                                        <div className="avatar-name">
                                                                            <b>Johnny Cash</b>
                                                                            <div className="comments-date mb-20">
                                                                                <span>March 27, 2018 9:51 am</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="user-rating">
                                                                            <ul>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                                                <li><Link href="#"><i className="fal fa-star" /></Link></li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                    <p className="m-0">This is cardigan is a comfortable warm classic piece. Great to layer with a light top and you can dress up or down given the jewel buttons. I'm 5'8” 128lbs a 34A and the Small fit fine.</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="product-details-comment">
                                                    <div className="comment-title mb-20">
                                                        <h3>Add a review</h3>
                                                        <p>Your email address will not be published. Required fields are marked*</p>
                                                    </div>
                                                    <div className="comment-rating mb-20 d-flex">
                                                        <span>Overall ratings</span>
                                                        <ul>
                                                            <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                            <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                            <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                            <li><Link href="#"><i className="fas fa-star" /></Link></li>
                                                            <li><Link href="#"><i className="fal fa-star" /></Link></li>
                                                        </ul>
                                                    </div>
                                                    <div className="comment-input-box">
                                                        <form action="#">
                                                            <div className="row">
                                                                <div className="col-xxl-12">
                                                                    <div className="comment-input">
                                                                        <textarea placeholder="Your review..." />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xxl-6">
                                                                    <div className="comment-input">
                                                                        <input type="text" placeholder="Your Name*" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xxl-6">
                                                                    <div className="comment-input">
                                                                        <input type="email" placeholder="Your Email*" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-xxl-12">
                                                                    <div className="comment-submit">
                                                                        <button type="submit" className="tp-btn pro-submit">Submit</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>





                {/* 
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                */}
                <RelatedProducts category={product.productCategory} />
            </Layout>
        </>
    )
}