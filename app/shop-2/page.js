"use client";
import { useState, useMemo, useEffect } from "react";
import Preloader from "@/components/elements/Preloader";
import Layout from "@/components/layout/Layout";
import ShopList from "@/components/JVR/shopList/ShopList";
import { useFetchProductsQuery } from "@/features/api/productApi";
import ShopFilter from "@/components/shopFilter/ShopFilter";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function ShopPage() {
  const { data: products, error, isLoading } = useFetchProductsQuery();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [isFilterPopup, setIsFilterPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleSize = () => {
      setIsMobile(window.innerWidth <= 768);
    }
    handleSize()
    console.log("isMobile", isMobile);
    window.addEventListener('resize', handleSize)

    return () => {
      window.removeEventListener('resize', handleSize)
    }
  }, [isMobile])
  const toggleFilterPopup = () => {
    setIsFilterPopup(!isFilterPopup);
  }
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter(item => {
      const categoryMatch =
        selectedCategory.length === 0 ||
        selectedCategory.some(category =>
          item.productCategory?.toLowerCase() === category.toLowerCase()
        );

      const typeMatch =
        selectedType.length === 0 ||
        selectedType.some(type =>
          item.productType?.toLowerCase() === type.toLowerCase()
        );

      let reducedPrice = 0;
      if (selectedPrice === 1500) reducedPrice = 500;
      else if (selectedPrice === 2500) reducedPrice = 1500;

      const priceMatch =
        selectedPrice === 0 ||
        (item.productPrice >= reducedPrice && item.productPrice <= selectedPrice);
        const sizeMatch =
        selectedSize.length === 0 ||
        item.productSize[0].some(sizeItem => 
          selectedSize.includes(sizeItem)
        );
        console.log("sizeMatch", sizeMatch);
      return categoryMatch && typeMatch && priceMatch && sizeMatch;
    });
  }, [products, selectedCategory, selectedType, selectedPrice, selectedSize]);

  if (isLoading) return <Preloader />;
  if (error) return <div>Error: {error.message}</div>;

  
  return (
    <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop">
      {/* Mobile Filter */}

      <div className="mobile-filter-container">
        <button className="mobile-filter-button">
          FILTERS
        </button>
        {/* <div className="mobile-filter-content">
        <ShopFilter
                  onCategorySelect={setSelectedCategory}
                  onTypeSelect={setSelectedType}
                  onPriceSelect={setSelectedPrice}
                  onSizeSelect={setSelectedSize}
                />
        </div> */}
      </div>
      <div className="mobile-filter-page">
        <button>
        <IoMdArrowRoundBack style={{fontSize: "1.5rem"}} />
        <span>Filters</span>
        </button>
      </div>
      {/* End of mobile filter */}
      <div className={`${isMobile ? "" : "product-area pt-70 pb-20"}`}>
        <div className="custom-container">
          <div className="row">
            <div className="custom-filter-main-parent">

              <div className="custom-filter-inside-parent mob">
                <ShopFilter
                  ifMobile={isMobile}
                  onCategorySelect={setSelectedCategory}
                  onTypeSelect={setSelectedType}
                  onPriceSelect={setSelectedPrice}
                  onSizeSelect={setSelectedSize}
                />
              </div>

              <div className="custom-main-product">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(item => (
                    <ShopList
                      key={item._id}
                      thumb1={item.productImage[0]}
                      thumb2={item.productImage[1]}
                      id={item._id}
                      name={item.productName}
                      price={item.productPrice}
                      oldPrice={item.productOldPrice}
                      category={item.productCategory}
                      type={item.productType}
                      brand={item.productBrand}
                    />
                  ))
                ) : (
                  <div>No products found</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
