'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useState } from "react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 5,
    spaceBetween: 25,
    autoplay: {
        delay: 3500,
    },
    breakpoints: {
        1400: {
            slidesPerView: 5,
        },
        1200: {
            slidesPerView: 5,
        },
        992: {
            slidesPerView: 4,
        },
        768: {
            slidesPerView: 2,
        },
        576: {
            slidesPerView: 2,
        },
        0: {
            slidesPerView: 1,
        },
    },
    navigation: {
        nextEl: '.tprelated__nxt',
        prevEl: '.tprelated__prv',
    },
}
export default function ShopDetails() {
    const [activeIndex, setActiveIndex] = useState(1)
    const handleOnClick = (index) => {
        setActiveIndex(index)
    }
    const [activeIndex2, setActiveIndex2] = useState(4)
    const handleOnClick2 = (index) => {
        setActiveIndex2(index)
    }
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop Details">
                <div>
                    <section className="product-area pt-80 pb-25">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-5 col-md-12">
                                    <div className="tpproduct-details__nab pr-50 mb-40">
                                        <div className="d-flex align-items-start">
                                            <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                <button className={activeIndex2 == 4 ? "nav-link active" : "nav-link"} onClick={() => handleOnClick2(4)}>
                                                    <img src="/assets/img/product/product-1.jpg" alt="" />
                                                </button>
                                                <button className={activeIndex2 == 5 ? "nav-link active" : "nav-link"} onClick={() => handleOnClick2(5)}>
                                                    <img src="/assets/img/product/product-2.jpg" alt="" />
                                                </button>
                                                <button className={activeIndex2 == 6 ? "nav-link active" : "nav-link"} onClick={() => handleOnClick2(6)}>
                                                    <img src="/assets/img/product/product-3.jpg" alt="" />
                                                </button>
                                            </div>
                                            <div className="tab-content" id="v-pills-tabContent">
                                                <div className={activeIndex2 == 4 ? "tab-pane fade show active" : "tab-pane fade"}>
                                                    <img src="/assets/img/product/product-1.jpg" alt="" />
                                                </div>
                                                <div className={activeIndex2 == 5 ? "tab-pane fade show active" : "tab-pane fade"}>
                                                    <img src="/assets/img/product/product-2.jpg" alt="" />
                                                </div>
                                                <div className={activeIndex2 == 6 ? "tab-pane fade show active" : "tab-pane fade"}>
                                                    <img src="/assets/img/product/product-3.jpg" alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-5 col-md-7">
                                    <div className="tpproduct-details__content">
                                        <div className="tpproduct-details__tag-area d-flex align-items-center mb-5">
                                            <span className="tpproduct-details__tag">Dress</span>
                                            <div className="tpproduct-details__rating">
                                                <Link href="#"><i className="fas fa-star" /></Link>
                                                <Link href="#"><i className="fas fa-star" /></Link>
                                                <Link href="#"><i className="fas fa-star" /></Link>
                                            </div>
                                            <a className="tpproduct-details__reviewers">10 Reviews</a>
                                        </div>
                                        <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-5">
                                            <h3 className="tpproduct-details__title">Wide Cotton Tunic Dress</h3>
                                            <span className="tpproduct-details__stock">In Stock</span>
                                        </div>
                                        <div className="tpproduct-details__price mb-30">
                                            <del>$9.35</del>
                                            <span>$7.25</span>
                                        </div>
                                        <div className="tpproduct-details__pera">
                                            <p>Priyoshop has brought to you the Hijab 3 Pieces Combo Pack PS23. It is a <br />completely modern design and you feel comfortable to put on this hijab. <br />Buy it at the best price.</p>
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
                                                <Link href="#"><i className="fal fa-heart" /></Link>
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
                                            <span><Link href="#">T-Shirts,</Link></span>
                                            <span><Link href="#">Tops,</Link></span>
                                            <span><Link href="#">Womens</Link></span>
                                        </div>
                                        <div className="tpproduct-details__information tpproduct-details__tags">
                                            <p>Tags:</p>
                                            <span><Link href="#">fashion,</Link></span>
                                            <span><Link href="#">t-shirts,</Link></span>
                                            <span><Link href="#">women</Link></span>
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
                                            
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* product-area-end */}
                    {/* product-details-area-start */}
                   
                    {/* product-details-area-end */}
                    {/* related-product-area-start */}
                    <div className="related-product-area pt-65 pb-50 related-product-border">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-sm-6">
                                    <div className="tpsection mb-40">
                                        <h4 className="tpsection__title">Related Products</h4>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="tprelated__arrow d-flex align-items-center justify-content-end mb-40">
                                        <div className="tprelated__prv"><i className="far fa-long-arrow-left" /></div>
                                        <div className="tprelated__nxt"><i className="far fa-long-arrow-right" /></div>
                                    </div>
                                </div>
                            </div>
                            <div className="swiper-container related-product-active">
                                <Swiper {...swiperOptions}>
                                    <SwiperSlide>
                                        <div className="tpproduct pb-15 mb-30">
                                            <div className="tpproduct__thumb p-relative">
                                                <Link href="/shop-details-2">
                                                    <img src="/assets/img/product/product-1.jpg" alt="product-thumb" />
                                                    <img className="product-thumb-secondary" src="/assets/img/product/product-2.jpg" alt="" />
                                                </Link>
                                                <div className="tpproduct__thumb-action">
                                                    <Link className="comphare" href="#"><i className="fal fa-exchange" /></Link>
                                                    <Link className="quckview" href="#"><i className="fal fa-eye" /></Link>
                                                    <Link className="wishlist" href="/wishlist"><i className="fal fa-heart" /></Link>
                                                </div>
                                            </div>
                                            <div className="tpproduct__content">
                                                <h3 className="tpproduct__title"><Link href="/shop-details">Miko Wooden Bluetooth Speaker</Link></h3>
                                                <div className="tpproduct__priceinfo p-relative">
                                                    <div className="tpproduct__priceinfo-list">
                                                        <span>$31.00</span>
                                                    </div>
                                                    <div className="tpproduct__cart">
                                                        <Link href="/cart"><i className="fal fa-shopping-cart" />Add To Cart</Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    )
}