import React from "react";
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import Link from "next/link"
import { useRelatedProductsQuery } from "@/features/api/productApi";


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

const RelatedProducts = ({ category }) => {
    const { data : relatedProducts, isLoading, isError } = useRelatedProductsQuery(category);
    if(isLoading) return <p>Loading...</p>
    if(isError) return <p>Error</p>
  return (
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
              <div className="tprelated__prv">
                <i className="far fa-long-arrow-left" />
              </div>
              <div className="tprelated__nxt">
                <i className="far fa-long-arrow-right" />
              </div>
            </div>
          </div>
        </div>
        <div className="swiper-container related-product-active">
          <Swiper {...swiperOptions}>
            {relatedProducts.map((product) => (
            <SwiperSlide>
              <div className="tpproduct pb-15 mb-30">
                <div className="tpproduct__thumb p-relative">
                  <Link href={`/ShopDetails/${product._id}`}>
                    <img
                      src={product.productImage[0]}
                      alt="product-thumb"
                      style={{ objectFit: "cover" , height: "300px" }}
                    />
                    <img
                      className="product-thumb-secondary"
                      src={product.productImage[1]}
                      alt=""
                      style={{ objectFit: "cover" , height: "300px" }}

                    />
                  </Link>
                  <div className="tpproduct__thumb-action">
                    <Link className="comphare" href="#">
                      <i className="fal fa-exchange" />
                    </Link>
                    <Link className="quckview" href={product.productImage[1]}>
                      <i className="fal fa-eye" />
                    </Link>
                    <Link className="wishlist" href="/wishlist">
                      <i className="fal fa-heart" />
                    </Link>
                  </div>
                </div>
                <div className="tpproduct__content">
                  <h3 className="tpproduct__title">
                    <Link href={`/ShopDetails/${product._id}`}>{product.productName}</Link>
                  </h3>
                  <div className="tpproduct__priceinfo p-relative">
                    <div className="tpproduct__priceinfo-list">
                      <span>$ {product.productPrice}</span>
                    </div>
                    <div className="tpproduct__cart">
                      <Link href="/cart">
                        <i className="fal fa-shopping-cart" />
                        Add To Cart
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            ))}
            
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
