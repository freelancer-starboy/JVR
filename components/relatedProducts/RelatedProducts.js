import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import { useRelatedProductsQuery } from "@/features/api/productApi";
import Preloader from "../elements/Preloader";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 5,
  spaceBetween: 25,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  breakpoints: {
    1400: { slidesPerView: 5 },
    1200: { slidesPerView: 5 },
    992: { slidesPerView: 4 },
    768: { slidesPerView: 2 },
    576: { slidesPerView: 2 },
    0: { slidesPerView: 1 },
  },
  navigation: {
    nextEl: ".tprelated__nxt",
    prevEl: ".tprelated__prv",
  },
};

const RelatedProducts = ({ category }) => {
  const { data: relatedProducts, isLoading, isError } = useRelatedProductsQuery(category);

  if (isLoading) return <Preloader />;
  if (isError) return <p className="text-danger text-center">Error loading related products.</p>;

  return (
    <div className="related-product-area pt-65 pb-50 related-product-border">
      <div className="container">
        {/* Optional arrows */}
        {/* <div className="row align-items-center mb-4">
          <div className="col-sm-6"></div>
          <div className="col-sm-6">
            <div className="tprelated__arrow d-flex align-items-center justify-content-end">
              <div className="tprelated__prv"><i className="far fa-long-arrow-left" /></div>
              <div className="tprelated__nxt"><i className="far fa-long-arrow-right" /></div>
            </div>
          </div>
        </div> */}

        <div className="swiper-container related-product-active custom-related-products-container">
          <Swiper {...swiperOptions}>
            {relatedProducts?.map((product) => {
              const images = product.productVariants?.[0]?.images || [];
              const primaryImg = images[0] || "/assets/img/no-image.jpg";
              const secondaryImg = images[1] || null;

              return (
                <SwiperSlide key={product._id}>
                  <div className="tpproduct pb-15 mb-30">
                    <div className="tpproduct__thumb p-relative">
                      <Link href={`/ShopDetails/${product._id}`}>
                        <img
                          src={primaryImg}
                          alt={product.productName}
                          style={{ objectFit: "cover", height: "300px", width: "100%", borderRadius: "10px" }}
                        />
                        {secondaryImg && (
                          <img
                            className="product-thumb-secondary"
                            src={secondaryImg}
                            alt={`${product.productName} - alt`}
                            style={{ objectFit: "cover", height: "300px", width: "100%", borderRadius: "10px" }}
                          />
                        )}
                      </Link>
                    </div>
                    <div className="tpproduct__content mt-3 text-center">
                      <h3 className="tpproduct__title text-lg font-semibold">
                        <Link href={`/ShopDetails/${product._id}`}>{product.productName}</Link>
                      </h3>
                      <div className="tpproduct__priceinfo mt-2">
                        <span className="text-primary text-lg font-bold">₹ {product.productPrice}</span>
                        <div className="tpproduct__cart mt-1">
                          <Link href={`/ShopDetails/${product._id}`} className="text-sm text-gray-700 hover:text-black">
                            <i className="fal fa-shopping-cart mr-1" />
                            Add to Cart
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
