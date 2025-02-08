import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductSlider = ({ products }) => {
  // Sample product data
  console.log("from claude slider : ", products)
  return (
    <>
      <style>
        {`
          .custom-slider {
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .custom-slider__item {
            position: relative;
            transition: transform 0.3s ease;
          }

          .custom-slider__image-wrapper {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            aspect-ratio: 1;
          }

          .custom-slider__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .custom-slider__hover {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .custom-slider__item:hover .custom-slider__hover {
            opacity: 1;
          }

          .custom-slider__item:hover .custom-slider__image {
            transform: scale(1.1);
          }

          .custom-slider__price {
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
          }

          .custom-slider__button {
            padding: 10px 20px;
            background: #fff;
            border: none;
            border-radius: 25px;
            color: #000;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .custom-slider__button:hover {
            background: #000;
            color: #fff;
          }

          .custom-slider__title {
            margin-top: 15px;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            color: #333;
          }

          .custom-slider .swiper-button-next,
          .custom-slider .swiper-button-prev {
            color: #333;
            background: #fff;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          }

          .custom-slider .swiper-button-next:after,
          .custom-slider .swiper-button-prev:after {
            font-size: 18px;
          }

          .custom-slider .swiper-pagination-bullet {
            width: 10px;
            height: 10px;
            background: #333;
            opacity: 0.5;
          }

          .custom-slider .swiper-pagination-bullet-active {
            opacity: 1;
          }
        `}
      </style>

      <div className="custom-slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={4}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 15
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 15
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20
            }
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="custom-slider__item">
                <div className="custom-slider__image-wrapper">
                  <img 
                    src={product.image} 
                    alt={product.productName}
                    className="custom-slider__image"
                  />
                  <div className="custom-slider__hover">
                    <span className="custom-slider__price">
                      ${product.price}
                    </span>
                    <button className="custom-slider__button">
                      Add to Cart
                    </button>
                  </div>
                </div>
                <h3 className="custom-slider__title">{product.name}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default ProductSlider;