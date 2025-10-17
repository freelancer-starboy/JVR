"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    bg: "#f8f8f8",
    title: "Men’s Essentials",
    subtitle: "Summer Drop",
    description: "Discover sleek, everyday styles crafted for modern men.",
    link: "/shop-2?category=mens",
    bgImage: "/assets/img/banner/main/main-banner-1.png",
  },
  {
    bg: "#fff0f5",
    title: "Women’s Trends",
    subtitle: "New Season",
    description: "Fresh cuts and bold colors for the empowered woman.",
    link: "/shop-2?category=women",
     bgImage: "/assets/img/banner/main/main-banner-2.png",
  },
  {
    bg: "#f0f9ff",
    title: "Kids’ Collection",
    subtitle: "Mini Style",
    description: "Trendy, comfy fits for the little trendsetters.",
    link: "/shop-2?category=kids",
     bgImage: "/assets/img/banner/main/main-banner-3.jpg",
  },
];

export default function Slider2() {
  return (
    <section className="slider-area" style={{ overflow: "hidden" }}>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="text-slide d-flex align-items-center justify-content-center position-relative"
              style={{
                background: slide.bgImage
                  ? `url(${slide.bgImage}) center/cover no-repeat`
                  : slide.bg,
                height: "80vh",
                padding: "2rem",
                position: "relative",
                color: slide.bgImage ? "#fff" : "#111",
              }}
            >
              {/* Optional dark overlay for text readability on image */}
              {slide.bgImage && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.4)",
                    zIndex: 1,
                  }}
                />
              )}

              <div style={{ textAlign: "center", zIndex: 2 }}>
                <h4
                  style={{
                    fontSize: "1.25rem",
                    color: slide.bgImage ? "#ddd" : "#555",
                    marginBottom: "1rem",
                  }}
                >
                  {slide.subtitle}
                </h4>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                  }}
                >
                  {slide.title}
                </h1>
                <p
                  style={{
                    fontSize: "1rem",
                    color: slide.bgImage ? "#eee" : "#777",
                    maxWidth: "500px",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  {slide.description}
                </p>
                <Link
                  href={slide.link}
                  className="tp-btn"
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: slide.bgImage ? "#fff" : "#000",
                    color: slide.bgImage ? "#000" : "#fff",
                    borderRadius: "5px",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
